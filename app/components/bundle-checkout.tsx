"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "../contexts/UserContext";

function BundleCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setShowAuthModal } = useUser();
  const hasPurchased = Boolean(user?.purchasedProducts?.some((product) => ["math", "english", "bundle"].includes(product)));

  function handleAction() {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (user.referralCode) {
      router.push(`/referral/stats/${user.referralCode}`);
      return;
    }
    if (hasPurchased) {
      router.push("/math");
      return;
    }
    const ref = searchParams.get("ref") || "";
    router.push(`/buy?p=bundle${ref ? `&ref=${ref}` : ""}`);
  }

  return (
    <button className="button button-primary" type="button" onClick={handleAction}>
      {user?.referralCode ? "Go to Referral Dashboard" : hasPurchased ? "View Purchased PDFs" : "Get Both PDFs (₹29)"} <span aria-hidden="true">&#8594;</span>
    </button>
  );
}

export default function BundleCheckout() {
  return (
    <Suspense fallback={null}>
      <BundleCheckoutContent />
    </Suspense>
  );
}
