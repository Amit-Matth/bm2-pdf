"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useState } from "react";

type AdminData = {
  eventCounts: Array<{ _id: string; count: number }>;
  orderCounts: Array<{ _id: string; count: number }>;
  referralRequests: Array<{ _id: string; name: string; email: string; platform: string; channelHandle: string; followers: string; status: string; referralCode?: string }>;
  reviews: Array<{ _id: string; productKey: string; productTitle: string; name: string; rating: number; comment: string; avatar?: string; status: string; createdAt: string }>;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    if (!response.ok) { setError("Invalid admin password."); return; }
    await loadData();
  }

  async function loadData() {
    setIsRefreshing(true);
    try {
      const [dataRes, refRes] = await Promise.all([
        fetch("/api/admin/data", { cache: "no-store", credentials: "same-origin" }),
        fetch("/api/admin/referrals", { cache: "no-store", credentials: "same-origin" })
      ]);

      if (dataRes.status === 401) { setData(null); setIsCheckingSession(false); return; }
      if (!dataRes.ok) { setError("Admin data could not be loaded."); setIsCheckingSession(false); return; }

      const mainData = await dataRes.json();
      const refData = await refRes.json();

      setData({ ...mainData, referralRequests: refData.requests || [] });
      setError("");
      setIsCheckingSession(false);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function moderateReferral(requestId: string, status: "approved" | "rejected") {
    let referralCode = "";
    if (status === "approved") {
      const confirmed = window.confirm("Approve this request? A unique referral code will be generated automatically.");
      if (!confirmed) return;

      // Auto-generate a random code (e.g. PDF-X7A2)
      referralCode = "PDF-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    const response = await fetch("/api/admin/referrals", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, status, referralCode }) });
    const resData = await response.json();
    if (!response.ok) alert(resData.error || "Moderation failed");
    await loadData();
  }

  async function moderateReview(reviewId: string, status: "approved" | "rejected") {
    const confirmed = window.confirm(`Mark this review as ${status}?`);
    if (!confirmed) return;

    const response = await fetch("/api/admin/data", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status })
    });
    const resData = await response.json();
    if (!response.ok) alert(resData.error || "Moderation failed");
    await loadData();
  }

  async function deleteReview(reviewId: string) {
    const confirmed = window.confirm("Permanently delete this review?");
    if (!confirmed) return;

    const response = await fetch("/api/admin/data", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId })
    });
    const resData = await response.json();
    if (!response.ok) alert(resData.error || "Deletion failed");
    await loadData();
  }

  async function removeReferral(requestId: string) {
    const confirmed = window.confirm("Are you sure you want to remove this referral? The code will be deactivated and the user will be notified.");
    if (!confirmed) return;

    const response = await fetch("/api/admin/referrals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId })
    });
    const resData = await response.json();
    if (!response.ok) alert(resData.error || "Removal failed");
    await loadData();
  }

  if (isCheckingSession) return (
    <main className="admin-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "300px", textAlign: "center" }}>
        <p className="eyebrow">Checking session...</p>
        <div style={{ height: "4px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden", marginTop: "15px" }}>
          <div className="loading-progress" />
        </div>
      </div>
      <style jsx>{`
        .loading-progress {
          height: 100%;
          width: 50%;
          background: var(--lime);
          border-radius: 10px;
          animation: loading-bar 1.5s infinite ease-in-out;
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
  if (!data) return <main className="admin-shell"><div className="admin-login"><p className="eyebrow">BM2 PDF / private</p><h1>Admin portal</h1><p>Referral moderation and checkout activity.</p><form onSubmit={login}><div className="form-row"><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></div><button className="button button-primary form-submit" type="submit">Enter portal</button>{error && <p className="form-error">{error}</p>}</form></div></main>;

  const metric = (items: Array<{ _id: string; count: number }>, key: string) => items.find((item) => item._id === key)?.count || 0;
  return (
    <main className="admin-shell">
      <div className="admin-header">
        <div>
          <p className="eyebrow">BM2 PDF / private</p>
          <h1>Admin portal</h1>
        </div>
        <button className="admin-refresh" type="button" onClick={() => void loadData()} disabled={isRefreshing}>
          {isRefreshing ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      <div className="admin-metrics">
        <article><strong>{metric(data.eventCounts, "session_start")}</strong><span>Site Visits</span></article>
        <article><strong>{metric(data.eventCounts, "unique_visit")}</strong><span>Individual People</span></article>
        <article><strong>{metric(data.eventCounts, "checkout_started")}</strong><span>Clicked 'Buy Now'</span></article>
        <article><strong>{metric(data.orderCounts, "paid")}</strong><span>Successful Sales</span></article>
      </div>

      <section className="admin-section">
        <div className="admin-section-heading">
          <div><p className="eyebrow">Partnership requests</p><h2>Referrals</h2></div>
          <span>{data.referralRequests.filter(r => r.status === "pending").length} pending</span>
        </div>
        <div className="admin-review-list">
          {data.referralRequests.length === 0 ? <p className="admin-empty">No referral requests yet.</p> : data.referralRequests.map((req) => (
            <article className="admin-review" key={req._id}>
              <div className="admin-review-person">
                <div className="admin-avatar-placeholder">{req.name[0].toUpperCase()}</div>
                <div>
                  <strong>{req.name}</strong>
                  <span>{req.email}</span>
                  <span style={{ color: "var(--lime)", fontWeight: "600" }}>{req.platform}: {req.channelHandle}</span>
                  <small style={{ color: "var(--muted)" }}>Followers: {req.followers}</small>
                </div>
              </div>
              <div>
                <p>Status: <strong style={{ color: req.status === "approved" ? "var(--lime)" : req.status === "rejected" ? "var(--pink)" : "inherit" }}>{req.status}</strong></p>
                {req.referralCode && <p>Code: <strong>{req.referralCode}</strong></p>}
              </div>
              <div className="admin-review-actions">
                {req.status === "pending" && (
                  <>
                    <button type="button" onClick={() => moderateReferral(req._id, "approved")}>Approve</button>
                    <button type="button" onClick={() => moderateReferral(req._id, "rejected")}>Reject</button>
                  </>
                )}
                {req.status === "approved" && (
                  <button type="button" onClick={() => removeReferral(req._id)} style={{ borderColor: "var(--pink)", color: "var(--pink)" }}>
                    Remove
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="admin-section" style={{ marginTop: "80px" }}>
        <div className="admin-section-heading">
          <div><p className="eyebrow">User Feedback</p><h2>PDF Reviews</h2></div>
          <span>{data.reviews.filter(r => r.status === "pending").length} pending</span>
        </div>
        <div className="admin-review-list">
          {data.reviews.length === 0 ? <p className="admin-empty">No reviews submitted yet.</p> : data.reviews.map((rev) => (
            <article className="admin-review" key={rev._id}>
              <div className="admin-review-person">
                {rev.avatar ? (
                  <img src={rev.avatar} alt={rev.name} />
                ) : (
                  <div className="admin-avatar-placeholder">{rev.name[0].toUpperCase()}</div>
                )}
                <div>
                  <strong>{rev.name}</strong>
                  <span className="admin-product-label">{rev.productTitle}</span>
                  <div className="admin-rating-stars">
                    {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                  </div>
                </div>
              </div>
              <div>
                <p style={{ fontStyle: "italic", color: "var(--muted)" }}>"{rev.comment}"</p>
                <small style={{ color: "rgba(255,255,255,0.2)", marginTop: "10px", display: "block" }}>
                  Status: <strong style={{ color: rev.status === "approved" ? "var(--lime)" : rev.status === "rejected" ? "var(--pink)" : "inherit" }}>{rev.status.toUpperCase()}</strong>
                </small>
              </div>
              <div className="admin-review-actions">
                {rev.status === "pending" ? (
                  <>
                    <button type="button" onClick={() => moderateReview(rev._id, "approved")}>Approve</button>
                    <button type="button" onClick={() => moderateReview(rev._id, "rejected")}>Reject</button>
                  </>
                ) : (
                  <button type="button" onClick={() => deleteReview(rev._id)} style={{ borderColor: "var(--pink)", color: "var(--pink)" }}>Delete</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
