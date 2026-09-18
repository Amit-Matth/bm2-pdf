import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

function getSecret() {
  return process.env.REVIEW_TOKEN_SECRET || process.env.ADMIN_PASSWORD || "development-review-secret";
}

export function createReviewToken(orderId: string) {
  const nonce = randomBytes(18).toString("hex");
  const payload = `${orderId}.${nonce}`;
  const signature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyReviewToken(token: string, orderId: string) {
  const [tokenOrderId, nonce, signature] = token.split(".");
  if (!tokenOrderId || !nonce || !signature || tokenOrderId !== orderId) return false;
  const payload = `${tokenOrderId}.${nonce}`;
  const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer);
}
