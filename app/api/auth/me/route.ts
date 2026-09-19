import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import getMongoClient from "@/lib/mongodb";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  try {
    const databaseName = process.env.MONGODB_DB_NAME;
    const client = await getMongoClient();
    const db = client.db(databaseName!);

    const safeEmail = session.email.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Check if user is an approved referrer
    const [referral, paidOrders] = await Promise.all([
      db.collection("referral_codes").findOne({
        $or: [
          { referrerEmail: { $regex: new RegExp(`^${safeEmail}$`, "i") } },
          { email: { $regex: new RegExp(`^${safeEmail}$`, "i") } }
        ]
      }),
      db.collection("orders").find({ email: session.email.toLowerCase(), status: "paid" }).toArray()
    ]);

    const purchasedProducts = paidOrders.map(order => order.productKey);
    // Any paid Math/English purchase grants access to both PDFs.
    if (purchasedProducts.includes("bundle") || purchasedProducts.includes("math") || purchasedProducts.includes("english")) {
      purchasedProducts.push("math", "english");
    }

    return NextResponse.json({
      user: {
        ...session,
        referralCode: referral?.code || null,
        purchasedProducts: Array.from(new Set(purchasedProducts))
      }
    });
  } catch (error) {
    return NextResponse.json({ user: session });
  }
}
