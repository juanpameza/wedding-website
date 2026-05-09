import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import fs from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

function getSiteContent() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf-8"));
}

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteContent();
  return {
    title: { template: `%s | ${site.siteTitle}`, default: site.siteTitle },
    description: `Join us to celebrate the wedding of ${site.coupleNameA} & ${site.coupleNameB}.`,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  noStore();
  const siteContent = getSiteContent();
  const cssVars = {
    "--color-bg": siteContent.colorBg,
    "--color-bg-white": siteContent.colorBgWhite,
    "--color-nav": siteContent.colorNav,
    "--color-nav-text": siteContent.colorNavText,
    "--color-heading-rose": siteContent.colorHeadingRose,
    "--color-heading-olive": siteContent.colorHeadingOlive,
    "--color-body": siteContent.colorBody,
    "--color-muted": siteContent.colorMuted,
    "--color-border": siteContent.colorBorder,
    "--color-btn-border": siteContent.colorHeadingRose,
  } as React.CSSProperties;

  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${cormorant.variable}`}
      style={cssVars}
    >
      <body>
        <ConditionalNavbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
