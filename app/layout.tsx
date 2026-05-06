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
    template: "%s | Sage & Juanpa",
    default: "Sage & Juanpa | March 13, 2027",
  },
  description:
    "Join us to celebrate the wedding of Sage & Juanpa in San Salvador, El Salvador.",
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
