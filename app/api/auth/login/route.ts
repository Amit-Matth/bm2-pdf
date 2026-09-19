import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { setSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json({ error: "Email and Username are required." }, { status: 400 });
    }

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const db = client.db(databaseName);

    // Update or create user
    await db.collection("users").updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          username,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date(),
          referralApproved: false
        }
      },
      { upsert: true }
    );

    await setSession({ email: email.toLowerCase(), username });

    // Check if user already has a referral code
    const referral = await db.collection("referral_codes").findOne({
      referrerEmail: email.toLowerCase()
    });

    return NextResponse.json({
      success: true,
      user: {
        email,
        username,
        referralCode: referral?.code || null
      }
    });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
