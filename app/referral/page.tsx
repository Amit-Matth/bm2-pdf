"use client";

import { useState, useEffect } from "react";
import RevealBlock from "../components/reveal-block";
import SiteHeader from "../components/site-header";
import Link from "next/link";
import { useUser } from "../contexts/UserContext";

export default function ReferralPage() {
  const { user, setShowAuthModal } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    platform: "YouTube",
    channelHandle: "",
    followers: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    // Check if the user has already applied on this device
    const applied = localStorage.getItem("pdfduniya-referral-applied");
    if (applied) {
      setHasApplied(true);
      setFormData(JSON.parse(applied));
    }
  }, []);

  useEffect(() => {
    // Auto-hide messages after 8 seconds
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/referral/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessage(data.message);
        setHasApplied(true);
        localStorage.setItem("pdfduniya-referral-applied", JSON.stringify(formData));
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="site-shell">
      <SiteHeader />

      <main className="admin-shell" style={{ background: "radial-gradient(circle at 20% 20%, rgba(250,46,140,0.1), transparent 40rem), var(--night)" }}>
        <div className="inner-page" style={{ padding: "60px 20px" }}>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start", maxWidth: "1200px", margin: "0 auto" }} className="referral-grid">

            {/* Left Column: Info */}
            <div className="referral-info">
              <RevealBlock direction="left">
                <p className="eyebrow">Affiliate Partnership</p>
                <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: "0.9", marginBottom: "25px" }}>
                  Grow with <br /><span>pdfDuniya.</span>
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: "1.6", maxWidth: "500px" }}>
                  Join our creator partnership program. Promote high-demand SpeedMath & English guides and earn continuous revenue for every sale.
                </p>

                {/* Partnership Key Highlights */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                  margin: "30px 0",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(217,255,112,0.25)",
                  borderRadius: "16px",
                  padding: "20px"
                }}>
                  <div>
                    <strong style={{ fontSize: "1.8rem", color: "var(--lime)", display: "block", lineHeight: "1" }}>21% Share</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: "600", display: "block", marginTop: "6px" }}>Per Sale Commission</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginTop: "2px" }}>Earn 21% revenue share on every purchase influenced by your link.</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "1.8rem", color: "var(--pink)", display: "block", lineHeight: "1" }}>₹100 Limit</strong>
                    <span style={{ fontSize: "0.85rem", color: "var(--ink)", fontWeight: "600", display: "block", marginTop: "6px" }}>Min. Withdrawal</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block", marginTop: "2px" }}>Payouts transferred directly to your UPI/Bank once you reach ₹100.</span>
                  </div>
                </div>

                <div style={{ marginTop: "35px", display: "grid", gap: "25px" }}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(217,255,112,0.1)", display: "grid", placeItems: "center", color: "var(--lime)", fontWeight: "bold", flexShrink: 0 }}>1</div>
                    <div>
                      <strong style={{ display: "block", color: "var(--ink)", marginBottom: "5px" }}>Request Access</strong>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Submit your channel or profile details for a quick review by our team.</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(38,120,255,0.1)", display: "grid", placeItems: "center", color: "var(--blue)", fontWeight: "bold", flexShrink: 0 }}>2</div>
                    <div>
                      <strong style={{ display: "block", color: "var(--ink)", marginBottom: "5px" }}>Get Your Link</strong>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Receive your custom code and live analytics dashboard to track clicks & sales.</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(250,46,140,0.1)", display: "grid", placeItems: "center", color: "var(--pink)", fontWeight: "bold", flexShrink: 0 }}>3</div>
                    <div>
                      <strong style={{ display: "block", color: "var(--ink)", marginBottom: "5px" }}>Earn & Withdraw</strong>
                      <span style={{ fontSize: "0.9rem", color: "var(--muted)" }}>Get 21% commission on all purchases with direct UPI payout at ₹100 threshold.</span>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Right Column: Form Card */}
            <div className="referral-form-container">
              <RevealBlock direction="right" delay={150}>
                <div className="admin-login" style={{ width: "100%", margin: "0", padding: "40px", border: "1px solid rgba(217,255,112,0.2)", borderRadius: "24px" }}>
                  {user?.referralCode ? (
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <h2 style={{ fontSize: "1.8rem", marginBottom: "20px" }}>You're a Partner!</h2>
                      <p style={{ color: "var(--muted)", marginBottom: "35px" }}>
                        Your referral code <strong>{user.referralCode}</strong> is active. View your performance and earnings in your personal dashboard.
                      </p>
                      <Link href={`/referral/stats/${user.referralCode}`} className="button button-primary" style={{ width: "100%", justifyContent: "center", height: "55px", borderRadius: "12px" }}>
                        Go to Dashboard →
                      </Link>
                    </div>
                  ) : (
                    <>
                      <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>{hasApplied ? "Application Status" : "Apply Now"}</h2>
                      <p style={{ color: "var(--muted)", marginBottom: "30px", fontSize: "0.9rem" }}>
                        {hasApplied ? "Your application is currently under review by our team." : "Tell us about your platform to get started."}
                      </p>

                      <form onSubmit={handleSubmit}>
                        <div className="form-row">
                          <label htmlFor="name">Full Name</label>
                          <input id="name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" required disabled={hasApplied} />
                        </div>

                        <div className="form-row">
                          <label htmlFor="email">Work Email</label>
                          <input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@work.com" required disabled={hasApplied} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                          <div className="form-row">
                            <label htmlFor="platform">Platform</label>
                            <select id="platform" value={formData.platform} onChange={(e) => setFormData({ ...formData, platform: e.target.value })} style={{ width: "100%", border: "1px solid var(--line)", borderRadius: "3px", padding: "12px 13px", background: "#0a0b13", color: "var(--ink)", fontSize: "0.8rem" }} disabled={hasApplied}>
                              <option value="YouTube">YouTube</option>
                              <option value="Instagram">Instagram</option>
                              <option value="Telegram">Telegram</option>
                              <option value="Twitter">X / Twitter</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="form-row">
                            <label htmlFor="followers">Audience Size</label>
                            <input id="followers" type="text" value={formData.followers} onChange={(e) => setFormData({ ...formData, followers: e.target.value })} placeholder="e.g. 50k" disabled={hasApplied} />
                          </div>
                        </div>

                        <div className="form-row" style={{ marginBottom: "25px" }}>
                          <label htmlFor="channel">Channel Handle / Link</label>
                          <input id="channel" type="text" value={formData.channelHandle} onChange={(e) => setFormData({ ...formData, channelHandle: e.target.value })} placeholder="@handle or URL" required disabled={hasApplied} />
                        </div>

                        {!hasApplied && (
                          <>
                            {!user && (
                              <div style={{ background: "rgba(250,46,140,0.05)", border: "1px solid rgba(250,46,140,0.1)", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink)" }}>Please <button type="button" onClick={() => setShowAuthModal(true)} style={{ background: "none", border: "none", color: "var(--pink)", padding: 0, font: "inherit", fontWeight: "bold", cursor: "pointer", textDecoration: "underline" }}>Sign In</button> first to apply.</p>
                              </div>
                            )}
                            <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "20px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                              <strong style={{ color: "var(--pink)" }}>Note:</strong> Application details cannot be changed once submitted. Please verify all information before sending.
                            </p>
                            <button className="button button-primary" style={{ width: "100%", marginBottom: message || error ? "20px" : "0", height: "55px", borderRadius: "12px" }} type="submit" disabled={isSubmitting || !user}>
                              {isSubmitting ? "Sending Request..." : "Submit Application →"}
                            </button>
                          </>
                        )}

                        {hasApplied && !message && (
                          <div style={{ background: "rgba(38,120,255,0.1)", border: "1px solid rgba(38,120,255,0.2)", padding: "15px", borderRadius: "12px", marginTop: "10px", textAlign: "center" }}>
                            <p style={{ margin: 0, color: "var(--blue)", fontWeight: "600" }}>Application Under Review</p>
                            <p style={{ margin: "5px 0 0", fontSize: "0.8rem", color: "var(--muted)" }}>We will contact you at {formData.email} soon.</p>
                          </div>
                        )}

                        {message && (
                          <div style={{ background: "rgba(217,255,112,0.1)", border: "1px solid rgba(217,255,112,0.2)", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
                            <p className="form-success" style={{ margin: 0, lineHeight: "1.5" }}>{message}</p>
                          </div>
                        )}
                        {error && (
                          <div style={{ background: "rgba(255,141,168,0.1)", border: "1px solid rgba(255,141,168,0.2)", padding: "15px", borderRadius: "12px", marginTop: "10px" }}>
                            <p className="form-error" style={{ margin: 0, lineHeight: "1.5" }}>{error}</p>
                          </div>
                        )}
                      </form>
                    </>
                  )}
                </div>
              </RevealBlock>
            </div>

          </div>

        </div>
      </main>

      <footer className="footer-wrap" style={{ marginTop: "0" }}>
        <div className="site-footer" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="footer-brand">
            <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>© 2026 pdfDuniya Partnership Program</p>
          </div>
          <div className="footer-links">
            <Link href="/" style={{ fontSize: "0.8rem" }}>Back to Store</Link>
            <Link href="/about-us" style={{ fontSize: "0.8rem" }}>About Us</Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @media (max-width: 900px) {
          .referral-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .referral-info { text-align: center; }
          .referral-info p { margin: 0 auto 30px !important; }
          .referral-info div { text-align: left; }
        }
      `}</style>
    </div>
  );
}
