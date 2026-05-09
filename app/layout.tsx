import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import siteContent from "@/content/site.json";

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

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteContent.siteTitle}`,
    default: siteContent.siteTitle,
  },
  description: `Join us to celebrate the wedding of ${siteContent.coupleNameA} & ${siteContent.coupleNameB}.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
