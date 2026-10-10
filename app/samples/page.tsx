"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";
import RevealBlock from "../components/reveal-block";
import PdfViewer from "../components/pdf-viewer";
import { useUser } from "../contexts/UserContext";

type SampleItem = {
  key: string;
  title: string;
  eyebrow: string;
  description: string;
  badge: string;
  features: string[];
  file: string;
  gradient: string;
  borderColor: string;
  accentColor: string;
  buyKey: string;
};

const samples: SampleItem[] = [
  {
    key: "math-sample",
    title: "Math Magic Sample",
    eyebrow: "Math Magic Preview · Free Edition",
    description: "Preview the guide's multiplication and division shortcuts, percentage tricks, square and cube patterns, table methods, and number magic.",
    badge: "FREE SAMPLE",
    features: [
      "Base Jump & Half-Double multiplication",
      "Percentage, fraction & division shortcuts",
      "Square, cube & table tricks",
      "Printable Sample Pages"
    ],
    file: "Math%20Sample.pdf",
    gradient: "linear-gradient(145deg, rgba(21,46,100,0.85), rgba(15,17,29,0.95))",
    borderColor: "rgba(38,120,255,0.45)",
    accentColor: "var(--blue)",
    buyKey: "math"
  },
  {
    key: "english-sample",
    title: "English Speaking Sample",
    eyebrow: "English Preview · Free Edition",
    description: "A free look at the real-world speaking tools, sentence upgrades, and hesitation fixes inside our main handbook.",
    badge: "FREE SAMPLE",
    features: [
      "Think-in-English and fluency fixes",
      "Natural phrases and sentence upgrades",
      "Interview and call techniques",
      "Printable sample pages"
    ],
    file: "English%20Sample.pdf",
    gradient: "linear-gradient(145deg, rgba(91,22,82,0.8), rgba(15,17,29,0.95))",
    borderColor: "rgba(250,46,140,0.45)",
    accentColor: "var(--pink)",
    buyKey: "english"
  }
];

export default function SamplesPage() {
  const { user } = useUser();
  const [activeViewer, setActiveViewer] = useState<SampleItem | null>(null);
  const [purchasedMap, setPurchasedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const access: Record<string, boolean> = {};
    ["math", "english"].forEach((key) => {
      const stored = window.localStorage.getItem(`pdfduniya-review-access-${key}`);
      const isPurchased = Boolean(
        stored ||
        user?.purchasedProducts?.includes(key) ||
        user?.purchasedProducts?.includes("bundle")
      );
      if (isPurchased) access[key] = true;
    });
    setPurchasedMap(access);
  }, [user]);

  return (
    <div className="site-shell samples-page">
      <SiteHeader />

      <main className="admin-shell" style={{ background: "radial-gradient(circle at 50% 10%, rgba(38,120,255,0.08), transparent 40rem), var(--night)" }}>
        <div className="inner-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>

          {/* Hero Section */}
          <RevealBlock direction="bottom">
            <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 60px" }}>
              <p className="eyebrow" style={{ color: "var(--lime)" }}>pdfDuniya / Free Previews</p>
              <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.2rem)", lineHeight: "1", marginBottom: "20px" }}>
                Free <span>Book Samples</span>
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: "1.6" }}>
                Try the first pages for free. Get a feel for the rhythm, clarity, and useful ideas inside both guides.
              </p>
            </div>
          </RevealBlock>

          {/* Side-by-Side ROW Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "35px",
            maxWidth: "1100px",
            margin: "0 auto 60px"
          }} className="samples-grid">
            {samples.map((sample, idx) => (
              <RevealBlock key={sample.key} direction="bottom" delay={idx * 120}>
                <article style={{
                  background: sample.gradient,
                  border: `2px solid ${sample.borderColor}`,
                  borderRadius: "24px",
                  padding: "40px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease"
                }} className="sample-card">

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <span style={{
                      background: "rgba(217,255,112,0.15)",
                      color: "var(--lime)",
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      letterSpacing: "0.08em",
                      padding: "5px 12px",
                      borderRadius: "6px"
                    }}>
                      {sample.badge}
                    </span>
                    <span style={{ color: "var(--muted)", fontSize: "0.75rem", fontWeight: "600" }}>PDF FORMAT</span>
                  </div>

                  <p style={{ color: sample.accentColor, fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    {sample.eyebrow}
                  </p>
                  <h2 style={{ fontSize: "2rem", marginBottom: "15px", color: "var(--ink)", fontWeight: "800" }}>
                    {sample.title}
                  </h2>
                  <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "30px" }}>
                    {sample.description}
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 35px 0", display: "grid", gap: "12px" }}>
                    {sample.features.map((feat) => (
                      <li key={feat} style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--ink)", fontSize: "0.9rem" }}>
                        <span style={{ color: "var(--lime)", fontWeight: "bold" }}>✓</span> {feat}
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: "auto", paddingTop: "25px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => setActiveViewer(sample)}
                      style={{ flex: "1 1 auto", justifyContent: "center", height: "50px", borderRadius: "12px" }}
                    >
                      Open Sample PDF <span aria-hidden="true">→</span>
                    </button>
                    {purchasedMap[sample.buyKey] ? (
                      <Link
                        href={sample.buyKey === "math" ? "/math" : "/english"}
                        className="button"
                        style={{
                          background: "rgba(217,255,112,0.12)",
                          border: "1px solid rgba(217,255,112,0.3)",
                          color: "var(--lime)",
                          height: "50px",
                          borderRadius: "12px",
                          padding: "0 20px"
                        }}
                      >
                        Already Purchased ✓
                      </Link>
                    ) : (
                      <Link
                        href={`/buy?p=${sample.buyKey}`}
                        className="button"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "var(--ink)",
                          height: "50px",
                          borderRadius: "12px",
                          padding: "0 20px"
                        }}
                      >
                        Get Full PDF
                      </Link>
                    )}
                  </div>

                </article>
              </RevealBlock>
            ))}
          </div>

        </div>
      </main>

      {/* PDF Viewer Modal */}
      {activeViewer && (
        <PdfViewer
          file={activeViewer.file}
          title={activeViewer.title}
          onClose={() => setActiveViewer(null)}
        />
      )}

      {/* Footer */}
      <SiteFooter />

      <style jsx>{`
        .sample-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.6) !important;
        }
        @media (max-width: 820px) {
          .samples-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
