import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getMongoClient from "@/lib/mongodb";
import { getAdminCookieName, isAdminTokenValid } from "@/lib/admin";
import { sendReferralApprovalEmail, sendReferralRemovalEmail } from "@/lib/email";

async function requireAdmin() {
  const cookieStore = await cookies();
  return isAdminTokenValid(cookieStore.get(getAdminCookieName())?.value);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const requests = await client.db(databaseName).collection("referral_requests").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Referral requests lookup failed", error);
    return NextResponse.json({ error: "Could not fetch referral requests." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { requestId, status, referralCode } = await request.json();
    if (typeof requestId !== "string" || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const { ObjectId } = await import("mongodb");
    const db = client.db(databaseName);

    const referralRequest = await db.collection("referral_requests").findOne({ _id: new ObjectId(requestId) });
    if (!referralRequest) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    if (status === "approved") {
      if (!referralCode || !/^[A-Z0-9]+$/.test(referralCode)) {
        return NextResponse.json({ error: "Provide a valid alphanumeric referral code (e.g. YT100)." }, { status: 400 });
      }

      // Check if code is already taken
      const existingCode = await db.collection("referral_codes").findOne({ code: referralCode.toUpperCase() });
      if (existingCode) return NextResponse.json({ error: "This referral code is already in use." }, { status: 409 });

      await db.collection("referral_codes").insertOne({
        code: referralCode.toUpperCase(),
        referrerEmail: referralRequest.email,
        referrerName: referralRequest.name,
        clicks: 0,
        conversions: 0,
        createdAt: new Date(),
      });

      await sendReferralApprovalEmail({ to: referralRequest.email, name: referralRequest.name, referralCode: referralCode.toUpperCase() });
    }

    await db.collection("referral_requests").updateOne({ _id: new ObjectId(requestId) }, { $set: { status, moderatedAt: new Date(), referralCode: status === "approved" ? referralCode.toUpperCase() : null } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Referral moderation failed", error);
    return NextResponse.json({ error: "Could not moderate referral request." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { requestId } = await request.json();
    if (typeof requestId !== "string") return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const { ObjectId } = await import("mongodb");
    const db = client.db(databaseName);

    const referralRequest = await db.collection("referral_requests").findOne({ _id: new ObjectId(requestId) });
    if (!referralRequest) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    // If it was approved, delete the referral code record
    if (referralRequest.referralCode) {
      await db.collection("referral_codes").deleteOne({ code: referralRequest.referralCode });
    }

    // Mark as removed
    await db.collection("referral_requests").updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: "removed", referralCode: null, removedAt: new Date() } }
    );

    // Send email
    await sendReferralRemovalEmail({ to: referralRequest.email, name: referralRequest.name });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Referral removal failed", error);
    return NextResponse.json({ error: "Could not remove referral." }, { status: 500 });
  }
}
