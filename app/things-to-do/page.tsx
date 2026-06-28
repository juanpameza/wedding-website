import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { FLOWERS } from "@/lib/flowers";
import thingsContent from "@/content/things-to-do.json";

export const metadata: Metadata = { title: "Things To Do" };

export default function ThingsToDoPage() {
  const { intro, planningContact, categories } = thingsContent;

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Things To Do</h1>
      <FlowerDivider src={FLOWERS.anthurium} />
      <PageCountdown page="thingsToDo" />

      <div className="max-w-3xl mx-auto space-y-14">
        <p className="text-center" style={{ color: "var(--color-body)" }}>
          {intro}{" "}
          <strong>{planningContact}</strong>
        </p>

        {categories.map((cat, i) => (
          <section key={cat.heading}>
            {i > 0 && <FlowerDivider src={FLOWERS.anthurium} />}
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
                    className="card-heading mb-1"
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
