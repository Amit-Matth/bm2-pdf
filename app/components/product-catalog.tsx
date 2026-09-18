"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PdfViewer from "./pdf-viewer";
import RevealBlock from "./reveal-block";

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

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sampleViewer, setSampleViewer] = useState<Product | null>(null);
  const [savedAccess, setSavedAccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const access: Record<string, boolean> = {};
    products.forEach((p) => {
      const stored = window.localStorage.getItem(`pdfduniya-review-access-${p.key}`);
      if (stored) access[p.key] = true;
    });
    setSavedAccess(access);
  }, [products]);

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
                <div>{product.free ? <strong>FREE</strong> : savedAccess[product.key] ? <strong className="catalog-purchased">Purchased</strong> : <><strong>{product.price}</strong><del>{product.originalPrice}</del></>}</div>
                <button type="button" className="catalog-button" onClick={() => {
                  if (product.free) {
                    setSelectedProduct(product);
                  } else {
                    const ref = searchParams.get("ref") || "";
                    router.push(`/buy?p=${product.key}${ref ? `&ref=${ref}` : ""}`);
                  }
                }}>{product.free ? "View sample" : "Buy now"}<span aria-hidden="true">&#8594;</span></button>
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
