import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

export async function GET() {
  try {
    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const database = client.db(databaseName);

    // Fetch up to 6 featured/approved reviews from any product
    const reviews = await database
      .collection("reviews")
      .find({ status: "approved" })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6)
      .toArray();

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        name: r.name,
        rating: r.rating,
        comment: r.comment,
        avatar: r.avatar || "",
        productTitle: r.productTitle,
        createdAt: r.createdAt
      })),
    });
  } catch (error) {
    console.error("Featured reviews lookup failed", error);
    return NextResponse.json({ error: "Reviews are temporarily unavailable." }, { status: 500 });
  }
}
