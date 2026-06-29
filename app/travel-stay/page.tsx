import type { Metadata } from "next";
import PageCountdown from "@/components/PageCountdown";
import FlowerDivider from "@/components/FlowerDivider";
import { flowerByIndex, pageFlowerOffset } from "@/lib/flowers";
import travelContent from "@/content/travel.json";

const FL = pageFlowerOffset("/travel-stay");

export const metadata: Metadata = { title: "Travel & Stay" };

export default function TravelStayPage() {
  const {
    airportName,
    airportDistance,
    airportTravelTime,
    airportVisaNote,
    airportArrivalRecommendation,
    planningContact,
    hotels,
    transportServices,
  } = travelContent;

  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      <h1 className="page-heading" style={{ color: "var(--color-heading-rose)" }}>
        Travel &amp; Stay
      </h1>
      <FlowerDivider src={flowerByIndex(FL + 1)} />
      <PageCountdown page="travel" />

      <div className="max-w-3xl mx-auto px-6 space-y-16">

        {/* ── Flight Info ── */}
        <section className="text-center">
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: "var(--color-muted)", borderStyle: "dashed" }}
          >
            <span style={{ color: "var(--color-muted)", fontSize: "0.7rem" }}>Icon</span>
          </div>
          <h2 className="section-heading">Flight Information</h2>
          <p className="section-subheading mb-4">{airportName}</p>
          <p style={{ color: "var(--color-body)" }}>
            {airportDistance} — average travel time {airportTravelTime}.{" "}
            {airportVisaNote}
          </p>
          <p className="mt-3" style={{ color: "var(--color-body)" }}>
            {airportArrivalRecommendation}
          </p>
        </section>

        <FlowerDivider src={flowerByIndex(FL + 2)} />

        {/* ── Hotels ── */}
        <section>
          <h2 className="section-heading mb-8">Hotel Information</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <div
                key={hotel.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              >
                <h3
                  className="card-heading mb-1"
                  style={{ color: "var(--color-heading-rose)" }}
                >
                  {hotel.name}
                </h3>
                <p
                  className="text-sm mb-1"
                  style={{ color: "var(--color-body)" }}
                >
                  {hotel.address}
                </p>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-body)" }}
                >
                  Phone: {hotel.phone}
                </p>
                <a href={hotel.reserveLink} className="btn-outline text-sm">
                  Reserve With Our Code
                </a>
              </div>
            ))}
          </div>
        </section>

        <FlowerDivider src={flowerByIndex(FL + 3)} />

        {/* ── Private Transport ── */}
        <section>
          <h2 className="section-heading mb-4">Private Transportation Services</h2>
          <p
            className="text-center mb-8"
            style={{ color: "var(--color-body)" }}
          >
            You&apos;ll find taxis and rideshare services available on arrival. For
            something pre-arranged, we recommend the trusted services below.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {transportServices.map((svc) => (
              <div
                key={svc.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              >
                <h3
                  className="card-heading mb-2"
                  style={{ color: "var(--color-heading-olive)" }}
                >
                  {svc.name}
                </h3>
                <p className="text-sm" style={{ color: "var(--color-body)" }}>
                  Phone: {svc.phone}
                </p>
                <p className="text-sm" style={{ color: "var(--color-body)" }}>
                  Email:{" "}
                  <a href={`mailto:${svc.email}`} className="underline">
                    {svc.email}
                  </a>
                </p>
                <p className="text-sm" style={{ color: "var(--color-body)" }}>
                  Instagram: {svc.instagram}
                </p>
              </div>
            ))}
          </div>
        </section>

        <FlowerDivider src={flowerByIndex(FL + 4)} />

        {/* ── Travel Planning ── */}
        <section className="text-center pb-8">
          <h2 className="section-heading mb-4">Travel Planning Services</h2>
          <p style={{ color: "var(--color-body)" }}>
            Please contact our wedding planning team at{" "}
            <strong>{planningContact}</strong> for any help with flight
            questions, transportation, tours, or anything else you need.
          </p>
        </section>
      </div>
    </div>
  );
}
