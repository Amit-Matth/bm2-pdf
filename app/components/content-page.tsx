import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ContentPageProps = {
  title: string;
  intro: string;
  children: ReactNode;
  pageClassName?: string;
};

export default function ContentPage({ title, intro, children, pageClassName = "" }: ContentPageProps) {
  return (
    <div className={`site-shell ${pageClassName}`}>
      <header className="site-header">
        <Link href="/" className="header-logo" aria-label="pdfDuniya home"><Image src="/header-logo.png" alt="pdfDuniya" width={270} height={72} priority /></Link>
        <nav className="main-nav" aria-label="Main navigation"><Link href="/math">Math</Link><Link href="/english">English</Link><Link href="/faqs">Faqs</Link><Link href="/about-us">About</Link><Link href="/samples" className="nav-button">Samples</Link></nav>
      </header>
      <main className="inner-page">
        <div className="inner-page-heading"><p className="eyebrow">pdfDuniya / information</p><h1>{title}</h1><p>{intro}</p></div>
        <article className="legal-copy">{children}</article>
      </main>
      <footer className="footer-wrap"><div className="site-footer"><div className="footer-brand"><Image src="/header-logo.png" alt="pdfDuniya" width={180} height={48} /><p>Make maths faster. Speak <span>English with confidence.</span></p></div><div className="footer-links"><div><strong>Explore</strong><Link href="/math">Math</Link><Link href="/english">English</Link><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact Us</Link></div><div><strong>Policies</strong><Link href="/privacy-policy">Privacy Policy</Link><Link href="/refund-and-cancellation-policy">Refund and Cancellation Policy</Link><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/shipping-digital-delivery-policy">Shipping (Digital Delivery) Policy</Link></div></div><div className="footer-contact"><strong>Get in Touch</strong><div className="support-card"><span>SUPPORT EMAIL:</span><a href="mailto:amitmath12l@gmail.com">amitmath12l@gmail.com</a></div><p className="checkout-note"><span aria-hidden="true">&#10003;</span> 100% Encrypted Razorpay Checkout</p></div></div><div className="bottom-footer"><span>© 2026 pdfDuniya. All Rights Reserved.</span><span>Developed by &quot;Amit Matth&quot;</span></div></footer>
    </div>
  );
}
