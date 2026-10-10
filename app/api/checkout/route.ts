import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { getProduct } from "@/lib/catalog";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required to start checkout." }, { status: 401 });
    }

    const body = await request.json();
    const requestedProductKey = typeof body.productKey === "string" ? body.productKey : "";
    const productKey = requestedProductKey === "math" || requestedProductKey === "english" ? "bundle" : requestedProductKey;
    const email = session.email.trim().toLowerCase();
    const product = getProduct(productKey);
    if (!product || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Choose a product and enter a valid email." }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

    const client = await getMongoClient();
    const safeEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const paidOrders = await client.db(databaseName).collection("orders").find(
      { email: { $regex: new RegExp(`^${safeEmail}$`, "i") }, status: "paid" },
      { projection: { productKey: 1 } },
    ).toArray();
    const purchasedProducts = new Set(
      paidOrders
        .map((order) => order.productKey)
        .filter((key): key is string => typeof key === "string"),
    );
    if (purchasedProducts.has("bundle") || purchasedProducts.has("math") || purchasedProducts.has("english")) {
      purchasedProducts.add("math");
      purchasedProducts.add("english");
      return NextResponse.json(
        {
          error: "This account has already purchased the PDF bundle.",
          alreadyPurchased: true,
          purchasedProducts: Array.from(purchasedProducts),
        },
        { status: 409, headers: { "Cache-Control": "no-store" } },
      );
    }

    if (!keyId || !keySecret) throw new Error("Payment environment variables are not configured");
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: product.priceInPaise, currency: "INR", receipt: `pdf-${Date.now()}` }),
    });
    if (!razorpayResponse.ok) throw new Error("Razorpay order creation failed");
    const razorpayOrder = await razorpayResponse.json();

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

    return NextResponse.json(
      { orderId: razorpayOrder.id, amount: product.priceInPaise, keyId, productTitle: product.title },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("Checkout order creation failed", error);
    return NextResponse.json({ error: "Checkout is not available right now. Please try again." }, { status: 500 });
  }
}
