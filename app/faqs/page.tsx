import ContentPage from "../components/content-page";
import FaqList from "../components/faq-list";

const questions: Array<[string, string]> = [
  ["What do I receive after buying?", "You receive a downloadable PDF by email. Digital delivery is quick, simple, and available wherever you are."],
  ["Are these PDFs for beginners?", "Yes. Each guide starts with approachable explanations and builds toward practical, everyday use."],
  ["Can I get a refund?", "Because our products are digital downloads, refunds are handled case by case. Please contact us within 7 days if there is a genuine issue."],
  ["How can I contact pdfDuniya?", "Email us at amitmatth121@gmail.com and our small team will get back to you as soon as possible."],
];

export default function Faqs() {
  return <ContentPage pageClassName="faqs-page" title="Faqs" intro="A few quick answers about our PDFs, delivery, and support."><FaqList questions={questions} /></ContentPage>;
}
