"use client";
/* eslint-disable @next/next/no-img-element */

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PdfViewer from "./pdf-viewer";
import RevealBlock from "./reveal-block";
import { useUser } from "../contexts/UserContext";

type Product = {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  price?: string;
  originalPrice?: string;
  badge: string;
  features: string[];
  file: string;
  free?: boolean;
};

type ProductCatalogProps = {
  products: Product[];
};

function ProductCatalogContent({ products }: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sampleViewer, setSampleViewer] = useState<Product | null>(null);
  const [savedAccess, setSavedAccess] = useState<Record<string, boolean>>({});
  const [hasReview, setHasReview] = useState<Record<string, boolean>>({});
  const [pendingReview, setPendingReview] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const access: Record<string, boolean> = {};
    products.forEach((p) => {
      const stored = window.localStorage.getItem(`pdfduniya-review-access-${p.key}`);
      const isPurchased = stored || user?.purchasedProducts?.includes(p.key) || user?.purchasedProducts?.includes("bundle");
      if (isPurchased) access[p.key] = true;
    });
    setSavedAccess(access);
    void Promise.all(products.map(async (product) => {
      const response = await fetch(`/api/reviews?productKey=${encodeURIComponent(product.key)}`);
      if (!response.ok) return [product.key, false] as const;
      const data = await response.json() as { review?: { status?: string }; canReview?: boolean };
      setPendingReview((current) => ({ ...current, [product.key]: data.review?.status === "pending" }));
      if (data.canReview) {
        setSavedAccess((current) => ({ ...current, [product.key]: true }));
      } else if (!access[product.key]) {
        setSavedAccess((current) => {
          const next = { ...current };
          delete next[product.key];
          return next;
        });
      }
      return [product.key, Boolean(data.review)] as const;
    })).then((entries) => setHasReview(Object.fromEntries(entries)));
  }, [products, user]);

  return (
    <>
      <div className="catalog-grid">
        {products.map((product, idx) => (
          <RevealBlock direction="bottom" delay={idx * 80} key={product.title}>
            <article className={`catalog-card ${product.free ? "catalog-card-free" : ""}`}>
              <div className="catalog-card-top"><span className="catalog-badge">{product.badge}</span><span className="catalog-format">PDF</span></div>
              <p className="catalog-eyebrow">{product.eyebrow}</p>
              <h2>{product.title}</h2>
              <p className="catalog-description">{product.description}</p>
              <ul>{product.features.map((feature) => <li key={feature}><span aria-hidden="true">&#10003;</span>{feature}</li>)}</ul>
              <div className="catalog-card-bottom">
                <div>
                  {product.free ? (
                    <strong>FREE</strong>
                  ) : savedAccess[product.key] ? (
                    <strong className="catalog-purchased" style={{ fontSize: '0.75rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                      ALREADY PURCHASED
                    </strong>
                  ) : (
                    <>
                      <strong>{product.price}</strong>
                      <del>{product.originalPrice}</del>
                    </>
                  )}
                </div>
                {savedAccess[product.key] && !product.free ? (
                  <button
                    type="button"
                    className="catalog-button"
                    disabled={pendingReview[product.key]}
                    onClick={() => {
                      if (pendingReview[product.key]) return;
                      const el = document.querySelector(".reviews-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      window.dispatchEvent(new CustomEvent("review:open", { detail: { productKey: product.key } }));
                    }}
                  >
                    {pendingReview[product.key] ? "Review pending" : hasReview[product.key] ? "Update review" : "Rate experience"} {!pendingReview[product.key] && <span aria-hidden="true">&#8594;</span>}
                  </button>
                ) : !savedAccess[product.key] && (
                  <button type="button" className="catalog-button" onClick={() => {
                    if (product.free) {
                      setSelectedProduct(product);
                    } else {
                      const ref = searchParams.get("ref") || "";
                      router.push(`/buy?p=${product.key}${ref ? `&ref=${ref}` : ""}`);
                    }
                  }}>{product.free ? "View sample" : "Buy now"}<span aria-hidden="true">&#8594;</span></button>
                )}
              </div>
            </article>
          </RevealBlock>
        ))}
      </div>

      {selectedProduct && selectedProduct.free && (
        <div className="purchase-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <section className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title">
            <button className="modal-close" type="button" aria-label="Close purchase dialog" onClick={() => setSelectedProduct(null)}>&times;</button>
            <p className="eyebrow">Free sample</p>
            <h2 id="purchase-title">{selectedProduct.title}</h2>
            <p>Open the sample PDF directly in the viewer, or download it to your device.</p>
            <button className="button button-primary modal-download" type="button" onClick={() => { setSampleViewer(selectedProduct); setSelectedProduct(null); }}>
              Open sample PDF <span aria-hidden="true">&#8594;</span>
            </button>
            <p className="modal-note">Digital PDF delivery. No physical shipping.</p>
          </section>
        </div>
      )}

      {sampleViewer && <PdfViewer file={sampleViewer.file} title={sampleViewer.title} onClose={() => setSampleViewer(null)} />}
    </>
  );
}

export default function ProductCatalog(props: ProductCatalogProps) {
  return (
    <Suspense fallback={null}>
      <ProductCatalogContent {...props} />
    </Suspense>
  );
}
