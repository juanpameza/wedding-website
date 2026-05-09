import type { Metadata } from "next";
import Countdown from "@/components/Countdown";
import Image from "next/image";
import siteContent from "@/content/site.json";
import homeContent from "@/content/home.json";

export const metadata: Metadata = { title: "Home" };

const [partnerAFirst, ...partnerARest] = siteContent.coupleNameA.split(" ");
const partnerALast = partnerARest.join(" ");
const [partnerBFirst, ...partnerBRest] = siteContent.coupleNameB.split(" ");
const partnerBLast = partnerBRest.join(" ");

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Hero monogram ── */}
      <div className="flex items-center justify-center w-full py-16">
        {homeContent.logoImage ? (
          <div className="w-full max-w-md mx-6">
            <Image
              src={homeContent.logoImage}
              alt="Wedding logo"
              width={1343}
              height={1600}
              className="w-full h-auto rounded-lg"
              priority
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center w-full max-w-md mx-6 rounded-lg border-2 border-dashed"
            style={{
              aspectRatio: "1343/1600",
              borderColor: "var(--color-muted)",
              backgroundColor: "var(--color-bg-white)",
            }}
          >
            <span style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
              MN Logo
            </span>
          </div>
        )}
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
            {partnerAFirst}
          </h1>
          <p
            className="font-script leading-none mt-2"
            style={{
              fontSize: "clamp(2.3rem, 7vw, 4.6rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {partnerALast}
          </p>
        </div>

        <span
          className="font-script leading-none"
          style={{
            fontSize: "clamp(8rem, 12vw, 8rem)",
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
            {partnerBFirst}
          </h1>
          <p
            className="font-script leading-none mt-2"
            style={{
              fontSize: "clamp(2.3rem, 7vw, 4.6rem)",
              color: "var(--color-heading-rose)",
            }}
          >
            {partnerBLast}
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
          {siteContent.weddingDate}
        </p>
        <p
          className="font-script"
          style={{
            fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
            color: "var(--color-muted)",
          }}
        >
          {siteContent.weddingLocation}
        </p>
      </div>

      {/* ── Countdown ── */}
      <Countdown targetDate={siteContent.weddingDateTime} />

      {/* ── Welcome message ── */}
      <div
        className="max-w-2xl text-center px-8 pb-8 pt-4"
        style={{ color: "var(--color-body)" }}
      >
        <p className="font-semibold mb-2" style={{ fontFamily: "inherit" }}>
          {homeContent.welcomeHeading}
        </p>
        <p>{homeContent.welcomeBody}</p>
      </div>
    </div>
  );
}
