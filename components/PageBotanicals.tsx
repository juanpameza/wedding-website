"use client";

import { usePathname } from "next/navigation";
import BotanicalAccent from "./BotanicalAccent";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";

/**
 * Per-page corner framing. Two different blooms (top-right + bottom-left),
 * anchored INSIDE <main> via an absolute inset-0 layer so they live in the
 * page's margins and never overlap the footer. The layer clips its own
 * overflow so bleeding stems don't create horizontal scroll. Hidden on small
 * screens to keep the mobile layout airy, and on the Keystatic admin.
 */
// Routes that opt out of the corner accents entirely.
const NO_BOTANICALS = ["/our-journey"];

export default function PageBotanicals() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/keystatic")) return null;
  if (NO_BOTANICALS.includes(pathname)) return null;

  const offset = pageFlowerOffset(pathname);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block"
    >
      <BotanicalAccent
        src={flowerByIndex(offset)}
        corner="top-right"
        width={300}
        opacity={0.55}
        className="-mr-12 -mt-2"
      />
      <BotanicalAccent
        src={flowerByIndex(offset + 2)}
        corner="bottom-left"
        width={300}
        opacity={0.55}
        flip
        className="-mb-2 -ml-12"
      />
    </div>
  );
}
