import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import Image from "next/image";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import siteContent from "@/content/site.json";
import homeContent from "@/content/home.json";

const FL = pageFlowerOffset("/");

export const metadata: Metadata = { title: "Home" };

const logoMaxWidth = homeContent.logoMaxWidth ?? 448;
const logoPadding = homeContent.logoPadding ?? 24;

export default function HomePage() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* ── Hero monogram ── */}
      <div className="flex items-center justify-center w-full py-8">
        {homeContent.logoImage ? (
          <div
            className="w-full mx-6"
            style={{ maxWidth: logoMaxWidth, padding: logoPadding }}
          >
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
            className="flex items-center justify-center w-full mx-6 rounded-lg border-2 border-dashed"
            style={{
              aspectRatio: "1343/1600",
              maxWidth: logoMaxWidth,
              padding: logoPadding,
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
      <div className="flex flex-col items-center gap-2 px-6 pb-4">
        <h1
          className="home-name-text leading-none"
          style={{ color: "var(--color-heading-rose)" }}
        >
          {siteContent.coupleNameA}
        </h1>

        <span
          className="home-ampersand leading-none"
          style={{ color: "var(--color-muted)" }}
        >
          &amp;
        </span>

        <h1
          className="home-name-text leading-none"
          style={{ color: "var(--color-heading-rose)" }}
        >
          {siteContent.coupleNameB}
        </h1>
      </div>

      {/* ── Date & location ── */}
      <div className="text-center pb-4">
        <p
          className="home-detail"
          style={{
            color: "var(--color-heading-rose)",
          }}
        >
          {siteContent.weddingDate}
        </p>
        <p
          className="home-detail"
          style={{
            color: "var(--color-heading-rose)",
          }}
        >
          {siteContent.weddingLocation}
        </p>
      </div>

      {/* ── Countdown ── */}
      <PageCountdown page="home" />

      <FlowerDivider src={flowerByIndex(FL + 1)} className="w-full max-w-md" />

      {/* ── Welcome message ── */}
      <div
        className="max-w-2xl text-center px-8 pb-8 pt-4"
        style={{ color: "var(--color-body)" }}
      >
        <p className="card-heading mb-2">
          {homeContent.welcomeHeading}
        </p>
        <p>{homeContent.welcomeBody}</p>
      </div>
    </div>
  );
}
