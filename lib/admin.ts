import { createHmac, timingSafeEqual } from "node:crypto";

const cookieName = "pdfduniya_admin";

export function getAdminCookieName() {
  return cookieName;
}

export function createAdminToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Missing ADMIN_PASSWORD environment variable");
  return createHmac("sha256", password).update("pdfduniya-admin").digest("hex");
}

export function isAdminTokenValid(token: string | undefined) {
  if (!token) return false;
  const expected = createAdminToken();
  const actualBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
