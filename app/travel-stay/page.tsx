import type { Metadata } from "next";

export const metadata: Metadata = { title: "Travel & Stay" };

// ─── CONFIG — edit all details below ─────────────────────
const AIRPORT = {
  name: "Airport Name (CODE)",
  distance: "XX km (XX miles) from City Center",
  travelTime: "~XX minutes",
  visaNote: "Visa is/is not required for stays under XX days.",
  arrivalRecommendation:
    "We recommend arriving by [Day], as official wedding events begin [Day] morning.",
};

const HOTELS = [
  {
    name: "Hotel Name 1",
    address: "123 Street Name, City",
    phone: "+1 (555) 000-0000",
    reserveLink: "#", // replace with actual booking URL or code instructions
  },
  {
    name: "Hotel Name 2",
    address: "456 Avenue, City",
    phone: "+1 (555) 000-0001",
    reserveLink: "#",
  },
  {
    name: "Hotel Name 3",
    address: "789 Boulevard, City",
    phone: "+1 (555) 000-0002",
    reserveLink: "#",
  },
];

const TRANSPORT_SERVICES = [
  {
    name: "Transport Company 1",
    phone: "+1 (555) 100-0000",
    email: "contact@company1.com",
    instagram: "@company1handle",
  },
  {
    name: "Transport Company 2",
    phone: "+1 (555) 100-0001",
    email: "contact@company2.com",
    instagram: "@company2handle",
  },
];

const PLANNING_CONTACT = "+1 (555) 200-0000";
// ─────────────────────────────────────────────────────────

export default function TravelStayPage() {
  return (
    <div
      className="min-h-screen py-16"
      style={{ backgroundColor: "var(--color-bg-white)" }}
    >
      <h1 className="page-heading" style={{ color: "var(--color-heading-rose)" }}>
        Travel &amp; Stay
      </h1>

      <div className="max-w-3xl mx-auto px-6 space-y-16">

        {/* ── Flight Info ── */}
        <section className="text-center">
          {/* Replace with watercolor image: <Image src="/images/travel-icon.png" ... /> */}
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: "var(--color-muted)", borderStyle: "dashed" }}
          >
            <span style={{ color: "var(--color-muted)", fontSize: "0.7rem" }}>Icon</span>
          </div>
          <h2 className="section-heading">Flight Information</h2>
          <p className="section-subheading mb-4">{AIRPORT.name}</p>
          <p style={{ color: "var(--color-body)" }}>
            {AIRPORT.distance} — average travel time {AIRPORT.travelTime}.{" "}
            {AIRPORT.visaNote}
          </p>
          <p className="mt-3" style={{ color: "var(--color-body)" }}>
            {AIRPORT.arrivalRecommendation}
          </p>
        </section>

        <hr className="divider" />

        {/* ── Hotels ── */}
        <section>
          <h2 className="section-heading mb-8">Hotel Information</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {HOTELS.map((hotel) => (
              <div
                key={hotel.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              >
                <h3
                  className="font-script text-2xl mb-1"
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

        <hr className="divider" />

        {/* ── Private Transport ── */}
        <section>
          <h2 className="section-heading mb-4">Private Transportation Services</h2>
          <p
            className="text-center mb-8"
            style={{ color: "var(--color-body)" }}
          >
            You'll find taxis and rideshare services available on arrival. For
            something pre-arranged, we recommend the trusted services below.
          </p>
          <div className="grid gap-8 sm:grid-cols-2">
            {TRANSPORT_SERVICES.map((svc) => (
              <div
                key={svc.name}
                className="info-card border rounded-sm"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-bg)",
                }}
              >
                <h3
                  className="font-script text-2xl mb-2"
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

        <hr className="divider" />

        {/* ── Travel Planning ── */}
        <section className="text-center pb-8">
          <h2 className="section-heading mb-4">Travel Planning Services</h2>
          <p style={{ color: "var(--color-body)" }}>
            Please contact our wedding planning team at{" "}
            <strong>{PLANNING_CONTACT}</strong> for any help with flight
            questions, transportation, tours, or anything else you need.
          </p>
        </section>
      </div>
    </div>
  );
}
