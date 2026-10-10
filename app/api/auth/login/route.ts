import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { setSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-profile";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !username) {
      return NextResponse.json({ error: "Email and Username are required." }, { status: 400 });
    }

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const db = client.db(databaseName);

    await db.collection("users").updateOne(
      { email },
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

    const user = await getUserProfile(email, username);
    await setSession({ email, username });

    return NextResponse.json({
      success: true,
      user,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}
