import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Home" };

// ─── CONFIG — edit everything below ──────────────────────
const COUPLE = {
  partnerA: { first: "Sage", last: "Nye" },
  partnerB: { first: "Juanpa", last: "Meza" },
};
const DATE = "March 13th, 2027";
const LOCATION = "San Salvador, El Salvadir";
const WELCOME_HEADING = "Welcome to San Salvador!";
const WELCOME_BODY =
  "We're so happy and grateful to have you in our lives. It means so much to us that you're joining us for this special moment. We can't wait to celebrate with you!";
// ─────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Hero monogram placeholder ── */}
      <div className="flex items-center justify-center w-full py-16">
        <Image
          src="/images/save-the-date.jpeg"
          alt="Save the date for Sage and Juanpa"
          width={1343}
          height={1600}
          priority
          className="h-auto w-full max-w-md px-6"
        />
      </div>

      {/* ── Names ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 pb-4 sm:gap-8">
        <div className="text-right">
          <h1
            className="font-script leading-none"
            style={{
              fontSize: "clamp(2.3rem, 7vw, 4.6rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {COUPLE.partnerA.first}
          </h1>
          <p
            className="font-script leading-none mt-2"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {COUPLE.partnerA.last}
          </p>
        </div>

        <span
          className="font-script leading-none"
          style={{
            fontSize: "clamp(4rem, 12vw, 8rem)",
            color: "var(--color-muted)",
          }}
        >
          &amp;
        </span>

        <div className="text-left">
          <h1
            className="font-script leading-none"
            style={{
              fontSize: "clamp(2.3rem, 7vw, 4.6rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {COUPLE.partnerB.first}
          </h1>
          <p
            className="font-script leading-none mt-2"
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {COUPLE.partnerB.last}
          </p>
        </div>
      </div>

      {/* ── Date & location ── */}
      <div className="text-center pb-4">
        <p
          className="font-script"
          style={{
            fontSize: "clamp(1.2rem, 3vw, 1.9rem)",
            color: "var(--color-muted)",
          }}
        >
          {DATE}
        </p>
        <p
          className="font-script"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            color: "var(--color-muted)",
          }}
        >
          {LOCATION}
        </p>
      </div>

      {/* ── Welcome message ── */}
      <div
        className="max-w-2xl text-center px-8 pb-24 pt-8"
        style={{ color: "var(--color-body)" }}
      >
        <p className="font-semibold mb-2" style={{ fontFamily: "inherit" }}>
          {WELCOME_HEADING}
        </p>
        <p>{WELCOME_BODY}</p>
      </div>
    </div>
  );
}
