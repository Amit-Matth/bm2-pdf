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
        eyebrow: "Math Magic · 65 pages",
        description: "A practical mental-math guide covering multiplication, division, percentages, profit and loss, square and cube patterns, table building, and number tricks.",
        price: "₹29",
        originalPrice: "₹99",
        badge: "71% OFF",
        features: ["Base Jump, Half-Double, 9 & 101 multiplication tricks", "Power-of-10 and repeated-halving division", "Percentage, fraction, profit & loss shortcuts", "Square, cube, table-building & number magic tricks"],
        file: "MATH%20MAGIC.pdf"
      }]} />
    </ContentPage>
  );
}
