import type { Metadata } from "next";

export const metadata: Metadata = { title: "Hair & Makeup" };

// ─── CONFIG ───────────────────────────────────────────────
const INTRO =
  "We want everyone to feel their most beautiful and confident on our big day! Below you'll find information about hair and makeup services available for the wedding weekend.";

const STYLISTS = [
  {
    name: "Stylist / Salon Name",
    role: "Hair & Makeup",
    note: "Available for wedding party. Contact to book your appointment.",
    phone: "+1 (555) 000-0000",
    email: "stylist@example.com",
    instagram: "@stylisthandle",
  },
  // Add more stylists as needed
];

const TIPS = [
  "Book your appointment as early as possible — spots fill up fast!",
  "Bring inspiration photos to your consultation.",
  "Arrive with clean, dry hair unless your stylist says otherwise.",
  "Let us know if you have any allergies to products.",
];
// ─────────────────────────────────────────────────────────

export default function HairMakeupPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Hair &amp; Makeup</h1>

      <div className="max-w-3xl mx-auto space-y-14">
        {/* ── Intro ── */}
        <p className="text-center" style={{ color: "var(--color-body)" }}>
          {INTRO}
        </p>

        {/* ── Stylists ── */}
        <section>
          <h2 className="section-heading mb-8">Our Recommended Stylists</h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {STYLISTS.map((s) => (
              <div
                key={s.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg-white)",
                }}
              >
                <h3
                  className="font-script text-2xl mb-1"
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
                <p className="text-sm mb-3" style={{ color: "var(--color-body)" }}>
                  {s.note}
                </p>
                {s.phone && (
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    Phone: {s.phone}
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
                    Instagram: {s.instagram}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        {/* ── Tips ── */}
        <section className="text-center pb-8">
          <h2 className="section-heading mb-6">Tips &amp; Reminders</h2>
          <ul className="text-left inline-block space-y-3">
            {TIPS.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3"
                style={{ color: "var(--color-body)" }}
              >
                <span style={{ color: "var(--color-heading-rose)" }}>✦</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
