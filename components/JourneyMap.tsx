"use client";

import Image from "next/image";
import { useState } from "react";

type JourneyStop = {
  number: number;
  location: string;
  story: string;
  x: number;
  y: number;
};

const stops: JourneyStop[] = [
  {
    number: 1,
    location: "El Salvador",
    story:
      "Where it all started. In 2022, Sage came as a guest to a wedding \u2014 Juanpa was standing up for his best friend. We spent the whole weekend talking and laughing, and didn't want it to end.",
    x: 39.6,
    y: 30.4,
  },
  {
    number: 2,
    location: "Arizona, Utah & Nevada",
    story:
      "Sage had somehow never seen the Grand Canyon, so Juanpa flew out and they turned it into a road trip: Grand Canyon, Zion, Horseshoe Bend \u2014 and our first official date at the Eiffel Tower in Vegas.",
    x: 70.1,
    y: 30.8,
  },
  {
    number: 3,
    location: "Holbox & Mexico",
    story:
      "Playita, family, and lot's of good food!",
    x: 13.8,
    y: 46,
  },
  {
    number: 4,
    location: "Ravenna, Italy",
    story: "First half marathon together. In reality, more of an excuse to travel together!",
    x: 39.3,
    y: 44.3,
  },
  {
    number: 5,
    location: "Switzerland",
    story: "Mountains, quiet, and a trip that made the long distance feel worth it.",
    x: 51.3,
    y: 45.9,
  },
  {
    number: 6,
    location: "Istanbul & Cappadocia",
    story:
      "Exploring a whole new culture. Hot air balloons were canceled due to weather, but an ATV tour through the valleys of Cappadocia more than made up for it.",
    x: 75.4,
    y: 46.7,
  },
  {
    number: 7,
    location: "Cartagena, Colombia",
    story:
      "A full month working remotely from Colombia. Lots of fun and adventure!",
    x: 15,
    y: 62.3,
  },
  {
    number: 8,
    location: "Austin",
    story: "F1 weekend in Austin and a Ferrari 1-2. Best way to celebrate Juanpa's birthday!",
    x: 39,
    y: 61.8,
  },
  {
    number: 9,
    location: "Catalina Island, California",
    story: "Kayaking and a lot of sun to celebrate Sage's birthday.",
    x: 59.4,
    y: 61.9,
  },
  {
    number: 10,
    location: "Hawaii (Kauai)",
    story: "Camping in a rooftop tent under the stars of Kauai.",
    x: 14.8,
    y: 80.6,
  },
  {
    number: 11,
    location: "Greece",
    story: "Island hopping. The trip that made Paris feel inevitable.",
    x: 42.5,
    y: 81.6,
  },
  {
    number: 12,
    location: "Paris",
    story:
      "Juanpa proposed in front of the real Eiffel Tower. The ring had been in his jacket pocket the whole time \u2014 the same jacket Sage had borrowed because she got cold.",
    x: 73.7,
    y: 76.8,
  },
];

export default function JourneyMap() {
  const [selectedStop, setSelectedStop] = useState<JourneyStop | null>(null);

  return (
    <>
      <div className="relative w-full min-w-[900px] max-w-[1493px]">
        <Image
          src="/images/our-journey-map.png"
          alt="Watercolor illustrated map of Sage and Juanpa's journey through El Salvador, Arizona, Mexico, Italy, Switzerland, Turkey, Colombia, Texas, California, Hawaii, Greece, and Paris."
          width={1493}
          height={1054}
          priority
          sizes="100vw"
          className="block h-auto w-full select-none"
        />

        {stops.map((stop) => (
          <button
            key={stop.number}
            type="button"
            aria-label={`Read more about ${stop.location}`}
            title={stop.location}
            onClick={() => setSelectedStop(stop)}
            className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#b9823d]/70 bg-[#fff8eb]/95 text-[0.78rem] font-semibold leading-none text-[#8b5b1f] shadow-[0_2px_8px_rgba(91,60,23,0.2)] transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c48b43] focus:ring-offset-2 focus:ring-offset-[#fbf1e3]"
            style={{
              left: `${stop.x}%`,
              top: `${stop.y}%`,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-cormorant), Georgia, serif",
            }}
          >
            {stop.number}
          </button>
        ))}
      </div>

      {selectedStop && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2b2118]/35 px-5 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="journey-stop-title"
          onClick={() => setSelectedStop(null)}
        >
          <div
            className="relative w-full max-w-md border border-[#d9bd94] bg-[#fff8eb] px-7 py-6 text-center shadow-[0_18px_50px_rgba(54,36,20,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close story"
              onClick={() => setSelectedStop(null)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-[#8b5b1f] transition hover:bg-[#f0dfc5] focus:outline-none focus:ring-2 focus:ring-[#c48b43]"
            >
              x
            </button>

            <p
              className="mb-2 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{
                color: "var(--color-heading-olive)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
              }}
            >
              Stop {selectedStop.number}
            </p>
            <h2
              id="journey-stop-title"
              className="font-script"
              style={{
                color: "var(--color-heading-rose)",
                fontSize: "clamp(2.1rem, 6vw, 3rem)",
                lineHeight: 1.05,
              }}
            >
              {selectedStop.location}
            </h2>
            <p
              className="mt-5 text-[1.05rem] leading-7"
              style={{
                color: "var(--color-body)",
                fontFamily: "var(--font-cormorant), Georgia, serif",
              }}
            >
              {selectedStop.story}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
