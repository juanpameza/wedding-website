import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gallery" };

// ─── CONFIG ───────────────────────────────────────────────

export default function FAQsPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Gallery</h1>

      <div className="max-w-2xl mx-auto pb-16">
        Add images here
      </div>
    </div>
  );
}
