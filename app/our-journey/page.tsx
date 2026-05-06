import type { Metadata } from "next";
import JourneyMap from "@/components/JourneyMap";

export const metadata: Metadata = { title: "Our Journey" };

export default function OurJourneyPage() {
  return (
    <section
      className="flex min-h-screen w-full items-start justify-center overflow-x-auto"
      style={{ backgroundColor: "#fbf1e3" }}
    >
      <JourneyMap />
    </section>
  );
}
