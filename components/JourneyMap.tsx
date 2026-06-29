"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const round1 = (n: number) => Math.round(n * 10) / 10;

export type JourneyStop = {
  location: string;
  story: string;
  image?: string | null;
  /** per-stop size multiplier applied on top of stopImageWidth (default 1) */
  imageScale?: number | null;
  x: number;
  y: number;
};

type Props = {
  stops: JourneyStop[];
  mapImage?: string | null;
  mapMaxWidth?: number | null;
  mapPadding?: number | null;
  mapAspectRatio?: string | null;
  stopImageWidth?: number | null;
};

export default function JourneyMap({
  stops,
  mapImage,
  mapMaxWidth = 1493,
  mapPadding = 0,
  mapAspectRatio = "1493/1054",
  stopImageWidth = 200,
}: Props) {
  const stopWidth = stopImageWidth ?? 200;
  const frameAspectRatio = mapAspectRatio ?? "1493/1054";
  const [selectedStop, setSelectedStop] = useState<(JourneyStop & { number: number }) | null>(null);

  // ── Drag-to-position editor (opt-in via ?edit=1) ──────────────
  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState(() =>
    stops.map((s) => ({ x: s.x, y: s.y })),
  );
  const [copied, setCopied] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEditMode(params.get("edit") === "1");
  }, []);

  function pointToPercent(clientX: number, clientY: number) {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    return {
      x: round1(Math.max(0, Math.min(100, x))),
      y: round1(Math.max(0, Math.min(100, y))),
    };
  }

  function handlePointerMove(event: React.PointerEvent, index: number) {
    if (draggingRef.current !== index) return;
    const next = pointToPercent(event.clientX, event.clientY);
    if (!next) return;
    setPositions((prev) =>
      prev.map((pos, i) => (i === index ? next : pos)),
    );
  }

  async function copyUpdatedJson() {
    const updatedStops = stops.map((s, i) => ({
      ...s,
      x: positions[i].x,
      y: positions[i].y,
    }));
    const full = {
      mapImage: mapImage ?? null,
      mapMaxWidth,
      mapPadding,
      mapAspectRatio,
      stopImageWidth,
      stops: updatedStops,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(full, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div
        className="w-full min-w-[900px]"
        style={{ maxWidth: mapMaxWidth ?? 1493, padding: mapPadding ?? 0 }}
      >
        <div ref={frameRef} className="relative w-full">
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
              className="w-full select-none rounded-xl"
              style={{
                aspectRatio: frameAspectRatio,
                backgroundColor: "#f3e8d1",
                backgroundImage:
                  "radial-gradient(115% 80% at 50% 0%, rgba(255,251,242,0.75), rgba(243,232,209,0) 60%), radial-gradient(120% 90% at 50% 100%, rgba(196,160,93,0.12), rgba(243,232,209,0) 55%)",
                boxShadow: "inset 0 0 70px rgba(150,120,70,0.13)",
                border: "1px solid rgba(133,111,69,0.28)",
              }}
            />
          )}

          {stops.map((stop, index) => {
            const width = Math.round(stopWidth * (stop.imageScale ?? 1));
            const pos = editMode ? positions[index] : { x: stop.x, y: stop.y };

            return (
              <button
                key={index}
                type="button"
                aria-label={`Read more about ${stop.location}`}
                title={stop.location}
                onClick={() => {
                  if (!editMode) setSelectedStop({ ...stop, number: index + 1 });
                }}
                onPointerDown={(event) => {
                  if (!editMode) return;
                  event.preventDefault();
                  draggingRef.current = index;
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => handlePointerMove(event, index)}
                onPointerUp={(event) => {
                  if (draggingRef.current === index) draggingRef.current = null;
                  event.currentTarget.releasePointerCapture?.(event.pointerId);
                }}
                className={`group absolute z-10 transition focus:outline-none ${
                  editMode
                    ? "cursor-move ring-2 ring-[#c48b43]/60 hover:z-30"
                    : "hover:z-20 hover:scale-105"
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: stop.image ? width : undefined,
                  transform: "translate(-50%, -50%)",
                  touchAction: editMode ? "none" : undefined,
                }}
              >
                {stop.image && (
                  <Image
                    src={stop.image}
                    alt={stop.location}
                    width={width}
                    height={Math.round(width * 1.2)}
                    className="pointer-events-none block h-auto select-none"
                    style={{ width, height: "auto" }}
                  />
                )}
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#b9823d]/70 bg-[#fff8eb]/95 text-[0.78rem] font-semibold leading-none text-[#8b5b1f] shadow-[0_2px_8px_rgba(91,60,23,0.2)] transition group-hover:bg-white ${
                    stop.image
                      ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      : ""
                  }`}
                  style={{ fontFamily: "var(--font-body), Georgia, serif" }}
                >
                  {index + 1}
                </span>
                {editMode && (
                  <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-[#2b2118]/80 px-1.5 py-0.5 text-[0.6rem] font-semibold leading-none text-white">
                    {pos.x}, {pos.y}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {editMode && (
        <div className="fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-3 rounded-full border border-[#d9bd94] bg-[#fff8eb] px-5 py-3 shadow-[0_10px_30px_rgba(54,36,20,0.25)]">
          <span
            className="text-sm"
            style={{
              color: "var(--color-body)",
              fontFamily: "var(--font-body), Georgia, serif",
            }}
          >
            Editing positions — drag the markers
          </span>
          <button
            type="button"
            onClick={copyUpdatedJson}
            className="rounded-full border border-[#b9823d] px-4 py-1.5 text-sm font-semibold text-[#8b5b1f] transition hover:bg-[#b9823d] hover:text-white"
            style={{ fontFamily: "var(--font-body), Georgia, serif" }}
          >
            {copied ? "Copied!" : "Copy updated journey.json"}
          </button>
        </div>
      )}

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
              className="card-heading"
              style={{
                color: "var(--color-heading-rose)",
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
