"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SiteHeader from "../../../components/site-header";
import RevealBlock from "../../../components/reveal-block";

type Stats = {
  code: string;
  name: string;
  clicks: number;
  conversions: number;
  createdAt: string;
};

export default function ReferrerDashboard() {
  const { code } = useParams();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
    if (code) fetchStats();
  }, [code]);

  if (loading) return (
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
        <div className="admin-login" style={{ textAlign: "center" }}>
          <h1 style={{ color: "var(--pink)" }}>Error</h1>
          <p>{error}</p>
        </div>
      </main>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="admin-shell" style={{ background: "radial-gradient(circle at 80% 20%, rgba(38,120,255,0.08), transparent 40rem), var(--night)" }}>
        <div className="inner-page" style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>

          <RevealBlock direction="bottom">
            <div className="admin-header" style={{ marginBottom: "50px" }}>
              <div>
                <p className="eyebrow" style={{ color: "var(--lime)" }}>Referral Dashboard</p>
                <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: "10px" }}>Welcome, <span>{stats.name}</span></h1>
                <p style={{ color: "var(--muted)" }}>Tracking performance for code: <strong style={{ color: "var(--ink)" }}>{stats.code}</strong></p>
              </div>
            </div>
          </RevealBlock>

          <div className="admin-metrics" style={{ marginBottom: "60px" }}>
            <article>
              <strong>{stats.clicks}</strong>
              <span>Total Visitors</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Unique link clicks</small>
            </article>
            <article>
              <strong>{stats.conversions}</strong>
              <span>Total Sales</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Purchases completed</small>
            </article>
            <article>
              <strong>{stats.clicks > 0 ? ((stats.conversions / stats.clicks) * 100).toFixed(1) : 0}%</strong>
              <span>Sales Rate</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Clicks to buy ratio</small>
            </article>
            <article>
              <strong>{new Date(stats.createdAt).toLocaleDateString()}</strong>
              <span>Partner Since</span>
              <small style={{ color: "var(--muted)", fontSize: "0.65rem", marginTop: "5px", display: "block" }}>Date approved</small>
            </article>
          </div>

          <section className="admin-section">
            <RevealBlock direction="bottom" delay={150}>
              <div className="admin-section-heading">
                <h2>Your Referral Link</h2>
              </div>
              <div className="contact-form" style={{ maxWidth: "100%", margin: "0", padding: "30px", border: "1px solid rgba(217,255,112,0.2)", borderRadius: "16px" }}>
                <p style={{ marginBottom: "20px" }}>Share this direct checkout link with your audience. Clicks and sales are tracked automatically.</p>
                <div className="form-row">
                  <input
                    readOnly
                    value={`${window.location.origin}/buy?p=bundle&ref=${stats.code}`}
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
                    Tip: Click the box to select and copy the link.
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
    </div>
  );
}
