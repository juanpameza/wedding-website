import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
import PageBotanicals from "@/components/PageBotanicals";
import fs from "fs";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import {
  getFontStack,
  getGoogleFontsUrl,
  getTypographyCssVars,
} from "@/lib/site-style";

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

  const fontsUrl = getGoogleFontsUrl(siteContent);

  const cssVars = {
    "--font-display": getFontStack(siteContent.displayFont ?? "Great Vibes", "cursive"),
    "--font-body": getFontStack(siteContent.bodyFont ?? "Cormorant Garamond", "Georgia, serif"),
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
    ...getTypographyCssVars(siteContent),
  } as React.CSSProperties;

  return (
    <html lang="en" style={cssVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {fontsUrl && <link href={fontsUrl} rel="stylesheet" />}
      </head>
      <body>
        <ConditionalNavbar />
        <main className="relative min-h-screen">
          {children}
          <PageBotanicals />
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
