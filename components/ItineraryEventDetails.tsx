"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export type ItineraryEvent = {
  name: string;
  time: string;
  description?: string | null;
  image?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  details?: string | null;
};

type Props = {
  event: ItineraryEvent;
  /** alignment wrapper class for the trigger button */
  alignClass?: string;
};

export default function ItineraryEventDetails({ event, alignClass }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className={alignClass}>
        <button
          type="button"
          className="btn-outline"
          onClick={() => setOpen(true)}
        >
          View More Details
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2b2118]/35 px-5 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="itinerary-event-title"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto border border-[#d9bd94] bg-[#fff8eb] px-7 py-6 text-center shadow-[0_18px_50px_rgba(54,36,20,0.25)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close details"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-[#8b5b1f] transition hover:bg-[#f0dfc5] focus:outline-none focus:ring-2 focus:ring-[#c48b43]"
            >
              x
            </button>

            {event.image && (
              <Image
                src={event.image}
                alt={event.name}
                width={event.imageWidth ?? 380}
                height={event.imageHeight ?? 333}
                className="mx-auto mb-5 h-auto w-[70%] max-w-[260px] rounded-lg object-contain"
              />
            )}

            <h2
              id="itinerary-event-title"
              className="card-heading"
              style={{ color: "var(--color-heading-rose)", lineHeight: 1.05 }}
            >
              {event.name}
            </h2>

            <p
              className="mt-2 text-sm font-semibold uppercase tracking-[0.16em]"
              style={{
                color: "var(--color-heading-olive)",
                fontFamily: "var(--font-body), Georgia, serif",
              }}
            >
              {event.time}
            </p>

            {event.description && (
              <p
                className="mt-1 text-[1.02rem]"
                style={{
                  color: "var(--color-body)",
                  fontFamily: "var(--font-body), Georgia, serif",
                }}
              >
                {event.description}
              </p>
            )}

            {event.details && (
              <p
                className="mt-5 text-[1.05rem] leading-7"
                style={{
                  color: "var(--color-body)",
                  fontFamily: "var(--font-body), Georgia, serif",
                }}
              >
                {event.details}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
