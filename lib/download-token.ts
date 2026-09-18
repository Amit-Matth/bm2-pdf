import { createHmac, timingSafeEqual } from "node:crypto";

type DownloadPayload = {
  orderId: string;
  file: string;
  expiresAt: number;
};

function getSecret() {
  return process.env.DOWNLOAD_TOKEN_SECRET || process.env.REVIEW_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "development-download-secret";
}

function encode(payload: DownloadPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

export function createDownloadToken(orderId: string, file: string, lifetimeMs = 48 * 60 * 60 * 1000) {
  const payload = encode({ orderId, file, expiresAt: Date.now() + lifetimeMs });
  const signature = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyDownloadToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = createHmac("sha256", getSecret()).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as DownloadPayload;
    if (!decoded.orderId || !decoded.file || !Number.isFinite(decoded.expiresAt) || decoded.expiresAt < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}
