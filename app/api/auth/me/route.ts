import { NextResponse } from "next/server";
import { getSession, setSession } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-profile";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const user = await getUserProfile(session.email, session.username);
    await setSession(session);
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Current user lookup failed", error);
    return NextResponse.json(
      { error: "We could not load your account right now." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
