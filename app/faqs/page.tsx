import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQs" };

// ─── CONFIG ───────────────────────────────────────────────
const FAQS = [
  {
    question: "What airport should I fly into?",
    answer:
      "Please fly into El Salvador International Airport — Saint Óscar Arnulfo Romero y Galdámez, airport code SAL. The airport is located outside San Salvador and is about 1 hour from the city, depending on traffic.",
  },
  {
    question: "How do I get from the airport to San Salvador?",
    answer:
      "We recommend arranging transportation in advance through your hotel, a trusted airport transfer service, or a private driver. Juanpa and I would also be happy to help coordinate transportation to and from the airport, so please reach out to us before your trip if you would like help.",
  },
  {
    question: "Do U.S. citizens need a visa to enter El Salvador?",
    answer:
      "U.S. citizens traveling for tourism do not need a visa for stays under 90 days. You will need a valid U.S. passport with at least one blank page.",
  },
  {
    question: "Where should I stay?",
    answer:
      "We recommend staying either near Cajamarca / the San Salvador Volcano area for convenience to the wedding location, or in San Salvador near Basílica de Guadalupe if you prefer to be closer to the city. Please see our hotel recommendations above.",
  },
  {
    question: "Is El Salvador safe to visit?",
    answer:
      "El Salvador has become an increasingly popular travel destination, and guests will find a warm and welcoming atmosphere. As with any international trip, we recommend using common travel precautions: arrange rides in advance, keep valuables secure, avoid walking alone late at night, and stay aware of your surroundings.",
  },
  {
    question: "What is the weather like?",
    answer:
      "San Salvador is generally warm year-round. The volcano area can feel cooler in the evening, so we recommend bringing a light jacket or wrap, especially for nighttime events.",
  },
  {
    question: "What should I pack?",
    answer:
      "We recommend packing comfortable clothes for exploring, dressy attire for wedding events, sunscreen, sunglasses, bug spray, comfortable walking shoes, and a light jacket for cooler evenings near the volcano.",
  },
  {
    question: "What currency is used in El Salvador?",
    answer:
      "El Salvador uses the U.S. dollar, so guests traveling from the U.S. do not need to exchange currency. Credit cards are accepted in many places, but it is helpful to carry some cash for smaller purchases, tips, markets, or local vendors.",
  },
  {
    question: "Can I drink the tap water?",
    answer:
      "We recommend drinking bottled or filtered water during your stay.",
  },
  {
    question: "What language is spoken?",
    answer:
      "Spanish is the official language of El Salvador. Many hotels, restaurants, and tourist areas may have English-speaking staff, but it is helpful to know a few basic Spanish phrases.",
  },
  {
    question: "Who should I contact with travel questions?",
    answer:
      "Please feel free to reach out to Juanpa or me with any travel questions. We are happy to help with hotel suggestions, transportation coordination, and tips for making the most of your time in El Salvador.",
  },
];
// ─────────────────────────────────────────────────────────

export default function FAQsPage() {
  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">FAQs</h1>

      <div className="max-w-2xl mx-auto pb-16">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex items-center justify-between">
              {faq.question}
              {/* Chevron icon */}
              <span
                className="ml-4 transition-transform group-open:rotate-180 flex-shrink-0"
                style={{ color: "var(--color-heading-rose)" }}
              >
                ▾
              </span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
