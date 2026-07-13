import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import RsvpClient from "./RsvpClient";

const FL = pageFlowerOffset("/rsvp");

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">RSVP</h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="faqs" />

      <p
        className="max-w-xl mx-auto text-center mb-10"
        style={{ color: "var(--color-body)" }}
      >
        Find your name to let us know which celebrations you&rsquo;ll join us for.
        You can RSVP for everyone in your party.
      </p>

      <RsvpClient />
    </div>
  );
}
