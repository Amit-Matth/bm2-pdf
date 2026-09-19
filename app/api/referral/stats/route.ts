import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) return NextResponse.json({ error: "Referral code is required." }, { status: 400 });

    const session = await getSession();
    if (!session || !session.email) {
      return NextResponse.json({ error: "Authentication required. Please sign in." }, { status: 401 });
    }

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const db = client.db(databaseName);

    // Find referral code case-insensitively
    const referralData = await db.collection("referral_codes").findOne({
      code: { $regex: new RegExp(`^${code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, "i") }
    });

    if (!referralData) {
      return NextResponse.json({ error: "Referral code not found." }, { status: 404 });
    }

    const referrerEmail = referralData.referrerEmail || referralData.email || "";

    // Security check: Email must match (case-insensitive)
    if (!referrerEmail || referrerEmail.toLowerCase() !== session.email.toLowerCase()) {
      return NextResponse.json({ error: "Access denied. This dashboard belongs to another user." }, { status: 403 });
    }

    const conversions = referralData.conversions ?? 0;
    const commissionPercentage = 21;
    const minWithdrawalLimit = 100;
    // 21% of ₹29 = ₹6.09 per conversion
    const estimatedEarnings = Math.round(conversions * 29 * (commissionPercentage / 100));

    return NextResponse.json({
      code: referralData.code || code,
      name: referralData.referrerName || referralData.name || "Referrer",
      clicks: referralData.clicks ?? 0,
      conversions,
      commissionPercentage,
      minWithdrawalLimit,
      estimatedEarnings,
      createdAt: referralData.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    console.error("Referral stats lookup failed", error);
    return NextResponse.json({ error: "Could not fetch referral stats." }, { status: 500 });
  }
}

