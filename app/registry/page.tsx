import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import registryContent from "@/content/registry.json";

const FL = pageFlowerOffset("/registry");

export const metadata: Metadata = { title: "Registry" };

export default function RegistryPage() {
  const { intro, note, registries } = registryContent;

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      <h1 className="page-heading" style={{ color: "var(--color-heading-rose)" }}>
        Registry
      </h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="registry" />

      <div className="max-w-2xl mx-auto space-y-12 text-center">
        <p style={{ color: "var(--color-body)" }}>{intro}</p>

        {/* ── Registry cards ── */}
        <div className="grid gap-8 sm:grid-cols-2">
          {registries.map((reg) => (
            <div
              key={reg.name}
              className="info-card border rounded-sm"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <h2
                className="card-heading mb-2"
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

        <FlowerDivider src={flowerByIndex(FL + 2)} />

        <p
          className="text-sm italic"
          style={{ color: "var(--color-body)", maxWidth: "480px", margin: "0 auto" }}
        >
          {note}
        </p>
      </div>
    </div>
  );
}
