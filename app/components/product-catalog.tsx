"use client";

import { useState } from "react";

type Product = {
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="catalog-grid">
        {products.map((product) => (
          <article className={`catalog-card ${product.free ? "catalog-card-free" : ""}`} key={product.title}>
            <div className="catalog-card-top"><span className="catalog-badge">{product.badge}</span><span className="catalog-format">PDF</span></div>
            <p className="catalog-eyebrow">{product.eyebrow}</p>
            <h2>{product.title}</h2>
            <p className="catalog-description">{product.description}</p>
            <ul>{product.features.map((feature) => <li key={feature}><span aria-hidden="true">&#10003;</span>{feature}</li>)}</ul>
            <div className="catalog-card-bottom"><div>{product.free ? <strong>FREE</strong> : <><strong>{product.price}</strong><del>{product.originalPrice}</del></>}</div><button type="button" className="catalog-button" onClick={() => setSelectedProduct(product)}>{product.free ? "View sample" : "Buy now"}<span aria-hidden="true">&#8594;</span></button></div>
          </article>
        ))}
      </div>
      {selectedProduct && <div className="purchase-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}><section className="purchase-modal" role="dialog" aria-modal="true" aria-labelledby="purchase-title"><button className="modal-close" type="button" aria-label="Close purchase dialog" onClick={() => setSelectedProduct(null)}>&times;</button><p className="eyebrow">{selectedProduct.free ? "Free sample" : "Limited launch offer"}</p><h2 id="purchase-title">{selectedProduct.title}</h2><p>{selectedProduct.free ? "Open the sample PDF directly and see the style of learning inside." : "Get instant access at the launch price. Payment gateway integration will be added soon."}</p><div className="modal-price">{selectedProduct.free ? "₹0" : <><strong>₹29</strong><del>₹99</del><span>71% OFF</span></>}</div><a className="button button-primary modal-download" href={`/pdfs/${selectedProduct.file}`} download>{selectedProduct.free ? "Download free sample" : "Download PDF for now"} <span aria-hidden="true">&#8595;</span></a><p className="modal-note">Digital PDF delivery. No physical shipping.</p></section></div>}
    </>
  );
}
