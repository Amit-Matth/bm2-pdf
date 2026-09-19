import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { verifyReviewToken, createReviewToken } from "@/lib/review-token";
import { getSession } from "@/lib/auth";

const avatarPattern = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

function readAvatar(value: unknown) {
  if (typeof value !== "string" || value.length === 0) return "";
  return value.length <= 1_500_000 && avatarPattern.test(value) ? value : "";
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const productKey = url.searchParams.get("productKey");
  if (!productKey) return NextResponse.json({ reviews: [] });
  try {
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const database = client.db(databaseName);

    const session = await getSession();
    const orderId = url.searchParams.get("orderId");
    const token = url.searchParams.get("reviewToken");
    const email = url.searchParams.get("email")?.trim().toLowerCase() || session?.email;

    // Try to find a review if they provide proof of purchase (token or session)
    if (email && ( (orderId && token && verifyReviewToken(token, orderId)) || session )) {
      const query = orderId ? { razorpayOrderId: orderId, email, status: "paid" } : { email, status: "paid", productKey: { $in: ["math", "english", "bundle"] } };
      const order = await database.collection("orders").findOne(query);

      if (order) {
        const review = await database.collection("reviews").findOne({ orderId: order.razorpayOrderId, productKey });
        const reviews = await database.collection("reviews").find({ productKey, status: "approved" }).sort({ createdAt: -1 }).limit(20).toArray();
        return NextResponse.json({
          reviews: reviews.map(({ _id, name, rating, comment, avatar, createdAt }) => ({ id: _id.toString(), name, rating, comment, avatar: avatar || "", createdAt })),
          review: review ? { name: review.name, rating: review.rating, comment: review.comment, avatar: review.avatar || "", status: review.status } : null,
          canReview: true,
          orderId: order.razorpayOrderId,
          reviewToken: createReviewToken(order.razorpayOrderId)
        });
      }
    }

    const reviews = await client.db(databaseName).collection("reviews").find({ productKey, status: "approved" }).sort({ createdAt: -1 }).limit(20).toArray();
    return NextResponse.json({
      reviews: reviews.map(({ _id, name, rating, comment, avatar, createdAt }) => ({ id: _id.toString(), name, rating, comment, avatar: avatar || "", createdAt })),
      canReview: false
    });
  } catch (error) {
    console.error("Reviews lookup failed", error);
    return NextResponse.json({ error: "Reviews are temporarily unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const token = typeof body.reviewToken === "string" ? body.reviewToken : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const productKey = typeof body.productKey === "string" ? body.productKey : "";
    const avatar = readAvatar(body.avatar);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    const rating = Number(body.rating);
    if (!orderId || !token || !email || !productKey || !name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5 || name.length > 80 || comment.length > 1000 || !verifyReviewToken(token, orderId)) {
      return NextResponse.json({ error: "Only verified purchasers can submit a valid review." }, { status: 400 });
    }
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const database = client.db(databaseName);
    const order = await database.collection("orders").findOne({ razorpayOrderId: orderId, status: "paid" });
    if (!order) return NextResponse.json({ error: "This purchase could not be verified." }, { status: 403 });
    if (order.email !== email) return NextResponse.json({ error: "Use the email address used for this purchase." }, { status: 403 });
    if (!['math', 'english', 'bundle'].includes(order.productKey) || !['math', 'english'].includes(productKey)) return NextResponse.json({ error: "This purchase does not include this product." }, { status: 403 });
    const existingReview = await database.collection("reviews").findOne({ orderId, productKey });
    if (existingReview) return NextResponse.json({ error: "This purchase already has a review.", review: { name: existingReview.name, rating: existingReview.rating, comment: existingReview.comment } }, { status: 409 });
    const productTitle = productKey === "math" ? "SpeedMath: Calculate Faster" : productKey === "english" ? "Speak English with Confidence" : order.productTitle;
    await database.collection("reviews").insertOne({ orderId, productKey, productTitle, name, rating, comment, avatar, status: "pending", createdAt: new Date() });
    return NextResponse.json({ message: "Thanks. Your review is waiting for approval." }, { status: 201 });
  } catch (error) {
    console.error("Review submission failed", error);
    return NextResponse.json({ error: "We could not submit your review right now." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const token = typeof body.reviewToken === "string" ? body.reviewToken : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const productKey = typeof body.productKey === "string" ? body.productKey : "";
    const avatar = readAvatar(body.avatar);
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const comment = typeof body.comment === "string" ? body.comment.trim() : "";
    const rating = Number(body.rating);
    if (!orderId || !token || !email || !productKey || !name || !comment || !Number.isInteger(rating) || rating < 1 || rating > 5 || name.length > 80 || comment.length > 1000 || !verifyReviewToken(token, orderId)) {
      return NextResponse.json({ error: "Only verified purchasers can update a valid review." }, { status: 400 });
    }
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const database = client.db(databaseName);
    const order = await database.collection("orders").findOne({ razorpayOrderId: orderId, status: "paid" });
    if (!order || order.email !== email || !["math", "english", "bundle"].includes(order.productKey) || !["math", "english"].includes(productKey)) {
      return NextResponse.json({ error: "This purchase could not be verified for this review." }, { status: 403 });
    }
    const avatarUpdate = avatar ? { avatar } : {};
    const result = await database.collection("reviews").updateOne(
      { orderId, productKey },
      { $set: { name, rating, comment, ...avatarUpdate, status: "pending", updatedAt: new Date() } },
    );
    if (!result.matchedCount) return NextResponse.json({ error: "Your previous review could not be found." }, { status: 404 });
    return NextResponse.json({ message: "Your review was updated and sent for approval again." });
  } catch (error) {
    console.error("Review update failed", error);
    return NextResponse.json({ error: "We could not update your review right now." }, { status: 500 });
  }
}
