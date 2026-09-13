import { NextResponse } from "next/server";
import getMongoClient from "@/lib/mongodb";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!name || !email || !subject || !message || !emailPattern.test(email)) {
      return NextResponse.json({ error: "Please provide a valid name, email, subject, and message." }, { status: 400 });
    }

    if (name.length > 120 || email.length > 254 || subject.length > 200 || message.length > 5000) {
      return NextResponse.json({ error: "One or more fields are too long." }, { status: 400 });
    }

    const client = await getMongoClient();
    const databaseName = process.env.MONGODB_DB_NAME;

    if (!databaseName) {
      throw new Error("Missing MONGODB_DB_NAME environment variable");
    }

    await client.db(databaseName).collection("contactMessages").insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Thanks, your message has been sent." }, { status: 201 });
  } catch (error) {
    console.error("Contact form submission failed", error);
    return NextResponse.json({ error: "We could not send your message right now. Please try again." }, { status: 500 });
  }
}
