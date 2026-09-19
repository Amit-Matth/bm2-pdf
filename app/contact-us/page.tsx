import ContentPage from "../components/content-page";
import ContactForm from "../components/contact-form";

export default function ContactUs() {
  return (
    <ContentPage
      title="Contact Us"
      intro="Questions about a PDF, an order, or your next learning goal? We are happy to help."
    >
      <div style={{ display: "grid", gap: "25px" }}>
        
        {/* Support Highlight Box */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(217,255,112,0.25)",
          borderRadius: "16px",
          padding: "25px 30px"
        }}>
          <h2 style={{ fontSize: "1.3rem", color: "var(--ink)", margin: "0 0 8px" }}>Direct Email Support</h2>
          <p style={{ color: "var(--muted)", margin: "0 0 15px", fontSize: "0.9rem", lineHeight: "1.6" }}>
            Reach out directly for order assistance, PDF download help, or referral program questions.
          </p>
          <a
            href="mailto:amitmath12l@gmail.com"
            style={{ color: "var(--lime)", fontWeight: "bold", fontSize: "1.05rem", textDecoration: "underline" }}
          >
            amitmath12l@gmail.com
          </a>
        </div>

        {/* Contact Form Container */}
        <div>
          <h2 style={{ fontSize: "1.4rem", color: "var(--ink)", marginBottom: "10px" }}>Send Us a Message</h2>
          <p style={{ color: "var(--muted)", marginBottom: "25px", fontSize: "0.9rem" }}>
            Fill in your details below and our support team will respond as soon as possible.
          </p>
          <ContactForm />
        </div>

        {/* Support Tip Box */}
        <div style={{
          background: "rgba(38,120,255,0.05)",
          border: "1px solid rgba(38,120,255,0.2)",
          borderRadius: "14px",
          padding: "20px 25px"
        }}>
          <h3 style={{ fontSize: "1rem", color: "var(--blue)", margin: "0 0 6px" }}>Order Support Tip:</h3>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.85rem", lineHeight: "1.5" }}>
            If contacting us about a purchase, please include the email address used during checkout so we can locate your order instantly.
          </p>
        </div>

      </div>
    </ContentPage>
  );
}
