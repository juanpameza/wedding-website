import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import ConditionalFooter from "@/components/ConditionalFooter";
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
  const home = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/home.json"), "utf-8"));
  // Keystatic renames the uploaded file to match the field name, so follow
  // whatever the home logo currently points at instead of hardcoding it.
  const icon = home.logoImage ?? "/images/logoImage.png";
  return {
    title: { template: `%s | ${site.siteTitle}`, default: site.siteTitle },
    description: `Join us to celebrate the wedding of ${site.coupleNameA} & ${site.coupleNameB}.`,
    icons: {
      icon,
      apple: icon,
    },
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
        <ConditionalNavbar
          monogram={`${siteContent.coupleNameA?.charAt(0) ?? ""} & ${siteContent.coupleNameB?.charAt(0) ?? ""}`}
        />
        <main className="relative min-h-screen">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
