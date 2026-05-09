import type { Metadata } from "next";
import JourneyMap from "@/components/JourneyMap";
import journeyContent from "@/content/journey.json";

export const metadata: Metadata = { title: "Our Journey" };

export default function OurJourneyPage() {
  return (
    <section
      className="flex min-h-screen w-full items-start justify-center overflow-x-auto"
      style={{ backgroundColor: "#fbf1e3" }}
    >
      <JourneyMap
        stops={journeyContent.stops}
        mapImage={journeyContent.mapImage}
      />
    </section>
  );
}
