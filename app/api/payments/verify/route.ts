import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { createReviewToken } from "@/lib/review-token";
import { getProduct } from "@/lib/catalog";
import { sendPurchaseEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const razorpayOrderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
    const razorpayPaymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
    const razorpaySignature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !secret || !databaseName) {
      return NextResponse.json({ error: "Payment verification details are incomplete." }, { status: 400 });
    }

    const expectedSignature = createHmac("sha256", secret).update(`${razorpayOrderId}|${razorpayPaymentId}`).digest("hex");
    if (expectedSignature !== razorpaySignature) return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });

    const client = await getMongoClient();
    const orders = client.db(databaseName).collection("orders");
    const existingOrder = await orders.findOne({ razorpayOrderId });
    if (!existingOrder) return NextResponse.json({ error: "Order was not found." }, { status: 404 });

    const order = await orders.findOneAndUpdate(
      { razorpayOrderId },
      { $set: { status: "paid", razorpayPaymentId, paidAt: new Date(), updatedAt: new Date() } },
      { returnDocument: "after" },
    );
    if (!order) return NextResponse.json({ error: "Order was not found." }, { status: 404 });

    if (!order.emailDeliverySent) {
      const product = getProduct(order.productKey);
      if (!product) return NextResponse.json({ error: "Purchased product was not found." }, { status: 500 });
      const emailId = await sendPurchaseEmail({ to: order.email, productTitle: order.productTitle, productFile: product.file, orderId: razorpayOrderId });
      await orders.updateOne({ razorpayOrderId }, { $set: { emailDeliverySent: true, emailDeliveryId: emailId, emailDeliveredAt: new Date(), updatedAt: new Date() } });

      // If there was a referral code, increment conversions
      if (order.referralCode) {
        await client.db(databaseName).collection("referral_codes").updateOne(
          { code: order.referralCode },
          { $inc: { conversions: 1 } }
        );
      }
    }

    return NextResponse.json({ reviewToken: createReviewToken(razorpayOrderId), productKey: order.productKey });
  } catch (error) {
    console.error("Payment verification failed", error);
    return NextResponse.json({ error: "We could not verify this payment." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId } = await request.json();
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName || typeof orderId !== "string") return NextResponse.json({ error: "Invalid order." }, { status: 400 });
    const client = await getMongoClient();
    await client.db(databaseName).collection("orders").updateOne(
      { razorpayOrderId: orderId, status: "created" },
      { $set: { status: "abandoned", abandonedAt: new Date(), updatedAt: new Date() } },
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Checkout cancellation tracking failed", error);
    return NextResponse.json({ error: "Could not record checkout status." }, { status: 500 });
  }
}
