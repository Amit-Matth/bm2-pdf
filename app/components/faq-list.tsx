"use client";

import { useState } from "react";
import RevealBlock from "./reveal-block";

type FaqListProps = {
  questions: Array<[string, string]>;
};

export default function FaqList({ questions }: FaqListProps) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  return (
    <div className="faq-list">
      {questions.map(([question, answer], index) => {
        const isOpen = openQuestion === question;
        const answerId = `faq-answer-${question.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <RevealBlock direction="bottom" delay={index * 60} key={question}>
            <article className={`faq-item ${isOpen ? "is-open" : ""}`}>
              <button className="faq-question" type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenQuestion(isOpen ? null : question)}>
                <span>{question}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </button>
              <div className="faq-answer-wrap" id={answerId} aria-hidden={!isOpen}>
                <div className="faq-answer"><p>{answer}</p></div>
              </div>
            </article>
          </RevealBlock>
        );
      })}
    </div>
  );
}
