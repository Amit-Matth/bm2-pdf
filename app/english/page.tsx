import ContentPage from "../components/content-page";
import ProductCatalog from "../components/product-catalog";

export default function EnglishPage() {
  return <ContentPage pageClassName="english-page" title="English" intro="Find your words faster, speak more naturally, and let confidence take the lead."><ProductCatalog products={[{ key: "english", title: "Speak English with Confidence", eyebrow: "English speaking guide · 74 pages", description: "A practical guide to natural phrases, better sentence patterns, and confident everyday conversations.", price: "₹29", originalPrice: "₹99", badge: "71% OFF", features: ["Think in English methods", "Natural conversation starters", "Grammar fixes that matter", "Speaking drills and scripts"], file: "Speak%20English.pdf" }]} /></ContentPage>;
}
