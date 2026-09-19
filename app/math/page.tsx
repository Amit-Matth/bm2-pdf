import ContentPage from "../components/content-page";
import ProductCatalog from "../components/product-catalog";
import ReviewSection from "../components/review-section";

export default function MathPage() {
  return (
    <ContentPage
      pageClassName="math-page"
      title="Math"
      intro="Make numbers click faster with shortcuts, patterns, and practice that feels like a superpower."
      sidebar={
        <ReviewSection
          productKey="math"
          productTitle="Math Magic: Master Mental Math"
        />
      }
    >
      <ProductCatalog products={[{
        key: "math",
        title: "Math Magic: Master Mental Math",
        eyebrow: "Math Magic · 35 pages",
        description: "A practical guide packed with 59 mental math techniques and calculation moves, organized into 9 comprehensive sections.",
        price: "₹29",
        originalPrice: "₹99",
        badge: "71% OFF",
        features: ["Square & Cube Root Patterns", "Rebuild Forgotten Tables", "Quick 5, 25, 125 Shortcuts", "59 Proven Calculation Methods"],
        file: "MATH%20MAGIC.pdf"
      }]} />
    </ContentPage>
  );
}
