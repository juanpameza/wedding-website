import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import fs from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";

function getSiteContent() {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/site.json"), "utf-8"));
}

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

  const displayFontParam = (siteContent.displayFont ?? "Great Vibes").replace(/ /g, "+");
  const bodyFontParam = (siteContent.bodyFont ?? "Cormorant Garamond").replace(/ /g, "+");
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${displayFontParam}&family=${bodyFontParam}:ital,wght@0,300;0,400;0,500;0,600;0,700&display=swap`;

  const cssVars = {
    "--font-display": `"${siteContent.displayFont ?? "Great Vibes"}", cursive`,
    "--font-body": `"${siteContent.bodyFont ?? "Cormorant Garamond"}", Georgia, serif`,
    "--font-size-base": `${siteContent.baseFontSize ?? 16}px`,
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
    <html lang="en" style={cssVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
      </head>
      <body>
        <ConditionalNavbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
