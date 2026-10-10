import getMongoClient from "@/lib/mongodb";

export type UserProfile = {
  email: string;
  username: string;
  referralCode: string | null;
  purchasedProducts: string[];
};

export async function getUserProfile(email: string, username: string): Promise<UserProfile> {
  const databaseName = process.env.MONGODB_DB_NAME;
  if (!databaseName) throw new Error("Missing MONGODB_DB_NAME environment variable");

  const client = await getMongoClient();
  const database = client.db(databaseName);
  const safeEmail = email.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const emailPattern = new RegExp(`^${safeEmail}$`, "i");

  const [referral, paidOrders] = await Promise.all([
    database.collection("referral_codes").findOne({
      $or: [
        { referrerEmail: { $regex: emailPattern } },
        { email: { $regex: emailPattern } },
      ],
    }),
    database.collection("orders").find(
      { email: { $regex: emailPattern }, status: "paid" },
      { projection: { productKey: 1 } },
    ).toArray(),
  ]);

  const purchasedProducts = new Set(
    paidOrders
      .map((order) => order.productKey)
      .filter((productKey): productKey is string => typeof productKey === "string"),
  );

  if (purchasedProducts.has("bundle") || purchasedProducts.has("math") || purchasedProducts.has("english")) {
    purchasedProducts.add("math");
    purchasedProducts.add("english");
  }

  return {
    email: email.toLowerCase(),
    username,
    referralCode: typeof referral?.code === "string" ? referral.code : null,
    purchasedProducts: Array.from(purchasedProducts),
  };
}
