"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import RevealBlock from "../components/reveal-block";
import SiteHeader from "../components/site-header";

type RazorpayResult = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void };
declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance; } }

const productsData: Record<string, { title: string; price: string; paise: number; features: string[]; badge: string }> = {
  math: {
    title: "SpeedMath: Calculate Faster",
    price: "₹29",
    paise: 2900,
    badge: "BOGO OFFER",
    features: ["Fast addition & subtraction shortcuts", "Multiplication patterns made simple", "Fractions, percentages, and ratios", "Speed drills with answer keys"]
  },
  english: {
    title: "Think in English & Speak Fluently",
    price: "₹29",
    paise: 2900,
    badge: "BOGO OFFER",
    features: ["Stop translating word-by-word", "Speak fluidly without pausing", "Fix high-frequency phrasing", "Sound natural in everyday chats"]
  },
  bundle: {
    title: "Complete PDF Bundle",
    price: "₹29",
    paise: 2900,
    badge: "BOGO OFFER",
    features: ["Includes both SpeedMath Guide", "Includes English Speaking Handbook", "One-time payment, lifetime access", "High-resolution printable PDFs"]
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productKey = searchParams.get("p") || "bundle";
  const ref = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [referralCode, setReferralCode] = useState(ref.toUpperCase());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const product = productsData[productKey] || productsData.bundle;

  useEffect(() => {
    if (ref) {
      setReferralCode(ref.toUpperCase());
    }
  }, [ref]);

  async function startCheckout() {
    if (!email) { setError("Enter the email where you want your PDF delivered."); return; }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "checkout_started", productKey, path: window.location.pathname }) });
      const orderResponse = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productKey, email, referralCode }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) { setError(order.error || "Checkout is unavailable."); return; }

      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => openCheckout(order);
        script.onerror = () => setError("Payment checkout could not load.");
        document.body.appendChild(script);
      } else openCheckout(order);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function openCheckout(order: { orderId: string; amount: number; keyId: string; productTitle: string }) {
    if (!window.Razorpay) return;
    let isPaymentSuccessful = false;

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: "INR",
      name: "pdfDuniya",
      description: order.productTitle,
      order_id: order.orderId,
      prefill: { email },
      handler: async (result: RazorpayResult) => {
        isPaymentSuccessful = true;
        const response = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) });
        const data = await response.json();
        if (!response.ok) { setError(data.error || "Payment verification failed."); return; }

        const access = { orderId: result.razorpay_order_id, token: data.reviewToken, email: email.trim().toLowerCase() };
        window.localStorage.setItem("pdfduniya-review-access-math", JSON.stringify(access));
        window.localStorage.setItem("pdfduniya-review-access-english", JSON.stringify(access));

        setMessage("Payment successful! Please check your email for the PDFs.");
        await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "checkout_completed", productKey, path: window.location.pathname }) });

        setTimeout(() => router.push("/"), 5000);
      },
      modal: {
        ondismiss: () => {
          if (isPaymentSuccessful) return;
          void fetch("/api/payments/verify", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: order.orderId }) });
          void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "checkout_cancelled", productKey, path: window.location.pathname }) });
        },
      },
    });
    checkout.open();
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="admin-shell" style={{ minHeight: "calc(100vh - 84px)", display: "flex", alignItems: "center", background: "radial-gradient(circle at 80% 20%, rgba(38,120,255,0.1), transparent 40rem), var(--night)" }}>
        <div className="inner-page" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }} className="checkout-grid">

            {/* Left Column: Product Info */}
            <div className="checkout-info">
              <RevealBlock direction="left">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <span className="catalog-badge" style={{ background: "var(--pink)", color: "#fff" }}>71% OFF</span>
                  <span className="catalog-badge" style={{ background: "var(--lime)", color: "#000" }}>BUY 1 GET 1 FREE</span>
                </div>

                <p className="eyebrow">Limited Time Offer</p>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", lineHeight: "1", marginBottom: "25px", fontWeight: "800" }}>{product.title}</h1>

                <div style={{ marginBottom: "35px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
                    <strong style={{ color: "var(--lime)", fontSize: "3rem", letterSpacing: "-0.04em" }}>₹29</strong>
                    <span style={{ color: "var(--muted)", textDecoration: "line-through", fontSize: "1.4rem" }}>₹198</span>
                  </div>
                  <p style={{ color: "var(--muted)", marginTop: "10px", fontSize: "1rem" }}>
                    Normally ₹99 each. Get both PDFs today for just ₹29.
                  </p>
                </div>

                <div style={{ padding: "30px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid var(--line)" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "20px", color: "var(--ink)" }}>What&apos;s included in this bundle:</h3>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    <li style={{ display: "flex", gap: "12px", marginBottom: "15px", color: "var(--ink)", fontWeight: "500" }}>
                      <span style={{ color: "var(--lime)" }}>✓</span> SpeedMath Calculation Guide (68 Pages)
                    </li>
                    <li style={{ display: "flex", gap: "12px", marginBottom: "15px", color: "var(--ink)", fontWeight: "500" }}>
                      <span style={{ color: "var(--lime)" }}>✓</span> English Speaking Handbook (74 Pages)
                    </li>
                    <li style={{ display: "flex", gap: "12px", marginBottom: "15px", color: "var(--ink)", fontWeight: "500" }}>
                      <span style={{ color: "var(--lime)" }}>✓</span> High-resolution printable format
                    </li>
                    <li style={{ display: "flex", gap: "12px", color: "var(--ink)", fontWeight: "500" }}>
                      <span style={{ color: "var(--lime)" }}>✓</span> Lifetime access & instant delivery
                    </li>
                  </ul>
                </div>
              </RevealBlock>
            </div>

            {/* Right Column: Checkout Card */}
            <div className="checkout-form-container">
              <RevealBlock direction="right" delay={150}>
                <div className="admin-login" style={{ width: "100%", margin: "0", padding: "40px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)", borderRadius: "20px" }}>
                  <h2 style={{ fontSize: "1.8rem", marginBottom: "30px" }}>Checkout</h2>

                  <div className="contact-form" style={{ maxWidth: "100%", margin: "0", background: "transparent", border: "0", padding: "0" }}>
                    <div className="form-row">
                      <label htmlFor="checkout-email">Delivery Email</label>
                      <input id="checkout-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                      <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "8px" }}>PDFs will be sent here automatically after payment.</p>
                    </div>

                    <div className="form-row">
                      <label htmlFor="checkout-referral" style={{ display: "flex", justifyContent: "space-between" }}>
                        Referral Code (Optional)
                        <Link href="/referral" target="_blank" style={{ color: "var(--lime)", fontSize: "0.7rem" }}>Get code?</Link>
                      </label>
                      <input id="checkout-referral" type="text" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="Enter code" />
                    </div>

                    <button className="button button-primary" style={{ width: "100%", marginTop: "20px", height: "60px", fontSize: "1.1rem", borderRadius: "12px" }} onClick={startCheckout} disabled={isSubmitting}>
                      {isSubmitting ? "Redirecting to Payment..." : `Pay ₹29 & Get Both PDFs →`}
                    </button>

                    {error && <p className="form-error" style={{ background: "rgba(255,141,168,0.1)", padding: "12px", borderRadius: "8px", marginTop: "20px" }}>{error}</p>}
                    {message && <p className="form-success" style={{ background: "rgba(217,255,112,0.1)", padding: "12px", borderRadius: "8px", marginTop: "20px" }}>{message}</p>}

                    <div style={{ marginTop: "35px", textAlign: "center", borderTop: "1px solid var(--line)", paddingTop: "25px" }}>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        <span style={{ color: "var(--lime)", marginRight: "5px" }}>✓</span> Secure Razorpay Checkout
                      </p>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            </div>

          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 960px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 50px !important; }
          .checkout-info { text-align: center; }
          .checkout-info div { justify-content: center; }
          .checkout-info ul { text-align: left; }
        }
      `}</style>
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense fallback={<div className="admin-shell"><div className="admin-login"><h1>Loading...</h1></div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
