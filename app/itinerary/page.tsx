import type { Metadata } from "next";
import Image from "next/image";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import ItineraryEventDetails from "@/components/ItineraryEventDetails";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import itineraryContent from "@/content/itinerary.json";

const FL = pageFlowerOffset("/itinerary");

export const metadata: Metadata = { title: "Itinerary" };

function getEventOffset(dayIndex: number) {
  return itineraryContent.days
    .slice(0, dayIndex)
    .reduce((count, day) => count + day.events.length, 0);
}

export default function ItineraryPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Itinerary</h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="itinerary" />

      <div className="max-w-4xl mx-auto space-y-24">
        {itineraryContent.days.map((day, dayIndex) => {
          const eventOffset = getEventOffset(dayIndex);

          return (
            <section key={day.date} className="space-y-12">
              {dayIndex > 0 && <FlowerDivider src={flowerByIndex(FL + 1 + dayIndex)} />}
              <h2
                className="section-subheading uppercase"
                style={{ color: "var(--color-heading-olive)" }}
              >
                {day.date}
              </h2>

              <div className="space-y-16">
                {day.events.map((event, eventIndex) => {
                  const isEven = (eventOffset + eventIndex) % 2 === 0;
                  const textAlignClass = isEven
                    ? "!text-left"
                    : "!text-left md:!text-right";
                  const anchorId = event.name
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  const imageWidth = event.imageWidth ?? 256;
                  const imageHeight = event.imageHeight ?? 224;
                  const imagePadding = event.imagePadding ?? 0;
                  const imageAspectRatio = `${imageWidth} / ${imageHeight}`;

                  return (
                    <div
                      key={`${day.date}-${eventIndex}`}
                      id={anchorId}
                      className={`flex flex-col md:flex-row ${
                        isEven ? "" : "md:flex-row-reverse"
                      } items-center gap-10`}
                    >
                      <div
                        className="flex-shrink-0"
                        style={{ padding: imagePadding }}
                      >
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.name}
                            width={imageWidth}
                            height={imageHeight}
                            className="max-w-full rounded-lg object-contain"
                            style={{
                              height: "auto",
                              width: `min(100%, ${imageWidth}px)`,
                            }}
                          />
                        ) : (
                          <div
                            className="flex max-w-full items-center justify-center rounded-lg border-2"
                            style={{
                              aspectRatio: imageAspectRatio,
                              width: `min(100%, ${imageWidth}px)`,
                              borderColor: "var(--color-muted)",
                              borderStyle: "dashed",
                              backgroundColor: "var(--color-bg-white)",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--color-muted)",
                                fontSize: "0.8rem",
                              }}
                            >
                              {event.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="md:flex-1">
                        <h3 className={`section-heading ${textAlignClass}`}>
                          {event.name}
                        </h3>
                        <p
                          className={`section-subheading ${textAlignClass} mb-4`}
                          style={{ color: "var(--color-heading-olive)" }}
                        >
                          {event.time}
                        </p>
                        <p
                          className={`mb-5 ${
                            isEven ? "text-left" : "text-left md:text-right"
                          }`}
                          style={{ color: "var(--color-body)" }}
                        >
                          {event.description}
                        </p>
                        <ItineraryEventDetails
                          event={event}
                          alignClass={
                            isEven ? "text-left" : "text-left md:text-right"
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
