"use client";

import { useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function AuthModal() {
  const { login, showAuthModal, setShowAuthModal } = useUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, username);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => setShowAuthModal(false)}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={() => setShowAuthModal(false)} aria-label="Close">
          &times;
        </button>

        <div className="auth-header">
          <p className="eyebrow" style={{ color: "var(--lime)" }}>Welcome to pdfDuniya</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.4rem)", fontWeight: "800", letterSpacing: "-0.04em" }}>Welcome back</h2>
          <p className="auth-subtitle" style={{ maxWidth: "300px", margin: "0 auto", fontSize: "0.9rem", color: "var(--muted)" }}>
            Use the same email as your purchase to restore your PDFs, reviews, and <span style={{ color: "var(--ink)" }}>referral</span> details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form" style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(217,255,112,0.1)",
          borderRadius: "20px",
          padding: "32px",
          marginTop: "30px"
        }}>
          <div className="form-row">
            <label htmlFor="auth-username">Display Name</label>
            <input
              id="auth-username"
              type="text"
              placeholder="e.g. Rahul Sharma"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ background: "rgba(0,0,0,0.2)" }}
            />
          </div>
          <div className="form-row">
            <label htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="rahul@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: "rgba(0,0,0,0.2)" }}
            />
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: "8px" }}>
              Your previous purchases are restored using this email.
            </p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="button button-primary" disabled={loading} style={{ width: "100%", marginTop: "10px", justifyContent: "center", minHeight: "54px" }}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 8, 17, 0.9);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fade-in 0.3s ease;
        }
        .auth-modal {
          background: #171323;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          width: 100%;
          max-width: 450px;
          padding: 40px;
          position: relative;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .auth-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: var(--muted);
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .auth-close:hover {
          color: var(--pink);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .auth-header h2 {
          font-size: 2rem;
          margin: 10px 0;
        }
        .auth-subtitle {
          color: var(--muted);
          font-size: 0.95rem;
        }
        .auth-error {
          color: var(--pink);
          background: rgba(250, 46, 140, 0.1);
          padding: 10px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 20px;
          text-align: center;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
