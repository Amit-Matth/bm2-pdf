"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BundleCheckout from "./components/bundle-checkout";
import FaqList from "./components/faq-list";
import PdfViewer from "./components/pdf-viewer";
import RevealBlock from "./components/reveal-block";
import SiteHeader from "./components/site-header";

const faqs: Array<[string, string]> = [
  ["What do I receive after buying?", "You receive a downloadable PDF by email. Digital delivery is quick, simple, and available wherever you are."],
  ["Are these PDFs for beginners?", "Yes. Each guide starts with approachable explanations and builds toward practical, everyday use."],
  ["Can I get a refund?", "Because our products are digital downloads, refunds are handled case by case. Please contact us within 7 days if there is a genuine issue."],
  ["How can I contact pdfDuniya?", "Email us at amitmatth121@gmail.com and our small team will get back to you as soon as possible."],
];

export default function Home() {
  const [selectedPreview, setSelectedPreview] = useState<"math" | "english">("math");
  const [isSampleOpen, setIsSampleOpen] = useState(false);
  const isMathPreview = selectedPreview === "math";
  const preview = isMathPreview
    ? {
        title: "SpeedMath: Calculate Faster",
        description: "A practical guide to solve everyday maths in seconds with clear shortcuts, worked examples, and confidence-building practice.",
        pages: "68 PAGES",
        modules: ["Fast addition and subtraction shortcuts", "Multiplication patterns made simple", "Fractions, percentages, and ratios", "Mental maths for everyday decisions", "Common calculation mistakes to avoid", "Speed drills with answer keys"],
        contents: ["Number Sense Basics", "Fast Addition & Subtraction", "Multiplication Shortcuts", "Fractions & Percentages", "Everyday Word Problems", "Timed Practice Sets"],
      }
    : {
        title: "Think in English & Speak Fluently",
        description: "A no-fluff handbook to eliminate hesitations and speak natural, confident English with useful phrases and daily practice.",
        pages: "74 PAGES",
        modules: ["Stop translating word-by-word", "Speak fluidly without pausing", "Fix high-frequency phrasing", "Drop redundant phrases", "Sound natural in everyday chats", "Upgrade repetitive sentences"],
        contents: ["Identify Your Problem", "Think in English", "Speak Without Getting Stuck", "Sound Natural & Confident", "Grammar Mistakes to Fix", "Everyday Sentence Upgrades"],
      };
  const sampleFile = isMathPreview ? "Math%20Sample.pdf" : "English%20Sample.pdf";
  const sampleTitle = isMathPreview ? "SpeedMath Sample" : "English Speaking Sample";

  return (
    <div className="site-shell">
      <SiteHeader />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">Learn something useful today</p>
            <h1 id="hero-title">Solve <span>BasicMath</span> In Seconds.<br />Master English Speaking on <i>fingertips.</i></h1>
            <div className="hero-offer">
              <div className="offer-copy"><strong>₹29</strong><del>₹198</del></div>
              <div className="offer-divider" />
              <div className="offer-details"><b>Buy 1 Get 1 Free (2-in-1 Combo)</b><span>Both SpeedMath &amp; English PDFs included</span></div>
              <em>Save 85%</em>
            </div>
            <div className="hero-actions">
              <BundleCheckout />
              <a className="sample-button" href="#preview"><span aria-hidden="true">&#9636;</span> Preview Free Sample</a>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="hero-symbol">✦</div>
            <div className="floating-sheet sheet-one">
              <small>01</small>
              <strong>QUICK<br />MATH</strong>
              <span>Make numbers feel simple.</span>
            </div>
            <div className="floating-sheet sheet-two">
              <small>02</small>
              <strong>SPEAK<br />EASY</strong>
              <span>Your words. Your confidence.</span>
            </div>
          </div>
        </section>

        <section className="section learning-preview" id="preview" aria-labelledby="preview-title">
          <RevealBlock direction="bottom">
            <h2 className="preview-heading">What you will get?</h2>
          </RevealBlock>
          <RevealBlock direction="left" delay={120}>
            <div className="preview-switcher" role="tablist" aria-label="PDF previews">
              <button className={isMathPreview ? "is-selected" : ""} type="button" role="tab" aria-selected={isMathPreview} onClick={() => setSelectedPreview("math")}>&#9636; &nbsp; SpeedMath (68 Pages)</button>
              <button className={!isMathPreview ? "is-selected" : ""} type="button" role="tab" aria-selected={!isMathPreview} onClick={() => setSelectedPreview("english")}>&#10024; &nbsp; English Grammar (74 Pages)</button>
            </div>
          </RevealBlock>
          <RevealBlock direction="right" delay={220}>
            <div className="pdf-preview" key={preview.title}>
              <div className="preview-details">
                <div className="preview-kicker">Detailed syllabus <span>High-resolution printable PDF</span></div>
                <h3 id="preview-title">{preview.title}</h3>
                <p>{preview.description}</p>
                <h4>Core modules &amp; exam benefits:</h4>
                <div className="module-grid">{preview.modules.map((module) => <span key={module}>&#10003; {module}</span>)}</div>
                <div className="preview-actions">
                  <button className="preview-button" type="button" onClick={() => setIsSampleOpen(true)}>&#9678; &nbsp; Preview Sample Pages</button>
                  <a className="preview-button preview-button-primary" href="mailto:amitmatth121@gmail.com?subject=Complete bundle">Get Complete Bundle (₹299) &nbsp; &#8594;</a>
                </div>
              </div>
              <div className="contents-card">
                <div><strong>TABLE OF CONTENTS ({preview.pages})</strong><a href="#preview">Complete Index</a></div>
                <ol>{preview.contents.map((chapter, index) => <li key={chapter}>{chapter} <small>Ch. {index + 1}</small></li>)}</ol>
                <p className="quick-note">&#10024; Includes quick revision cheat sheets ready to print before exam day!</p>
              </div>
            </div>
          </RevealBlock>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <RevealBlock direction="left">
            <div className="about-logo"><Image src="/logo.png" alt="pdfDuniya logo" width={480} height={480} /></div>
          </RevealBlock>
          <RevealBlock direction="right" delay={100}>
            <div className="about-copy">
              <p className="eyebrow">A little about us</p>
              <h2 id="about-title">Useful knowledge,<br /><em>beautifully simple.</em></h2>
              <p>pdfDuniya creates focused digital guides for learners who want practical results without the noise. We turn everyday goals into friendly, step-by-step PDFs you can open anywhere.</p>
              <p>Whether you are brushing up on maths or finding your voice in English, start with one page and keep going.</p>
              <Link className="text-link" href="/about-us">Read About Us <span aria-hidden="true">&#8594;</span></Link>
            </div>
          </RevealBlock>
        </section>

        <section className="section policies-section" aria-labelledby="policies-title">
          <RevealBlock direction="bottom">
            <div className="section-heading">
              <div><p className="eyebrow">Good to know</p><h2 id="policies-title">Clear from<br /><em>the start.</em></h2></div>
              <p>Simple policies for a simple digital experience.</p>
            </div>
          </RevealBlock>
          <div className="policy-grid">
            <article><Link className="policy-card-link" href="/privacy-policy"><span>01</span><h3>Privacy Policy</h3><p>We only use the information you share to process orders, deliver PDFs, and answer your messages.</p><span className="policy-card-action">Read policy <span aria-hidden="true">&#8594;</span></span></Link></article>
            <article><Link className="policy-card-link" href="/refund-and-cancellation-policy"><span>02</span><h3>Refund and Cancellation Policy</h3><p>Digital products are usually non-refundable after delivery. Contact us if there is a genuine issue.</p><span className="policy-card-action">Read policy <span aria-hidden="true">&#8594;</span></span></Link></article>
            <article><Link className="policy-card-link" href="/terms-and-conditions"><span>03</span><h3>Terms &amp; Conditions</h3><p>PDFs are for personal use. Please do not copy, resell, redistribute, or upload our guides.</p><span className="policy-card-action">Read policy <span aria-hidden="true">&#8594;</span></span></Link></article>
            <article><Link className="policy-card-link" href="/shipping-digital-delivery-policy"><span>04</span><h3>Shipping (Digital Delivery) Policy</h3><p>All products are digital. There is no physical shipping.</p><span className="policy-card-action">Read policy <span aria-hidden="true">&#8594;</span></span></Link></article>
          </div>
        </section>

        <section className="section faq-section" id="faq" aria-labelledby="faq-title">
          <RevealBlock direction="left">
            <div className="faq-intro">
              <p className="eyebrow">Questions, answered</p>
              <h2 id="faq-title">Let&apos;s clear<br /><em>that up.</em></h2>
              <p>Still curious? We are one email away.</p>
              <Link className="text-link" href="/faqs">View all Faqs <span aria-hidden="true">&#8594;</span></Link>
            </div>
          </RevealBlock>
          <RevealBlock direction="right" delay={80}>
            <FaqList questions={faqs} />
          </RevealBlock>
        </section>

      </main>

      <footer className="footer-wrap"><div className="site-footer"><div className="footer-brand"><Image src="/header-logo.png" alt="pdfDuniya" width={180} height={48} /><p>Make maths faster. Speak <span>English with confidence.</span></p></div><div className="footer-links"><div><strong>Explore</strong><Link href="/#math">Math</Link><Link href="/#english">English</Link><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact Us</Link></div><div><strong>Policies</strong><Link href="/privacy-policy">Privacy Policy</Link><Link href="/refund-and-cancellation-policy">Refund and Cancellation Policy</Link><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/shipping-digital-delivery-policy">Shipping (Digital Delivery) Policy</Link></div></div><div className="footer-contact"><strong>Get in Touch</strong><div className="support-card"><span>SUPPORT EMAIL:</span><a href="mailto:amitmath12l@gmail.com">amitmath12l@gmail.com</a></div><p className="checkout-note"><span aria-hidden="true">&#10003;</span> 100% Encrypted Razorpay Checkout</p></div></div><div className="bottom-footer"><span>© 2026 pdfDuniya. All Rights Reserved.</span><span>Developed by &quot;Amit Matth&quot;</span></div></footer>
      {isSampleOpen && <PdfViewer file={sampleFile} title={sampleTitle} onClose={() => setIsSampleOpen(false)} />}
    </div>
  );
}
