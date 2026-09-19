"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "../contexts/UserContext";

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, setShowAuthModal, logout } = useUser();

  const links = [
    { href: "/math", label: "Math" },
    { href: "/english", label: "English" },
    { href: "/faqs", label: "Faqs" },
    { href: "/about-us", label: "About" },
    { href: "/contact-us", label: "Contact" },
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
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {link.label}
            {pathname === link.href && (
              <span style={{
                position: "absolute",
                bottom: "-10px",
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

        <div className="user-nav">
          {user ? (
            <div className="user-profile">
              <div className="user-avatar" title={user.username}>
                {user.username[0].toUpperCase()}
              </div>
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <p className="user-email-title">Signed in as</p>
                  <p className="user-email-text">{user.email}</p>
                </div>
                <div className="user-dropdown-divider" />
                {user.referralCode && (
                  <Link href={`/referral/stats/${user.referralCode}`} className="user-dropdown-item dashboard-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>Referral Dashboard</span>
                  </Link>
                )}
                <button onClick={() => logout()} className="user-dropdown-item logout-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              className="user-login-trigger"
              onClick={() => setShowAuthModal(true)}
              aria-label="Sign In"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          )}
        </div>
      </nav>

      <style jsx>{`
        .user-nav {
          margin-left: 20px;
          position: relative;
          display: flex;
          align-items: center;
        }
        @media (max-width: 560px) {
          .user-nav {
            margin-left: 0;
          }
          .user-avatar, .user-login-trigger {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.8rem !important;
          }
        }
        .user-login-trigger {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--line);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ink);
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-login-trigger:hover {
          background: rgba(255,255,255,0.1);
          color: var(--lime);
          border-color: var(--lime);
        }
        .user-profile {
          position: relative;
          cursor: pointer;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          aspect-ratio: 1 / 1;
          background: linear-gradient(135deg, var(--lime), #b3ff00);
          color: #000;
          font-weight: bold;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(217,255,112,0.2);
        }
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 10px;
          background: rgba(23, 19, 35, 0.96);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 12px;
          border-radius: 14px;
          min-width: 220px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(8px);
          transition: all 0.2s ease-in-out;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(217, 255, 112, 0.05);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .user-profile:hover .user-dropdown,
        .user-dropdown:hover {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .user-dropdown-header {
          padding: 4px 6px 8px;
        }
        .user-email-title {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          margin: 0 0 2px;
        }
        .user-email-text {
          font-size: 0.85rem;
          color: var(--ink);
          font-weight: 500;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-dropdown-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.08);
          margin: 2px 0 4px;
        }
        :global(.user-dropdown-item) {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 10px 12px !important;
          border-radius: 8px !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          transition: all 0.15s ease !important;
          text-decoration: none !important;
          border: none !important;
          background: transparent !important;
          width: 100% !important;
          text-align: left !important;
          cursor: pointer !important;
          box-sizing: border-box !important;
        }
        :global(.dashboard-item) {
          color: var(--lime) !important;
          background: rgba(217, 255, 112, 0.08) !important;
          border: 1px solid rgba(217, 255, 112, 0.2) !important;
        }
        :global(.dashboard-item:hover) {
          background: rgba(217, 255, 112, 0.18) !important;
          color: #fff !important;
          transform: translateX(2px);
        }
        :global(.logout-item) {
          color: var(--pink) !important;
        }
        :global(.logout-item:hover) {
          background: rgba(250, 46, 140, 0.12) !important;
          color: var(--pink) !important;
          transform: translateX(2px);
        }
      `}</style>
    </header>
  );
}
