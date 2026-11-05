"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) return;

    // Track page visit
    const visitKey = `bm2pdf_visit:${window.location.pathname}`;
    const previousVisit = sessionStorage.getItem(visitKey);
    if (!previousVisit || Date.now() - Number(previousVisit) > 30 * 60 * 1000) {
      sessionStorage.setItem(visitKey, String(Date.now()));
      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "visit", path: window.location.pathname }),
      });
    }

    // Track referral click
    const ref = searchParams.get("ref");
    if (ref) {
      const trackKey = `ref_tracked_${ref}`;
      if (!sessionStorage.getItem(trackKey)) {
        void fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ event: "referral_click", referralCode: ref, path: window.location.pathname }),
        });
        sessionStorage.setItem(trackKey, "true");
      }
    }
  }, [searchParams]);

  return null;
}
