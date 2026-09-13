"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);
    setSubmitted(false);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "We could not send your message right now.");
      }

      form.reset();
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not send your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row"><label htmlFor="name">Your name</label><input id="name" name="name" type="text" placeholder="Amit Sharma" required /></div>
      <div className="form-row"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" placeholder="you@example.com" required /></div>
      <div className="form-row"><label htmlFor="subject">Subject</label><input id="subject" name="subject" type="text" placeholder="How can we help?" required /></div>
      <div className="form-row"><label htmlFor="message">Message</label><textarea id="message" name="message" rows={5} placeholder="Tell us a little more..." required /></div>
      <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send message"} <span aria-hidden="true">&#8599;</span></button>
      {submitted && <p className="form-success" role="status">Your message has been sent.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
