import type { Metadata } from "next";

export const metadata: Metadata = { title: "Registry" };

// ─── CONFIG ───────────────────────────────────────────────
const INTRO =
  "Your presence at our wedding is the greatest gift of all. However, if you'd like to give something, we've registered at the following stores.";

const REGISTRIES = [
  {
    name: "Registry Store 1",
    description: "Home goods and kitchenware.",
    url: "https://example.com/registry1",
    buttonLabel: "View Registry",
  },
  {
    name: "Registry Store 2",
    description: "Experiences and travel fund.",
    url: "https://example.com/registry2",
    buttonLabel: "View Registry",
  },
  // Add more registries as needed
];

const NOTE =
  "If you'd like to give a monetary gift, cash or a gift card is always appreciated and can be brought to the wedding or sent digitally. Thank you so much for your generosity and love!";
// ─────────────────────────────────────────────────────────

export default function RegistryPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      <h1 className="page-heading" style={{ color: "var(--color-heading-rose)" }}>
        Registry
      </h1>

      <div className="max-w-2xl mx-auto space-y-12 text-center">
        <p style={{ color: "var(--color-body)" }}>{INTRO}</p>

        {/* ── Registry cards ── */}
        <div className="grid gap-8 sm:grid-cols-2">
          {REGISTRIES.map((reg) => (
            <div
              key={reg.name}
              className="info-card border rounded-sm"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <h2
                className="font-script text-2xl mb-2"
                style={{ color: "var(--color-heading-rose)" }}
              >
                {reg.name}
              </h2>
              <p
                className="text-sm mb-4"
                style={{ color: "var(--color-body)" }}
              >
                {reg.description}
              </p>
              <a
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                {reg.buttonLabel}
              </a>
            </div>
          ))}
        </div>

        <hr className="divider" />

        <p
          className="text-sm italic"
          style={{ color: "var(--color-body)", maxWidth: "480px", margin: "0 auto" }}
        >
          {NOTE}
        </p>
      </div>
    </div>
  );
}
