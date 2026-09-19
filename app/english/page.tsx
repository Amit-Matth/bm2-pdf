import ContentPage from "../components/content-page";
import ProductCatalog from "../components/product-catalog";
import ReviewSection from "../components/review-section";

export default function EnglishPage() {
  return (
    <ContentPage
      pageClassName="english-page"
      title="English"
      intro="Find your words faster, speak more naturally, and let confidence take the lead."
      sidebar={
        <ReviewSection
          productKey="english"
          productTitle="English Speaking Without Freezing"
        />
      }
    >
      <ProductCatalog products={[{
        key: "english",
        title: "English Speaking Without Freezing",
        eyebrow: "English speaking guide · 13 pages",
        description: "A practical guide built around real speaking problems, with 70+ practical techniques, corrections, phrases, and speaking tools to help you speak with less hesitation.",
        price: "₹29",
        originalPrice: "₹99",
        badge: "71% OFF",
        features: ["Think in English methods", "70+ Natural Speaking Tools", "Professional Interview Tips", "Real-world Speaking Habits"],
        file: "Speak%20English.pdf"
      }]} />
    </ContentPage>
  );
}
