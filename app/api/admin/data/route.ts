import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import getMongoClient from "@/lib/mongodb";
import { getAdminCookieName, isAdminTokenValid } from "@/lib/admin";

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
    const database = client.db(databaseName);
    const [reviews, eventCounts, orderCounts] = await Promise.all([
      database.collection("reviews").find({}).sort({ createdAt: -1 }).limit(100).toArray(),
      database.collection("events").aggregate([{ $group: { _id: "$event", count: { $sum: 1 } } }]).toArray(),
      database.collection("orders").aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
    ]);
    return NextResponse.json({ reviews, eventCounts, orderCounts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin data lookup failed", error);
    return NextResponse.json({ error: "Admin data is temporarily unavailable." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { reviewId, status } = await request.json();
    if (typeof reviewId !== "string" || !["approved", "rejected"].includes(status)) return NextResponse.json({ error: "Invalid moderation request." }, { status: 400 });
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const { ObjectId } = await import("mongodb");
    await client.db(databaseName).collection("reviews").updateOne({ _id: new ObjectId(reviewId) }, { $set: { status, moderatedAt: new Date() } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Review moderation failed", error);
    return NextResponse.json({ error: "Review could not be moderated." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  try {
    const { reviewId } = await request.json();
    if (typeof reviewId !== "string") return NextResponse.json({ error: "Invalid review ID." }, { status: 400 });
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const { ObjectId } = await import("mongodb");
    const result = await client.db(databaseName).collection("reviews").deleteOne({ _id: new ObjectId(reviewId) });
    if (!result.deletedCount) return NextResponse.json({ error: "Review was not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Review removal failed", error);
    return NextResponse.json({ error: "Review could not be removed." }, { status: 500 });
  }
}
