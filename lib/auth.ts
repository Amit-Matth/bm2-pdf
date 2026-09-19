import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const AUTH_COOKIE = "pdfduniya_session";
const JWT_SECRET = process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || "pdfduniya-default-secret-very-long";

export type UserSession = {
  email: string;
  username: string;
  iat: number;
};

export function createToken(payload: Omit<UserSession, "iat">) {
  const iat = Math.floor(Date.now() / 1000);
  const data = JSON.stringify({ ...payload, iat });
  const signature = createHmac("sha256", JWT_SECRET).update(data).digest("hex");
  return Buffer.from(`${data}.${signature}`).toString("base64");
}

export function verifyToken(token: string): UserSession | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const lastDotIndex = decoded.lastIndexOf(".");
    if (lastDotIndex === -1) return null;

    const dataStr = decoded.substring(0, lastDotIndex);
    const signature = decoded.substring(lastDotIndex + 1);
    const expectedSignature = createHmac("sha256", JWT_SECRET).update(dataStr).digest("hex");

    if (signature !== expectedSignature) return null;

    const payload = JSON.parse(dataStr) as UserSession;
    // Expire after 30 days
    if (Date.now() / 1000 - payload.iat > 60 * 60 * 24 * 30) return null;

    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(user: Omit<UserSession, "iat">) {
  const token = createToken(user);
  const cookieStore = await cookies();
  const thirtyDays = 60 * 60 * 24 * 30;

  // In production, we use secure cookies.
  // However, if we're testing a production build on localhost, browsers might block it.
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: thirtyDays,
    expires: new Date(Date.now() + thirtyDays * 1000),
    path: "/",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
