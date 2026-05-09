"use client";

import { useState } from "react";
import Image from "next/image";

export type JourneyStop = {
  location: string;
  story: string;
  x: number;
  y: number;
};

type Props = {
  stops: JourneyStop[];
  mapImage?: string | null;
};

export default function JourneyMap({ stops, mapImage }: Props) {
  const [selectedStop, setSelectedStop] = useState<(JourneyStop & { number: number }) | null>(null);

  return (
    <>
      <div className="relative w-full min-w-[900px] max-w-[1493px]">
        {mapImage ? (
          <Image
            src={mapImage}
            alt="Our Journey Map"
            width={1493}
            height={1054}
            className="w-full select-none"
            priority
          />
        ) : (
          <div
            className="block w-full select-none flex items-center justify-center border-2 border-dashed"
            style={{
              aspectRatio: "1493/1054",
              borderColor: "var(--color-muted)",
              backgroundColor: "var(--color-bg-white)",
            }}
          >
            <span style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
              Journey Map
            </span>
          </div>
        )}

        {stops.map((stop, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Read more about ${stop.location}`}
            title={stop.location}
            onClick={() => setSelectedStop({ ...stop, number: index + 1 })}
            className="absolute z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#b9823d]/70 bg-[#fff8eb]/95 text-[0.78rem] font-semibold leading-none text-[#8b5b1f] shadow-[0_2px_8px_rgba(91,60,23,0.2)] transition hover:scale-110 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#c48b43] focus:ring-offset-2 focus:ring-offset-[#fbf1e3]"
            style={{
              left: `${stop.x}%`,
              top: `${stop.y}%`,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-body), Georgia, serif",
            }}
          >
            {index + 1}
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
                fontFamily: "var(--font-body), Georgia, serif",
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
                fontFamily: "var(--font-body), Georgia, serif",
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
