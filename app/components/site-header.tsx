"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  const links = [
    { href: "/math", label: "Math" },
    { href: "/english", label: "English" },
    { href: "/faqs", label: "Faqs" },
    { href: "/about-us", label: "About" },
  ];

  return (
    <header className="site-header">
      <Link href="/" className="header-logo" aria-label="pdfDuniya home">
        <Image src="/header-logo.png" alt="pdfDuniya" width={270} height={72} priority />
      </Link>
      <nav className="main-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              color: pathname === link.href ? "var(--lime)" : "inherit",
              position: "relative",
              paddingBottom: "8px",
              display: "inline-block"
            }}
          >
            {link.label}
            {pathname === link.href && (
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                backgroundColor: "var(--lime)",
                borderRadius: "2px"
              }} />
            )}
          </Link>
        ))}
        <Link
          href="/samples"
          className="nav-button"
          style={{
            borderColor: pathname === "/samples" ? "var(--lime)" : "",
            color: pathname === "/samples" ? "var(--lime)" : ""
          }}
        >
          Samples
        </Link>
      </nav>
    </header>
  );
}
