"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BundleCheckout from "./components/bundle-checkout";
import FaqList from "./components/faq-list";
import PdfViewer from "./components/pdf-viewer";
import RevealBlock from "./components/reveal-block";
import SiteHeader from "./components/site-header";
import HomeReviews from "./components/home-reviews";

const faqs: Array<[string, string]> = [
  ["Is the payment secure?", "Yes, we use Razorpay for all transactions. Your payment details are 100% encrypted and we never store your card or bank information."],
  ["How long does it take to receive my PDFs?", "Delivery is instant! As soon as your payment is successful, an automated email is sent to your registered address with the download links."],
  ["Do I need an account to purchase?", "Yes, creating a quick account helps us secure your purchase, manage your referral earnings, and allows you to leave verified reviews."],
  ["Can I read these PDFs on my mobile phone?", "Absolutely. Our PDFs are optimized for all devices—phones, tablets, and laptops. You can use any standard PDF viewer to read them."],
  ["Are these PDFs for beginners?", "Yes. Each guide starts with approachable explanations and builds toward practical, everyday use."],
  ["What if I lose my download link?", "No worries! Since you have an account, your purchase is recorded. Just contact us with your order ID and we'll resend your links immediately."],
];

export default function Home() {
  const [selectedPreview, setSelectedPreview] = useState<"math" | "english">("math");
  const isMathPreview = selectedPreview === "math";
  const preview = isMathPreview
    ? {
        title: "Math Magic: Master Mental Math",
        description: "A 35-page practical guide packed with 59 mental math techniques and calculation moves, organized into 9 comprehensive sections.",
        pages: "35 PAGES",
        table: [
          { section: "Square & Square Root Tricks", count: "10 techniques" },
          { section: "Cube & Cube Root Tricks", count: "4 techniques" },
          { section: "Rebuild Any Table You Forget", count: "4 methods" },
          { section: "Quick Calculation Shortcuts", count: "10 methods" },
          { section: "Percentage & Fraction Tricks", count: "6 techniques" },
          { section: "Profit, Loss & Interest Tricks", count: "8 techniques" },
          { section: "Divisibility Tricks", count: "8 techniques" },
          { section: "Fast Calculation Tricks", count: "6 techniques" },
          { section: "Math Magic Tricks", count: "3 magic tricks" },
        ],
        learn: [
          { title: "Square & Square Root Tricks", text: "Learn faster ways to work with squares and square roots using useful number patterns." },
          { title: "Cube & Cube Root Tricks", text: "Handle cubes and cube roots with simple patterns around familiar numbers." },
          { title: "Rebuild Any Table You Forget", text: "Learn practical ways to rebuild multiplication tables instead of memorizing everything." },
          { title: "Quick Calculation Shortcuts", text: "Use shortcuts for numbers like 5, 9, 11, 25, 50, 125 and more." },
          { title: "Percentage & Fraction Tricks", text: "Calculate percentages, equivalents, and handle successive percentage changes." },
          { title: "Profit, Loss & Interest Tricks", text: "Work with selling price, discounts, simple interest, and compound growth." },
          { title: "Divisibility Tricks", text: "Quickly check whether numbers are divisible using simple digit patterns." },
          { title: "Fast Calculation Tricks", text: "Use rounding, compensation, and estimation to make everyday calculations faster." },
          { title: "Math Magic Tricks", text: "Perform number tricks that create surprising results while you know how they work." },
        ],
        includes: [
          "Simple step-by-step instructions",
          "Clear worked examples",
          "Useful formulas or patterns",
          "Practice examples where useful"
        ],
        modules: [], // Legacy
        contents: [], // Legacy
      }
    : {
        title: "English Speaking Without Freezing",
        description: "A practical guide built around real speaking problems, with 70+ techniques, corrections, and tools to help you speak with less hesitation.",
        pages: "13 PAGES",
        table: [
          { section: "Identify Your Problem", count: "7 common problems" },
          { section: "Think in English", count: "4 techniques" },
          { section: "Speak Without Getting Stuck", count: "4 techniques" },
          { section: "Sound Natural & Confident", count: "5 techniques" },
          { section: "Grammar Mistakes to Fix", count: "12 common fixes" },
          { section: "Redundant Phrases to Drop", count: "13 corrections" },
          { section: "Formal Phrases to Fix", count: "11 alternatives" },
          { section: "Everyday Sentence Upgrades", count: "16 useful upgrades" },
          { section: "Secret Techniques (Interviews)", count: "6 techniques" },
          { section: "Mindset: Practice & Life", count: "Habit building" },
        ],
        learn: [
          { title: "Think in English", text: "Reduce mental translation and build simple thoughts directly in English." },
          { title: "Speak Without Getting Stuck", text: "Use sentence starters, natural pauses, chunks, and connectors to keep moving." },
          { title: "Sound Natural & Confident", text: "Learn contractions, reactions, small talk, and natural stress to sound natural." },
          { title: "Fix Grammar Mistakes", text: "See common mistakes and the more natural versions you can actually use." },
          { title: "Drop Unnecessary Phrases", text: "Replace longer or redundant expressions with simpler everyday English." },
          { title: "Upgrade Formal English", text: "Turn textbook phrases into natural wording for conversations, calls and chats." },
          { title: "Everyday Expressions", text: "Build a useful bank of more natural alternatives to basic expressions." },
          { title: "Interviews & Calls", text: "Get openers, work-update structures, and responses for professional situations." },
          { title: "Real Speaking Habits", text: "Learn how to keep speaking, correct yourself, and practice in real situations." },
        ],
        includes: [
          "Problem-focused sections",
          "Ready-to-use phrases",
          "Common corrections",
          "Practical speaking tasks"
        ],
        modules: [],
        contents: []
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
              <Link className="sample-button" href="/samples">
                <span aria-hidden="true">&#9636;</span> Preview Free Sample
              </Link>
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
              <button className={isMathPreview ? "is-selected" : ""} type="button" role="tab" aria-selected={isMathPreview} onClick={() => setSelectedPreview("math")}>&#9636; &nbsp; Math Magic (35 Pages)</button>
              <button className={!isMathPreview ? "is-selected" : ""} type="button" role="tab" aria-selected={!isMathPreview} onClick={() => setSelectedPreview("english")}>&#10024; &nbsp; English Grammar (13 Pages)</button>
            </div>
          </RevealBlock>
          <RevealBlock direction="right" delay={220}>
            <div className="pdf-preview" key={preview.title}>
              <div className="preview-details">
                <div className="preview-kicker">{preview.pages} PRACTICAL GUIDE <span>{isMathPreview ? '59 mental math techniques' : '70+ Speaking techniques'}</span></div>
                <h3 id="preview-title" style={{ marginTop: '15px' }}>{isMathPreview ? '⚡ What You\'ll Learn' : '🗣️ What You\'ll Learn'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '25px' }}>
                  {preview.learn.map(item => (
                    <div key={item.title} style={{ minHeight: '52px' }}>
                      <strong style={{ display: 'block', color: 'var(--lime)', fontSize: '0.9rem', marginBottom: '4px' }}>{item.title}</strong>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: '1.4' }}>{item.text}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '50px', padding: '25px', border: '1px solid var(--line)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                  <h4 style={{ margin: '0 0 15px', fontSize: '0.85rem', color: '#fff' }}>{isMathPreview ? '📝 Every Technique Includes:' : '✍️ Inside the PDF:'}</h4>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {preview.includes.map(inc => (
                      <li key={inc} style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '8px' }}>
                        <span style={{ color: isMathPreview ? 'var(--lime)' : 'var(--pink)' }}>•</span> {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="contents-card">
                <h4 style={{ margin: '0 0 25px', fontSize: '1.1rem', borderBottom: '1px solid var(--line)', paddingBottom: '15px', color: isMathPreview ? 'var(--lime)' : 'var(--pink)' }}>📘 Complete {isMathPreview ? 'MATH MAGIC' : 'ENGLISH SPEAKING'} PDF</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>

                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 0', color: 'var(--muted)', fontWeight: 'normal' }}>Section</th>
                      <th style={{ textAlign: 'right', padding: '12px 0', color: 'var(--muted)', fontWeight: 'normal' }}>What&apos;s Inside</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.table.map((row, idx) => (
                      <tr key={row.section} style={{ borderBottom: idx === preview.table.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '15px 0', color: '#e0e0e6', fontWeight: '500' }}>{row.section}</td>
                        <td style={{ padding: '15px 0', textAlign: 'right', color: isMathPreview ? 'rgba(217, 255, 112, 0.8)' : 'rgba(250, 46, 140, 0.8)', fontWeight: '600' }}>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid var(--line)' }}>
                      <td style={{ padding: '20px 0 0', fontWeight: '800', fontSize: '0.9rem', color: '#fff' }}>TOTAL</td>
                      <td style={{ padding: '20px 0 0', textAlign: 'right', fontWeight: '800', color: isMathPreview ? 'var(--lime)' : 'var(--pink)', fontSize: '0.9rem' }}>{isMathPreview ? '59 TECHNIQUES' : '70+ TOOLS'}</td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{ marginTop: '30px', padding: '18px', border: `1px solid ${isMathPreview ? 'rgba(217, 255, 112, 0.3)' : 'rgba(250, 46, 140, 0.3)'}`, borderRadius: '10px', color: 'var(--muted)', fontSize: '0.75rem', background: isMathPreview ? 'rgba(217, 255, 112, 0.04)' : 'rgba(250, 46, 140, 0.04)', lineHeight: '1.6' }}>
                  <strong style={{ color: isMathPreview ? 'var(--lime)' : 'var(--pink)', display: 'block', marginBottom: '6px' }}>🎯 {isMathPreview ? 'Made for Practice:' : 'Real-world Focus:'}</strong>
                  {isMathPreview ? 'Learn a method, see it in action, and practice using it yourself.' : 'Every section is designed around a specific speaking problem with natural examples.'}
                </div>
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

        <HomeReviews />

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

      <footer className="footer-wrap"><div className="site-footer"><div className="footer-brand"><Image src="/header-logo.png" alt="pdfDuniya" width={180} height={48} /><p>Make maths faster. Speak <span>English with confidence.</span></p></div><div className="footer-links"><div><strong>Explore</strong><Link href="/#math">Math</Link><Link href="/#english">English</Link><Link href="/referral">Refer & Earn</Link><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact Us</Link></div><div><strong>Policies</strong><Link href="/privacy-policy">Privacy Policy</Link><Link href="/refund-and-cancellation-policy">Refund and Cancellation Policy</Link><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/shipping-digital-delivery-policy">Shipping (Digital Delivery) Policy</Link></div></div><div className="footer-contact"><strong>Get in Touch</strong><div className="support-card"><span>SUPPORT EMAIL:</span><a href="mailto:amitmath12l@gmail.com">amitmath12l@gmail.com</a></div><p className="checkout-note"><span aria-hidden="true">&#10003;</span> 100% Encrypted Razorpay Checkout</p></div></div><div className="bottom-footer"><span>© 2026 pdfDuniya. All Rights Reserved.</span><span>Developed by &quot;Amit Matth&quot;</span></div></footer>
    </div>
  );
}
