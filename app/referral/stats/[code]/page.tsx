"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import SiteFooter from "../../../components/site-footer";
import RevealBlock from "../../../components/reveal-block";
import { useUser } from "../../../contexts/UserContext";

type Stats = {
  code: string;
  name: string;
  clicks: number;
  conversions: number;
  createdAt: string;
  commissionPercentage?: number;
  minWithdrawalLimit?: number;
  estimatedEarnings?: number;
};

export default function ReferrerDashboard() {
  const { code } = useParams();
  const { user, setShowAuthModal, loading: authLoading } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [user, authLoading, setShowAuthModal]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`/api/referral/stats?code=${code}`);
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Could not load stats.");
        } else {
          setStats(data);
        }
      } catch (err) {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    }
    if (code && user) fetchStats();
  }, [code, user]);

  if (authLoading || (user && loading)) return (
    <div className="site-shell">
      <SiteHeader />
      <main className="admin-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "300px", textAlign: "center" }}>
          <p className="eyebrow">Fetching Data...</p>
          <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", marginTop: "15px" }}>
            <div style={{
              height: "100%",
              width: "50%",
              background: "var(--lime)",
              borderRadius: "10px",
              animation: "loading-bar 1.5s infinite ease-in-out"
            }} />
          </div>
        </div>
      </main>
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );

  if (error) return (
    <div className="site-shell">
      <SiteHeader />
      <main className="admin-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="admin-login" style={{ textAlign: "center", maxWidth: "420px", padding: "40px 30px" }}>
          <h1 style={{ color: "var(--pink)", marginBottom: "15px", fontSize: "2rem" }}>
            {error.toLowerCase().includes("denied") ? "Access Denied" : "Dashboard Error"}
          </h1>
          <p style={{ marginBottom: "25px", color: "var(--muted)", lineHeight: "1.6" }}>{error}</p>
          {!user ? (
            <button className="button button-primary" onClick={() => setShowAuthModal(true)} style={{ padding: "12px 24px", width: "100%", justifyContent: "center" }}>Sign In to Continue</button>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: 0 }}>Please ensure you are signed in with the email address registered for this referral program.</p>
          )}
        </div>
      </main>
    </div>
  );

  if (!stats) return null;

  const commissionRate = stats.commissionPercentage ?? 21;
  const minLimit = stats.minWithdrawalLimit ?? 100;
  const earnings = stats.estimatedEarnings ?? Math.round(stats.conversions * 29 * (commissionRate / 100));
  const isEligible = earnings >= minLimit;
  const progressPercent = Math.min(100, Math.round((earnings / minLimit) * 100));

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="admin-shell" style={{ background: "radial-gradient(circle at 80% 20%, rgba(38,120,255,0.08), transparent 40rem), var(--night)" }}>
        <div className="inner-page" style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>

          <RevealBlock direction="bottom">
            <div className="admin-header" style={{ marginBottom: "40px" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--lime)" }}>Partnership Dashboard</p>
                <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: "10px" }}>Welcome, <span>{stats.name}</span></h1>
                <p style={{ color: "var(--muted)" }}>Tracking performance for code: <strong style={{ color: "var(--lime)" }}>{stats.code}</strong></p>
              </div>
            </div>
          </RevealBlock>

          {/* Metrics Grid */}
          <div className="admin-metrics" style={{ marginBottom: "40px" }}>
            <article style={{ border: "1px solid rgba(217,255,112,0.3)", background: "rgba(217,255,112,0.03)" }}>
              <strong style={{ color: "var(--lime)" }}>₹{earnings}</strong>
              <span>Estimated Earnings</span>
              <small style={{ color: "var(--lime)", fontSize: "0.68rem", marginTop: "5px", display: "block", fontWeight: "600" }}>{commissionRate}% Commission Rate</small>
            </article>
            <article>
              <strong>{stats.conversions}</strong>
              <span>Total Sales</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Purchases completed</small>
            </article>
            <article>
              <strong>{stats.clicks}</strong>
              <span>Total Visitors</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Unique link clicks</small>
            </article>
            <article>
              <strong>{stats.clicks > 0 ? ((stats.conversions / stats.clicks) * 100).toFixed(1) : 0}%</strong>
              <span>Conversion Rate</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Clicks to buy ratio</small>
            </article>
          </div>

          {/* Withdrawal & Payout Status Section */}
          <section style={{ marginBottom: "40px" }}>
            <RevealBlock direction="bottom" delay={100}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
                  <div>
                    <h2 style={{ fontSize: "1.3rem", margin: "0 0 5px" }}>Payout & Withdrawal Status</h2>
                    <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: 0 }}>Minimum withdrawal limit: <strong style={{ color: "var(--ink)" }}>₹{minLimit}</strong></p>
                  </div>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    background: isEligible ? "rgba(217,255,112,0.15)" : "rgba(255,255,255,0.05)",
                    color: isEligible ? "var(--lime)" : "var(--muted)",
                    border: `1px solid ${isEligible ? "rgba(217,255,112,0.3)" : "rgba(255,255,255,0.1)"}`
                  }}>
                    {isEligible ? "✓ Eligible for Withdrawal" : `₹${Math.max(0, minLimit - earnings)} away from payout`}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "10px", height: "10px", width: "100%", overflow: "hidden", marginBottom: "15px" }}>
                  <div style={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    background: isEligible ? "linear-gradient(90deg, #b3ff00, var(--lime))" : "linear-gradient(90deg, #2678ff, var(--lime))",
                    borderRadius: "10px",
                    transition: "width 0.6s ease"
                  }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--muted)", marginBottom: "20px" }}>
                  <span>Current: <strong>₹{earnings}</strong></span>
                  <span>Target: <strong>₹{minLimit}</strong></span>
                </div>

                <div style={{ background: "rgba(0,0,0,0.2)", padding: "15px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", color: "var(--muted)", lineHeight: "1.5" }}>
                  <p style={{ margin: "0 0 5px", color: "var(--ink)", fontWeight: "600" }}>Payout Policy:</p>
                  Earnings are calculated at <strong>{commissionRate}%</strong> of every sale generated via your code/link. Payouts are transferred directly via UPI or Bank Transfer once your balance reaches the minimum threshold of <strong>₹{minLimit}</strong>. Contact <a href="mailto:amitmath12l@gmail.com" style={{ color: "var(--lime)", textDecoration: "underline" }}>amitmath12l@gmail.com</a> for payout requests.
                </div>
              </div>
            </RevealBlock>
          </section>

          {/* Referral Link Card */}
          <section className="admin-section">
            <RevealBlock direction="bottom" delay={150}>
              <div className="admin-section-heading">
                <h2>Your Unique Referral Link</h2>
              </div>
              <div className="contact-form" style={{ maxWidth: "100%", margin: "0", padding: "30px", border: "1px solid rgba(217,255,112,0.2)", borderRadius: "16px" }}>
                <p style={{ marginBottom: "20px" }}>Share this direct checkout link with your audience. You receive {commissionRate}% commission for every customer who buys through this link.</p>
                <div className="form-row">
                  <input
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/buy?p=bundle&ref=${stats.code}`}
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                      navigator.clipboard.writeText((e.target as HTMLInputElement).value);
                    }}
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid var(--lime)",
                      color: "var(--lime)",
                      fontSize: "1.1rem",
                      padding: "15px",
                      cursor: "pointer"
                    }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "10px" }}>
                    Tip: Click the box to select and copy your referral link.
                  </p>
                </div>
              </div>
            </RevealBlock>
          </section>
        </div>
      </main>

      <style jsx>{`
        .admin-metrics article {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--line);
          transition: all 0.3s ease;
        }
        .admin-metrics article:hover {
          background: rgba(255,255,255,0.04);
          transform: translateY(-5px);
          border-color: rgba(217,255,112,0.3);
        }
      `}</style>
      <SiteFooter />
    </div>
  );
}
