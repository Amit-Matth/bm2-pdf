"use client";

import { useEffect, useState } from "react";
import RevealBlock from "./reveal-block";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar: string;
  productTitle: string;
};

export default function HomeReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/reviews/featured");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch featured reviews", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="section approved-reviews-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Student Success</p>
          <h2>Real results from <br /><em>real learners.</em></h2>
        </div>
        <p>Join thousands of students who are already using our PDFs to master their skills.</p>
      </div>

      <div className="public-review-grid">
        {reviews.map((review, idx) => (
          <RevealBlock key={review.id} direction="bottom" delay={idx * 100}>
            <article className="public-review" style={{ borderRadius: '15px', padding: '28px', border: '1px solid var(--line)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div className="public-review-person" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} style={{ width: '45px', height: '45px', minWidth: '45px', minHeight: '45px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, aspectRatio: '1 / 1' }} />
                  ) : (
                    <div className="public-avatar-placeholder" style={{ width: '45px', height: '45px', minWidth: '45px', minHeight: '45px', borderRadius: '50%', background: 'rgba(217,255,112,0.1)', color: 'var(--lime)', display: 'grid', placeItems: 'center', fontWeight: 'bold', flexShrink: 0, aspectRatio: '1 / 1' }}>
                      {review.name[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <strong style={{ display: 'block', fontSize: '1rem', color: '#fff' }}>{review.name}</strong>
                    <span style={{ fontSize: '0.7rem', color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{review.productTitle}</span>
                  </div>
                </div>
                <div style={{ color: 'var(--lime)', fontSize: '0.8rem' }}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '15px' }}>
                "{review.comment}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--lime)' }}></div>
                <small style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Verified Purchase</small>
              </div>
            </article>
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}
