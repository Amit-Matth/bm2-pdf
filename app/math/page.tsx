import ContentPage from "../components/content-page";
import ProductCatalog from "../components/product-catalog";

export default function MathPage() {
  return <ContentPage pageClassName="math-page" title="Math" intro="Make numbers click faster with shortcuts, patterns, and practice that feels like a superpower."><ProductCatalog products={[{ key: "math", title: "SpeedMath: Calculate Faster", eyebrow: "BasicMath guide · 68 pages", description: "A focused workbook for quicker calculations, sharper number sense, and less hesitation in everyday maths.", price: "₹29", originalPrice: "₹99", badge: "71% OFF", features: ["Fast addition and subtraction", "Multiplication shortcuts", "Fractions and percentages", "Timed practice with answers"], file: "MATH%20MAGIC.pdf" }]} /></ContentPage>;
}
