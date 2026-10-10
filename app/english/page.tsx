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
        description: "A 13-page speaking guide with 70+ practical fixes, natural phrases, and conversation tools for everyday situations, interviews, and calls.",
        price: "₹29",
        originalPrice: "₹99",
        badge: "71% OFF",
        features: ["4 Think-in-English fixes", "12 grammar corrections & 13 phrase fixes", "15 natural sentence upgrades", "6 interview and call techniques"],
        file: "Speak%20English.pdf"
      }]} />
    </ContentPage>
  );
}
