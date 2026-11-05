import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import getMongoClient from "@/lib/mongodb";

const allowedEvents = new Set(["visit", "checkout_started", "checkout_cancelled", "checkout_completed", "referral_click"]);
const visitorCookieName = "bm2pdf_visitor";
const sessionWindowMs = 30 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = typeof body.event === "string" ? body.event : "";
    if (!allowedEvents.has(event)) return NextResponse.json({ error: "Invalid event." }, { status: 400 });
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const cookieStore = await cookies();
    const existingVisitorId = cookieStore.get(visitorCookieName)?.value;
    const visitorId = existingVisitorId || randomUUID();
    const now = new Date();
    const client = await getMongoClient();
    const events = client.db(databaseName).collection("events");
    const eventDetails = {
      visitorId,
      productKey: typeof body.productKey === "string" ? body.productKey : undefined,
      path: typeof body.path === "string" ? body.path.slice(0, 200) : undefined,
      createdAt: now,
    };

    await events.insertOne({ event, ...eventDetails });
    if (event === "visit") {
      const dayStart = new Date(now);
      dayStart.setUTCHours(0, 0, 0, 0);
      const previousVisit = await events.findOne({ visitorId, event: "visit", createdAt: { $lt: now } });
      const uniqueToday = await events.findOne({ visitorId, event: "unique_visit", createdAt: { $gte: dayStart } });
      const returningToday = await events.findOne({ visitorId, event: "returning_visit", createdAt: { $gte: dayStart } });
      const recentEvent = await events.findOne({ visitorId, createdAt: { $gte: new Date(now.getTime() - sessionWindowMs), $lt: now } });
      if (!uniqueToday) await events.insertOne({ event: "unique_visit", ...eventDetails });
      if (previousVisit && !returningToday) await events.insertOne({ event: "returning_visit", ...eventDetails });
      if (!recentEvent) await events.insertOne({ event: "session_start", ...eventDetails });
    }

    if (event === "referral_click" && typeof body.referralCode === "string") {
      await client.db(databaseName).collection("referral_codes").updateOne(
        { code: body.referralCode.toUpperCase() },
        { $inc: { clicks: 1 } }
      );
    }

    const response = NextResponse.json({ ok: true, visitorType: event === "visit" ? "tracked" : undefined }, { status: 201 });
    if (!existingVisitorId) response.cookies.set(visitorCookieName, visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch (error) {
    console.error("Analytics event failed", error);
    return NextResponse.json({ error: "Event could not be recorded." }, { status: 500 });
  }
}
