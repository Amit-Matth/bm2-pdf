import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { createReviewToken } from "@/lib/review-token";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const productKey = typeof body.productKey === "string" ? body.productKey : "";
    if (!orderId || !email || !productKey) return NextResponse.json({ error: "Enter your order ID and purchase email." }, { status: 400 });

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const order = await client.db(databaseName).collection("orders").findOne({ razorpayOrderId: orderId, email, status: "paid" });
    if (!order) return NextResponse.json({ error: "We could not verify this paid order. Check the order ID and purchase email." }, { status: 403 });
    if (!["math", "english", "bundle"].includes(order.productKey)) {
      return NextResponse.json({ error: "This order does not include a supported PDF product." }, { status: 403 });
    }

    return NextResponse.json({ orderId, token: createReviewToken(orderId), email, productKeys: ["math", "english"] });
  } catch (error) {
    console.error("Review access recovery failed", error);
    return NextResponse.json({ error: "Review access could not be restored right now." }, { status: 500 });
  }
}
