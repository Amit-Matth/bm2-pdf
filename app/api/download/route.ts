import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";
import { verifyDownloadToken } from "@/lib/download-token";

const allowedFiles = new Set(["MATH MAGIC.pdf", "Speak English.pdf"]);

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") || "";
    const payload = verifyDownloadToken(token);
    if (!payload || !allowedFiles.has(payload.file)) return NextResponse.json({ error: "This download link is invalid or expired." }, { status: 403 });

    const databaseName = process.env.MONGODB_DB_NAME;
    if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");
    const client = await getMongoClient();
    const order = await client.db(databaseName).collection("orders").findOne({ razorpayOrderId: payload.orderId, status: "paid" });
    if (!order) return NextResponse.json({ error: "This purchase could not be verified." }, { status: 403 });

    const filePath = path.join(process.cwd(), "private", "pdfs", payload.file);
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${payload.file}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Protected PDF download failed", error);
    return NextResponse.json({ error: "This PDF is unavailable right now." }, { status: 404 });
  }
}
