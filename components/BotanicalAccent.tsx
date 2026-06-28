import Image from "next/image";
import { FLOWER_RATIO } from "@/lib/flowers";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const CORNER_POS: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "bottom-right": "bottom-0 right-0",
};

type Props = {
  src: string;
  corner?: Corner;
  /** rendered width in px */
  width?: number;
  opacity?: number;
  /** mirror horizontally */
  flip?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Decorative watercolor stem anchored to a corner of its nearest positioned
 * ancestor. Purely ornamental: aria-hidden + pointer-events-none so it never
 * interferes with screen readers or clicks.
 */
export default function BotanicalAccent({
  src,
  corner = "top-right",
  width = 240,
  opacity = 0.55,
  flip = false,
  className = "",
  style,
}: Props) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute select-none ${CORNER_POS[corner]} ${className}`}
      style={{ opacity, ...style }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={Math.round(width * FLOWER_RATIO)}
        sizes={`${width}px`}
        style={{
          width,
          height: "auto",
          transform: flip ? "scaleX(-1)" : undefined,
        }}
      />
    </div>
  );
}
