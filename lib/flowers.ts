// Watercolor botanical illustrations (transparent PNGs in /public/images).
// Intrinsic size of every stem is 3536 x 5000 (portrait, ratio ~0.7072).

export const FLOWER_RATIO = 5000 / 3536; // height / width

export const FLOWERS = {
  amaranthus: "/images/Amaranthus.png",
  anthurium: "/images/Anthurium_.png",
  escabiosa: "/images/Escabiosa.png",
  lisianthus: "/images/Lisianthus.png",
  pinkGinger: "/images/Pink_Ginger.png",
  ranunculus: "/images/Ranunculus.png",
} as const;

export type FlowerKey = keyof typeof FLOWERS;

// Stable ordered list of every bloom — used to rotate flowers so a page shows
// a variety rather than repeating one.
export const FLOWER_SRCS: string[] = Object.values(FLOWERS);

/** Flower at a position in the rotation, wrapping around (handles negatives). */
export function flowerByIndex(index: number): string {
  const len = FLOWER_SRCS.length;
  return FLOWER_SRCS[((index % len) + len) % len];
}

// Signature bloom per page. Each route gets one flower so the suite feels
// designed rather than random. Edit a single line here to reassign a page.
export const PAGE_FLOWER: Record<string, FlowerKey> = {
  "/": "amaranthus",
  "/our-journey": "ranunculus",
  "/itinerary": "lisianthus",
  "/travel-stay": "pinkGinger",
  "/hair-makeup": "escabiosa",
  "/things-to-do": "anthurium",
  "/gallery": "ranunculus",
  "/registry": "lisianthus",
  "/faqs": "escabiosa",
};

const DEFAULT_FLOWER: FlowerKey = "escabiosa";
const FLOWER_KEYS = Object.keys(FLOWERS) as FlowerKey[];

export function pageFlowerSrc(pathname: string): string {
  const key = PAGE_FLOWER[pathname] ?? DEFAULT_FLOWER;
  return FLOWERS[key];
}

/**
 * Where a page starts in the flower rotation. Seeds in-page alternation from
 * the page's signature bloom so each page cycles through a different sequence.
 */
export function pageFlowerOffset(pathname: string): number {
  const key = PAGE_FLOWER[pathname] ?? DEFAULT_FLOWER;
  return Math.max(0, FLOWER_KEYS.indexOf(key));
}
