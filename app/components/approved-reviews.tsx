"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import RevealBlock from "./reveal-block";

type Review = { id: string; name: string; rating: number; comment: string; avatar?: string };

const products = [
  { key: "math", title: "SpeedMath: Calculate Faster" },
  { key: "english", title: "Speak English with Confidence" },
];

export default function ApprovedReviews() {
  const [reviews, setReviews] = useState<Record<string, Review[]>>({});

  useEffect(() => {
    void Promise.all(products.map(async (product) => {
      const response = await fetch(`/api/reviews?productKey=${encodeURIComponent(product.key)}`);
      if (!response.ok) return [product.key, []] as const;
      const data = await response.json() as { reviews: Review[] };
      return [product.key, data.reviews] as const;
    })).then((entries) => setReviews(Object.fromEntries(entries)));
  }, []);

  const approvedReviews = products.flatMap((product) => (reviews[product.key] || []).map((review) => ({ ...review, productTitle: product.title })));
  if (!approvedReviews.length) return null;

  return (
    <section className="section approved-reviews-section" aria-labelledby="approved-reviews-title">
      <RevealBlock direction="bottom">
        <div className="section-heading">
          <div><p className="eyebrow">Verified purchasers</p><h2 id="approved-reviews-title">What learners<br /><em>are saying.</em></h2></div>
          <p>Reviews from customers whose purchases have been verified and approved by BM2 PDF.</p>
        </div>
      </RevealBlock>
      <div className="public-review-grid">
        {approvedReviews.map((review, index) => (
          <RevealBlock direction="bottom" delay={index * 80} key={review.id}>
            <article className="public-review"><div className="public-review-person">{review.avatar ? <img src={review.avatar} alt="" /> : <span className="public-avatar-placeholder">&#9733;</span>}<strong>{"★".repeat(review.rating)}</strong><span>{review.name}</span></div><small>{review.productTitle}</small><p>{review.comment}</p></article>
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}
