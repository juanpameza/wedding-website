import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Itinerary" };

type ItineraryEvent = {
  id: string;
  name: string;
  time: string;
  description: string;
  detailsHref: string;
  imageSrc?: string;
};

type ItineraryDay = {
  date: string;
  events: ItineraryEvent[];
};

// CONFIG - edit days and events below
const itineraryDays: ItineraryDay[] = [
  {
    date: "Thursday, March 11, 2027",
    events: [
      {
        id: "thursday-event-1",
        name: "Holy Hour",
        time: "3:00 pm - 4:00 pm",
        description:
          "Cardedeu Chapel",
        detailsHref: "#thursday-event-1-details",
        imageSrc: "/images/cardedeu.png",
      },
      {
        id: "thursday-event-2",
        name: "Welccome Dinner",
        time: "4:00 pm - 7:00 pm",
        description:
          "Lake House",
        detailsHref: "#thursday-event-2-details",
        imageSrc: "/images/lake-house.png",
      },
      {
        id: "thursday-event-3",
        name: "Night out in San Salvador",
        time: "9:00 pm - 12:00 am",
        description:
          "La Cantina",
        detailsHref: "#thursday-event-3-details",
        imageSrc: "/images/cheers.png",
      },
    ],
  },
  {
    date: "Friday, March 12, 2027",
    events: [
      {
        id: "friday-event-1",
        name: "Beach Day",
        time: "9:00 am - 3:00 pm",
        description:
          "Balsamar Beach",
        detailsHref: "#friday-event-1-details",
        imageSrc: "/images/beach.png",
      },
    ],
  },
  {
    date: "Saturday, March 13, 2027",
    events: [
      {
        id: "ceremony",
        name: "Wedding Ceremony",
        time: "3:00 pm - 4:00 pm",
        description:
          "Basilica of Our Lady of Guadalupe",
        detailsHref: "#ceremony-details",
        imageSrc: "/images/basilica-guadalupe.png",
      },
      {
        id: "reception",
        name: "The Reception",
        time: "5:00 pm - 2:00 am",
        description:
          "Cajamarca El Salvador",
        detailsHref: "#reception-details",
        imageSrc: "/images/cajamarca.png",
      },
    ],
  },
];

function getEventOffset(dayIndex: number) {
  return itineraryDays
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

      <div className="max-w-4xl mx-auto space-y-24">
        {itineraryDays.map((day, dayIndex) => {
          const eventOffset = getEventOffset(dayIndex);

          return (
            <section key={day.date} className="space-y-12">
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

                  return (
                    <div
                      key={event.id}
                      id={event.id}
                      className={`flex flex-col md:flex-row ${
                        isEven ? "" : "md:flex-row-reverse"
                      } items-center gap-10`}
                    >
                      <div className="flex-shrink-0">
                        {event.imageSrc ? (
                          <Image
                            src={event.imageSrc}
                            alt={event.name}
                            width={320}
                            height={280}
                            className="h-56 w-64 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className="w-64 h-56 rounded-lg flex items-center justify-center border-2"
                            style={{
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
                              Watercolor image
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
                        <div
                          className={
                            isEven ? "text-left" : "text-left md:text-right"
                          }
                        >
                          <Link href={event.detailsHref} className="btn-outline">
                            View More Details
                          </Link>
                        </div>
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
