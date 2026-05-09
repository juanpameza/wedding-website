import type { Metadata } from "next";
import faqsContent from "@/content/faqs.json";

export const metadata: Metadata = { title: "FAQs" };

export default function FAQsPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">FAQs</h1>

      <div className="max-w-2xl mx-auto pb-16">
        {faqsContent.questions.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex items-center justify-between">
              {faq.question}
              <span
                className="ml-4 transition-transform group-open:rotate-180 flex-shrink-0"
                style={{ color: "var(--color-heading-rose)" }}
              >
                ▾
              </span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
