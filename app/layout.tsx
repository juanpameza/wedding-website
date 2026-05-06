import type { Metadata } from "next";
import { Great_Vibes, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// ─── Google Fonts ──────────────────────────────────────────
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

// ─── Metadata — edit these ────────────────────────────────
export const metadata: Metadata = {
  title: {
    template: "%s | Partner A & Partner B",
    default: "Partner A & Partner B",
  },
  description: "Join us to celebrate our wedding!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${greatVibes.variable} ${cormorant.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
