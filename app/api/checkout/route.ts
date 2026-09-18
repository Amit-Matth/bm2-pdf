import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { getProduct } from "@/lib/catalog";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const requestedProductKey = typeof body.productKey === "string" ? body.productKey : "";
    const productKey = requestedProductKey === "math" || requestedProductKey === "english" ? "bundle" : requestedProductKey;
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const product = getProduct(productKey);
    if (!product || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Choose a product and enter a valid email." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!keyId || !keySecret || !databaseName) throw new Error("Payment environment variables are not configured");

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: product.priceInPaise, currency: "INR", receipt: `pdf-${Date.now()}` }),
    });
    if (!razorpayResponse.ok) throw new Error("Razorpay order creation failed");
    const razorpayOrder = await razorpayResponse.json();

    const client = await getMongoClient();
    await client.db(databaseName).collection("orders").insertOne({
      razorpayOrderId: razorpayOrder.id,
      productKey,
      productTitle: product.title,
      email,
      amount: product.priceInPaise,
      referralCode: typeof body.referralCode === "string" ? body.referralCode.toUpperCase() : null,
      status: "created",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ orderId: razorpayOrder.id, amount: product.priceInPaise, keyId, productTitle: product.title });
  } catch (error) {
    console.error("Checkout order creation failed", error);
    return NextResponse.json({ error: "Checkout is not available right now. Please try again." }, { status: 500 });
  }
}
