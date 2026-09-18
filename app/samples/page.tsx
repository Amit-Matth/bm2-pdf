import ContentPage from "../components/content-page";
import ProductCatalog from "../components/product-catalog";

export default function SamplesPage() {
  return <ContentPage pageClassName="samples-page" title="Samples" intro="Try the first page for free. Get a feel for the rhythm, clarity, and useful ideas inside every guide."><ProductCatalog products={[{ key: "math-sample", title: "Math Sample", eyebrow: "SpeedMath preview", description: "A free look at the clear explanations and quick practice inside our maths guide.", badge: "FREE", features: ["Sample lesson pages", "Quick calculation tips", "Printable practice", "Instant download"], file: "Math%20Sample.pdf", free: true }, { key: "english-sample", title: "English Sample", eyebrow: "English preview", description: "A free look at the phrases, sentence upgrades, and speaking practice inside our English guide.", badge: "FREE", features: ["Sample speaking lessons", "Useful daily phrases", "Grammar examples", "Instant download"], file: "English%20Sample.pdf", free: true }]} /></ContentPage>;
}
