import type { Metadata } from "next";

export const metadata: Metadata = { title: "Things To Do" };

// ─── CONFIG ───────────────────────────────────────────────
const INTRO =
  "While you're here, we hope you take time to enjoy the beauty, flavors, and charm of our city. If you need help planning tours or activities, reach out to our wedding planning team.";

const PLANNING_CONTACT = "+1 (555) 200-0000";

const categories = [
  {
    heading: "Breakfast & Lunch Spots",
    items: [
      { name: "Café Name 1", note: "Great for a morning bite." },
      { name: "Café Name 2", note: "Local favorite for lunch." },
      { name: "Café Name 3", note: "Beautiful garden setting." },
    ],
  },
  {
    heading: "Dinner & Drinks",
    items: [
      { name: "Restaurant 1", note: "Upscale dining, reservations recommended." },
      { name: "Bar / Restaurant 2", note: "Lively atmosphere and great cocktails." },
      { name: "Restaurant 3", note: "Authentic local cuisine." },
    ],
  },
  {
    heading: "Explore the City",
    items: [
      { name: "Landmark 1", note: "Scenic lake — perfect for a weekend morning." },
      { name: "Landmark 2", note: "Historic city center, great for walking tours." },
      { name: "Landmark 3", note: "Beautiful beach town ~1 hour away." },
    ],
  },
];
// ─────────────────────────────────────────────────────────

export default function ThingsToDoPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Things To Do</h1>

      <div className="max-w-3xl mx-auto space-y-14">
        <p className="text-center" style={{ color: "var(--color-body)" }}>
          {INTRO}{" "}
          <strong>{PLANNING_CONTACT}</strong>
        </p>

        {categories.map((cat) => (
          <section key={cat.heading}>
            <h2 className="section-heading mb-6">{cat.heading}</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {cat.items.map((item) => (
                <div
                  key={item.name}
                  className="info-card border rounded-sm"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg-white)",
                  }}
                >
                  <h3
                    className="font-script text-xl mb-1"
                    style={{ color: "var(--color-heading-olive)" }}
                  >
                    {item.name}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-body)" }}>
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
