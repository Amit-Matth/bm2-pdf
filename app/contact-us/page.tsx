import ContentPage from "../components/content-page";
import ContactForm from "../components/contact-form";

export default function ContactUs() {
  return <ContentPage title="Contact Us" intro="Questions about a PDF, an order, or your next learning goal? We are happy to help."><h2>Let&apos;s talk</h2><p>Send us a note and tell us what you need. We aim to reply as soon as possible.</p><p><strong>Email:</strong> <a href="mailto:amitmath12l@gmail.com">amitmath12l@gmail.com</a></p><ContactForm /><h2>For order support</h2><p>Please include the email used for your order and the name of the PDF you purchased. This helps us find the right details quickly.</p></ContentPage>;
}
