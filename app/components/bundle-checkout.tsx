"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function BundleCheckout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToCheckout() {
    const ref = searchParams.get("ref") || "";
    router.push(`/buy?p=bundle${ref ? `&ref=${ref}` : ""}`);
  }

  return (
    <button className="button button-primary" type="button" onClick={goToCheckout}>
      Get Both PDFs (₹29) <span aria-hidden="true">&#8594;</span>
    </button>
  );
}
