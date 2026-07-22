import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import hairMakeupContent from "@/content/hair-makeup.json";

const FL = pageFlowerOffset("/hair-makeup");

export const metadata: Metadata = { title: "Hair & Makeup" };

// Keystatic omits empty text fields when it saves JSON, so any text value
// may be absent from the file entirely — treat them all as optional.
type HairMakeupContent = {
  intro?: string;
  stylists: {
    name: string;
    role?: string;
    note?: string;
    phone?: string;
    email?: string;
    instagram?: string;
    location?: string;
  }[];
  tips: { tip?: string }[];
};

export default function HairMakeupPage() {
  const { intro, stylists, tips } = hairMakeupContent as HairMakeupContent;

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Hair &amp; Makeup</h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="hairMakeup" />

      <div className="max-w-3xl mx-auto space-y-14">
        {/* ── Intro ── */}
        <p className="text-center" style={{ color: "var(--color-body)" }}>
          {intro}
        </p>

        {/* ── Stylists ── */}
        <section>
          <h2 className="section-heading mb-8">Our Recommended Stylists</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {stylists.map((s) => (
              <div
                key={s.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-white)",
                }}
              >
                <h3
                  className="card-heading mb-1"
                  style={{ color: "var(--color-heading-rose)" }}
                >
                  {s.name}
                </h3>
                <p
                  className="text-sm italic mb-3"
                  style={{ color: "var(--color-heading-olive)" }}
                >
                  {s.role}
                </p>
                {s.note && (
                  <p className="text-sm mb-3" style={{ color: "var(--color-body)" }}>
                    {s.note}
                  </p>
                )}
                {s.phone && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    Phone / WhatsApp:{" "}
                    <a
                      href={`tel:${s.phone.replace(/[^+\d]/g, "")}`}
                      className="underline"
                    >
                      {s.phone}
                    </a>
                  </p>
                )}
                {s.email && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    Email:{" "}
                    <a href={`mailto:${s.email}`} className="underline">
                      {s.email}
                    </a>
                  </p>
                )}
                {s.instagram && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    Instagram:{" "}
                    <a
                      href={`https://instagram.com/${s.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {s.instagram}
                    </a>
                  </p>
                )}
                {s.location && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    Location:{" "}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${s.name} ${s.location}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {s.location}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <FlowerDivider src={flowerByIndex(FL + 2)} />

        {/* ── Tips ── */}
        <section className="text-center pb-8">
          <h2 className="section-heading mb-6">Tips &amp; Reminders</h2>
          <ul className="text-left inline-block space-y-3">
            {tips.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ color: "var(--color-body)" }}
              >
                <span style={{ color: "var(--color-heading-rose)" }}>✦</span>
                {item.tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
