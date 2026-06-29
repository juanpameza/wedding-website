import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import JourneyMap from "@/components/JourneyMap";
import journeyContent from "@/content/journey.json";

export const metadata: Metadata = { title: "Our Journey" };

export default function OurJourneyPage() {
  return (
    <section
      className="flex min-h-screen w-full flex-col items-center overflow-x-auto"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <PageCountdown page="journey" />
      <JourneyMap
        stops={journeyContent.stops}
        mapImage={journeyContent.mapImage}
        mapMaxWidth={journeyContent.mapMaxWidth}
        mapPadding={journeyContent.mapPadding}
        mapAspectRatio={journeyContent.mapAspectRatio}
        stopImageWidth={journeyContent.stopImageWidth}
      />
    </section>
  );
}
