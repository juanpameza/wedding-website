"use client";

import { usePathname } from "next/navigation";
import BotanicalAccent from "./BotanicalAccent";
import { pageFlowerSrc } from "@/lib/flowers";

/**
 * Per-page corner framing. A fixed, low-opacity pair of the page's signature
 * bloom in opposite corners, bleeding off-edge. Hidden on small screens so the
 * mobile layout stays airy, and on the Keystatic admin.
 */
export default function PageBotanicals() {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/keystatic")) return null;

  const flower = pageFlowerSrc(pathname);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] hidden md:block"
    >
      <BotanicalAccent
        src={flower}
        corner="top-right"
        width={280}
        opacity={0.5}
        className="-mt-8 -mr-12"
      />
      <BotanicalAccent
        src={flower}
        corner="bottom-left"
        width={280}
        opacity={0.5}
        flip
        className="-mb-8 -ml-12"
      />
    </div>
  );
}
