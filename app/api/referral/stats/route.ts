import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.toUpperCase();

    if (!code) return NextResponse.json({ error: "Referral code is required." }, { status: 400 });

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const db = client.db(databaseName);

    const referralData = await db.collection("referral_codes").findOne({ code });
    if (!referralData) return NextResponse.json({ error: "Referral code not found." }, { status: 404 });

    // Track a click if this is called from the stats page (optional, but let's just return stats here)
    // The clicks should be tracked when the user lands on the site with ?ref=CODE.
    // We will do that in a separate action or just here.

    return NextResponse.json({
      code: referralData.code,
      name: referralData.referrerName,
      clicks: referralData.clicks,
      conversions: referralData.conversions,
      createdAt: referralData.createdAt,
    });
  } catch (error) {
    console.error("Referral stats lookup failed", error);
    return NextResponse.json({ error: "Could not fetch referral stats." }, { status: 500 });
  }
}
