import Image from "next/image";
import { FLOWER_RATIO } from "@/lib/flowers";

type Props = {
  src: string;
  /** rendered width of the bloom in px */
  size?: number;
  className?: string;
};

/**
 * A small centered bloom flanked by thin hairlines — a watercolor-suite
 * section divider / heading flourish. Ornamental, so it's aria-hidden.
 */
export default function FlowerDivider({ src, size = 58, className = "" }: Props) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-5 my-10 ${className}`}
    >
      <span
        className="h-px w-16 sm:w-24"
        style={{ backgroundColor: "var(--color-border)" }}
      />
      <Image
        src={src}
        alt=""
        width={size}
        height={Math.round(size * FLOWER_RATIO)}
        sizes={`${size}px`}
        style={{ width: size, height: "auto" }}
        className="select-none"
      />
      <span
        className="h-px w-16 sm:w-24"
        style={{ backgroundColor: "var(--color-border)" }}
      />
    </div>
  );
}
