import ContentPage from "../components/content-page";
import FaqList from "../components/faq-list";

const questions: Array<[string, string]> = [
  ["Is the payment secure?", "Yes, we use Razorpay for all transactions. Your payment details are 100% encrypted and we never store your card or bank information."],
  ["How long does it take to receive my PDFs?", "Delivery is instant! As soon as your payment is successful, an automated email is sent to your registered address with the download links."],
  ["Do I need an account to purchase?", "Yes, creating a quick account helps us secure your purchase, manage your referral earnings, and allows you to leave verified reviews."],
  ["Can I read these PDFs on my mobile phone?", "Absolutely. Our PDFs are optimized for all devices—phones, tablets, and laptops. You can use any standard PDF viewer to read them."],
  ["Are these PDFs for beginners?", "Yes. Each guide starts with approachable explanations and builds toward practical, everyday use."],
  ["What if I lose my download link?", "No worries! Since you have an account, your purchase is recorded. Just contact us with your order ID and we'll resend your links immediately."],
  ["Can I get a refund?", "Because our products are digital downloads, refunds are handled case by case. Please contact us within 7 days if there is a genuine issue."],
  ["How can I contact BM2 PDF?", "Email us at amitmatth121@gmail.com and our small team will get back to you as soon as possible."],
];

export default function Faqs() {
  return (
    <ContentPage
      pageClassName="faqs-page"
      title="Faqs"
      intro="Everything you need to know about our PDFs, secure payments, and how we help you learn."
    >
      <FaqList questions={questions} />
    </ContentPage>
  );
}
