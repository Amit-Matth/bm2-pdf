"use client";

import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import RevealBlock from "./reveal-block";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  createdAt: string;
};

type ReviewSectionProps = {
  productKey: string;
  productTitle: string;
};

export default function ReviewSection({ productKey, productTitle }: ReviewSectionProps) {
  const { user, loading: authLoading, setShowAuthModal } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<any>(null);
  const [canReview, setCanReview] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [reviewToken, setReviewToken] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    avatar: ""
  });

  useEffect(() => {
    fetchReviews();
  }, [productKey, user]);

  useEffect(() => {
    function openReviewForm(event: Event) {
      const detail = (event as CustomEvent<{ productKey?: string }>).detail;
      if (detail?.productKey === productKey) setShowForm(true);
    }
    window.addEventListener("review:open", openReviewForm);
    return () => window.removeEventListener("review:open", openReviewForm);
  }, [productKey]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?productKey=${productKey}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setCanReview(Boolean(data.canReview));
      setOrderId(data.orderId || "");
      setReviewToken(data.reviewToken || "");
      setUserReview(data.review || null);
      if (data.review) {
        setUserReview(data.review);
        setFormData({
          rating: data.review.rating,
          comment: data.review.comment,
          avatar: data.review.avatar
        });
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const method = userReview ? "PUT" : "POST";
      const res = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productKey,
          orderId,
          reviewToken,
          email: user?.email,
          name: user?.username,
          ...formData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
      } else {
        setMessage(data.message);
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      setError("Image must be smaller than 1.5MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div style={{ height: "100px", display: "grid", placeItems: "center" }}><div className="dot" /></div>;

  return (
    <section className="reviews-section" style={{
      borderTop: "1px solid var(--line)",
      marginTop: '80px',
      paddingTop: '60px',
      width: '100%',
      margin: '0'
    }}>
      <div className="section-heading" style={{ marginBottom: "40px", display: 'block' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)' }}>Your Feedback</p>
        <h2 style={{ fontSize: "2.4rem", letterSpacing: '-0.03em', margin: '10px 0 25px' }}>Your <em>experience.</em></h2>

        {canReview && (!userReview || userReview.status !== "pending") && (
          <div style={{ marginBottom: '35px', display: 'block' }}>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "15px" }}>
              {userReview ? "You've shared your experience." : "Help others learn better."}
            </p>
            <button
              className="button button-primary"
              style={{ padding: '12px 24px', fontSize: '0.8rem', fontWeight: '800', borderRadius: '10px', width: 'auto', minWidth: '160px' }}
              onClick={() => setShowForm(!showForm)}
            >
              {userReview ? "Update Review" : "Rate Your Experience"}
            </button>
          </div>
        )}

        {!user && !authLoading && !loading && (
           <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "12px" }}>Purchased this PDF?</p>
            <button className="nav-button" onClick={() => setShowAuthModal(true)}>Sign in to Review</button>
           </div>
        )}
      </div>

      {showForm && (
        <RevealBlock direction="bottom">
          <div className="contact-form" style={{ maxWidth: "100%", margin: "0 0 60px", padding: "40px", borderRadius: "20px", border: "1px solid var(--lime)", background: 'rgba(217, 255, 112, 0.02)' }}>
            <h3 style={{ marginBottom: "25px", fontSize: '1.5rem' }}>{userReview ? "Update your experience" : "Share your experience"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label style={{ fontSize: '0.9rem', color: 'var(--lime)' }}>How would you rate this PDF?</label>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "2.5rem",
                        color: star <= formData.rating ? "var(--lime)" : "rgba(255,255,255,0.05)",
                        padding: 0,
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row" style={{ marginTop: '20px' }}>
                <label htmlFor="review-comment" style={{ fontSize: '0.9rem' }}>Your Thoughts</label>
                <textarea
                  id="review-comment"
                  rows={4}
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--line)', borderRadius: '12px', padding: '15px' }}
                  placeholder="How did this PDF help you? Any tips for other learners?"
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                />
              </div>

              <div className="form-row" style={{ marginTop: '10px' }}>
                <label htmlFor="review-avatar" style={{ fontSize: '0.9rem' }}>Profile Picture (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
                   <input type="file" id="review-avatar" accept="image/*" onChange={handleAvatarChange} style={{ flex: 1 }} />
                   {formData.avatar && (
                     <img src={formData.avatar} alt="Preview" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: '2px solid var(--lime)' }} />
                   )}
                </div>
              </div>

              {error && <p className="form-error" style={{ marginBottom: "20px" }}>{error}</p>}
              {message && <p className="form-success" style={{ marginBottom: "20px" }}>{message}</p>}

              <div style={{ display: "flex", gap: "15px", marginTop: '30px' }}>
                <button className="button button-primary" type="submit" disabled={submitting} style={{ minWidth: "180px", borderRadius: '12px' }}>
                  {submitting ? "Saving..." : userReview ? "Update Review" : "Submit Review"}
                </button>
                <button className="nav-button" type="button" onClick={() => setShowForm(false)} style={{ borderRadius: '12px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </RevealBlock>
      )}

      {user && (userReview || reviews.length > 0) ? (
        <div className="public-review-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", gap: "24px" }}>
          {/* User's Own Review (Shown first, even if pending) */}
          {userReview && (
            <article className="public-review" style={{ borderRadius: "16px", border: userReview.status === 'approved' ? '1px solid var(--line)' : '1px solid var(--pink)', background: 'rgba(255, 255, 255, 0.02)', padding: 'clamp(20px, 5vw, 30px)', width: '100%', boxSizing: 'border-box' }}>
              <div style={{ display: 'inline-block', marginBottom: '20px', background: userReview.status === 'approved' ? 'var(--lime)' : 'var(--pink)', color: '#000', fontSize: 'clamp(0.55rem, 2vw, 0.65rem)', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase', whiteSpace: 'nowrap', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userReview.status === 'approved' ? 'Your Review (Public)' : 'Your Review (Pending Approval)'}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "clamp(10px, 3vw, 15px)", marginBottom: "20px" }}>
                {userReview.avatar ? (
                  <img src={userReview.avatar} alt={userReview.name} style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(40px, 10vw, 50px)", minWidth: "40px", minHeight: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, aspectRatio: "1 / 1" }} />
                ) : (
                  <div className="public-avatar-placeholder" style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(40px, 10vw, 50px)", minWidth: "40px", minHeight: "40px", borderRadius: "50%", background: 'rgba(217, 255, 112, 0.1)', color: 'var(--lime)', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', flexShrink: 0, aspectRatio: "1 / 1" }}>{userReview.name?.[0]?.toUpperCase() || 'U'}</div>
                )}
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: "clamp(0.9rem, 4vw, 1.05rem)", color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userReview.name}</strong>
                  <div style={{ color: "var(--lime)", fontSize: "clamp(0.75rem, 3vw, 0.85rem)", marginTop: '2px' }}>
                    {"★".repeat(userReview.rating)}{"☆".repeat(5 - userReview.rating)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--muted)", fontStyle: "italic", lineHeight: '1.6' }}>"{userReview.comment}"</p>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lime)' }}></div>
                 <small style={{ color: "rgba(255,255,255,0.3)", fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verified Purchaser</small>
              </div>
            </article>
          )}

          {/* Other Public Reviews (Filtering out user's own if it's already in the public list) */}
          {reviews.filter(r => r.name !== userReview?.name || r.comment !== userReview?.comment).map((review) => (
            <article key={review.id} className="public-review" style={{ borderRadius: "16px", border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)', padding: 'clamp(20px, 5vw, 30px)', boxSizing: 'border-box' }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: 'flex-start', gap: "clamp(10px, 3vw, 15px)", marginBottom: "20px" }}>
                {review.avatar ? (
                  <img src={review.avatar} alt={review.name} style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(40px, 10vw, 50px)", minWidth: "40px", minHeight: "40px", borderRadius: "50%", objectFit: "cover", flexShrink: 0, aspectRatio: "1 / 1" }} />
                ) : (
                  <div className="public-avatar-placeholder" style={{ width: "clamp(40px, 10vw, 50px)", height: "clamp(40px, 10vw, 50px)", minWidth: "40px", minHeight: "40px", borderRadius: "50%", background: 'rgba(217, 255, 112, 0.1)', color: 'var(--lime)', fontWeight: 'bold', fontSize: 'clamp(0.9rem, 4vw, 1.1rem)', flexShrink: 0, aspectRatio: "1 / 1" }}>{review.name[0].toUpperCase()}</div>
                )}
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: "clamp(0.9rem, 4vw, 1.05rem)", color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{review.name}</strong>
                  <div style={{ color: "var(--lime)", fontSize: "clamp(0.75rem, 3vw, 0.85rem)", marginTop: '2px' }}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--muted)", fontStyle: "italic", lineHeight: '1.6' }}>"{review.comment}"</p>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lime)' }}></div>
                 <small style={{ color: "rgba(255,255,255,0.3)", fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verified Purchaser</small>
              </div>
            </article>
          ))}
        </div>
      ) : user ? (
        <div style={{ padding: "80px 40px", textAlign: "center", background: "rgba(255,255,255,0.015)", borderRadius: "20px", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}>💬</div>
          <p style={{ color: "var(--muted)", fontSize: '1.1rem' }}>No reviews yet for this product. <br />Be the first to share your experience!</p>
        </div>
      ) : null}
    </section>
  );
}
