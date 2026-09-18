import { NextResponse } from "next/server";
import { createAdminToken, getAdminCookieName } from "@/lib/admin";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (typeof password !== "string" || !process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(getAdminCookieName(), createAdminToken(), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
  return response;
}
