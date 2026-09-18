import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, platform, channelHandle, followers } = body;

    if (!name || !email || !platform || !channelHandle) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const db = client.db(databaseName);

    // Check if a request already exists for this email
    const existing = await db.collection("referral_requests").findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "A request with this email already exists." }, { status: 409 });
    }

    await db.collection("referral_requests").insertOne({
      name,
      email: email.toLowerCase(),
      platform,
      channelHandle,
      followers: followers || "N/A",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ message: "Referral request submitted successfully. We will review it and get back to you soon." });
  } catch (error) {
    console.error("Referral request failed", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
