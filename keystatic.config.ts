import { config, fields, singleton } from "@keystatic/core";
import { colorField } from "@/lib/keystatic-color-field";

export default config({
  storage:
    process.env.NEXT_PUBLIC_GITHUB_OWNER && process.env.NEXT_PUBLIC_GITHUB_REPO
      ? {
          kind: "github",
          repo: {
            owner: process.env.NEXT_PUBLIC_GITHUB_OWNER,
            name: process.env.NEXT_PUBLIC_GITHUB_REPO,
          },
        }
      : { kind: "local" },

  ui: {
    brand: { name: "Wedding CMS" },
    navigation: {
      "Site & Colors": ["site"],
      "Pages": ["home", "itinerary", "travel", "hairMakeup", "thingsToDo", "registry", "faqs"],
      "Media": ["gallery", "journey"],
    },
  },

  singletons: {
    site: singleton({
      label: "Site Settings & Colors",
      path: "content/site",
      format: { data: "json" },
      schema: {
        coupleNameA: fields.text({ label: "Partner A Full Name", description: "e.g., Sage Nye" }),
        coupleNameB: fields.text({ label: "Partner B Full Name", description: "e.g., Juanpa Meza" }),
        weddingDate: fields.text({ label: "Wedding Date (display)", description: "e.g., March 13th, 2027" }),
        weddingDateTime: fields.text({ label: "Countdown Date/Time (ISO 8601)", description: "e.g., 2027-03-13T21:00:00Z — this drives the countdown timer" }),
        weddingLocation: fields.text({ label: "Wedding Location", description: "e.g., San Salvador, El Salvador" }),
        siteTitle: fields.text({ label: "Browser Tab Title", description: "e.g., Sage & Juanpa | March 13, 2027" }),
        displayFont: fields.select({
          label: "Display / Script Font",
          description: "Used for headings and decorative text",
          options: [
            { label: "Great Vibes",      value: "Great Vibes" },
            { label: "Dancing Script",   value: "Dancing Script" },
            { label: "Parisienne",       value: "Parisienne" },
            { label: "Pinyon Script",    value: "Pinyon Script" },
            { label: "Sacramento",       value: "Sacramento" },
          ],
          defaultValue: "Great Vibes",
        }),
        bodyFont: fields.select({
          label: "Body Font",
          description: "Used for paragraphs, nav, and buttons",
          options: [
            { label: "Cormorant Garamond",  value: "Cormorant Garamond" },
            { label: "EB Garamond",         value: "EB Garamond" },
            { label: "Playfair Display",    value: "Playfair Display" },
            { label: "Lora",                value: "Lora" },
            { label: "Libre Baskerville",   value: "Libre Baskerville" },
          ],
          defaultValue: "Cormorant Garamond",
        }),
        baseFontSize: fields.number({
          label: "Base Font Size (px)",
          description: "Scales all text proportionally. Default is 16.",
          defaultValue: 16,
          validation: { min: 13, max: 22 },
        }),
        colorBg:           colorField("Background Color",       "Main page background"),
        colorBgWhite:      colorField("Section Background Color", "Secondary section backgrounds"),
        colorNav:          colorField("Navbar Background",        "Top navigation bar"),
        colorNavText:      colorField("Navbar Text Color",        "Text and icons in the navbar"),
        colorHeadingRose:  colorField("Primary Accent Color",     "Headings, body text, buttons"),
        colorHeadingOlive: colorField("Secondary Accent Color",   "Subheadings"),
        colorBody:         colorField("Body Text Color",          "General body copy"),
        colorMuted:        colorField("Muted / Soft Accent",      "Decorative and subtle accents"),
        colorBorder:       colorField("Border & Divider Color",   "Lines and dividers"),
      },
    }),

    home: singleton({
      label: "Home Page",
      path: "content/home",
      format: { data: "json" },
      schema: {
        welcomeHeading: fields.text({ label: "Welcome Heading" }),
        welcomeBody: fields.text({ multiline: true, label: "Welcome Message" }),
        logoImage: fields.image({
          label: "Logo / Monogram Image",
          description: "Displays at the top of the home page",
          directory: "public/images",
          publicPath: "/images/",
        }),
      },
    }),

    itinerary: singleton({
      label: "Itinerary",
      path: "content/itinerary",
      format: { data: "json" },
      schema: {
        days: fields.array(
          fields.object({
            date: fields.text({ label: "Date Heading", description: "e.g., Saturday, March 13, 2027" }),
            events: fields.array(
              fields.object({
                name: fields.text({ label: "Event Name" }),
                time: fields.text({ label: "Time", description: "e.g., 3:00 pm - 4:00 pm" }),
                description: fields.text({ multiline: true, label: "Location / Description" }),
                image: fields.image({
                  label: "Event Photo",
                  directory: "public/images/itinerary",
                  publicPath: "/images/itinerary/",
                }),
              }),
              {
                label: "Events",
                itemLabel: (props) => props.fields.name.value || "Event",
              }
            ),
          }),
          {
            label: "Days",
            itemLabel: (props) => props.fields.date.value || "Day",
          }
        ),
      },
    }),

    travel: singleton({
      label: "Travel & Stay",
      path: "content/travel",
      format: { data: "json" },
      schema: {
        airportName: fields.text({ label: "Airport Name & Code", description: "e.g., El Salvador International Airport (SAL)" }),
        airportDistance: fields.text({ label: "Distance from City", description: "e.g., 44 km from San Salvador" }),
        airportTravelTime: fields.text({ label: "Travel Time", description: "e.g., ~1 hour" }),
        airportVisaNote: fields.text({ label: "Visa Note", description: "e.g., U.S. citizens do not need a visa." }),
        airportArrivalRecommendation: fields.text({ multiline: true, label: "Arrival Recommendation" }),
        planningContact: fields.text({ label: "Planning Contact Phone / Email" }),
        hotels: fields.array(
          fields.object({
            name: fields.text({ label: "Hotel Name" }),
            address: fields.text({ label: "Address" }),
            phone: fields.text({ label: "Phone" }),
            reserveLink: fields.text({ label: "Booking URL or Promo Code Instructions" }),
          }),
          {
            label: "Hotel Recommendations",
            itemLabel: (props) => props.fields.name.value || "Hotel",
          }
        ),
        transportServices: fields.array(
          fields.object({
            name: fields.text({ label: "Company Name" }),
            phone: fields.text({ label: "Phone" }),
            email: fields.text({ label: "Email" }),
            instagram: fields.text({ label: "Instagram Handle" }),
          }),
          {
            label: "Transportation Services",
            itemLabel: (props) => props.fields.name.value || "Service",
          }
        ),
      },
    }),

    hairMakeup: singleton({
      label: "Hair & Makeup",
      path: "content/hair-makeup",
      format: { data: "json" },
      schema: {
        intro: fields.text({ multiline: true, label: "Introduction Text" }),
        stylists: fields.array(
          fields.object({
            name: fields.text({ label: "Stylist / Salon Name" }),
            role: fields.text({ label: "Role", description: "e.g., Hair & Makeup" }),
            note: fields.text({ multiline: true, label: "Booking Note" }),
            phone: fields.text({ label: "Phone" }),
            email: fields.text({ label: "Email" }),
            instagram: fields.text({ label: "Instagram Handle" }),
          }),
          {
            label: "Stylists",
            itemLabel: (props) => props.fields.name.value || "Stylist",
          }
        ),
        tips: fields.array(
          fields.object({
            tip: fields.text({ label: "Tip" }),
          }),
          {
            label: "Tips & Reminders",
            itemLabel: (props) => props.fields.tip.value || "Tip",
          }
        ),
      },
    }),

    thingsToDo: singleton({
      label: "Things To Do",
      path: "content/things-to-do",
      format: { data: "json" },
      schema: {
        intro: fields.text({ multiline: true, label: "Introduction Text" }),
        planningContact: fields.text({ label: "Planning Contact" }),
        categories: fields.array(
          fields.object({
            heading: fields.text({ label: "Category Heading", description: "e.g., Breakfast & Lunch Spots" }),
            items: fields.array(
              fields.object({
                name: fields.text({ label: "Place Name" }),
                note: fields.text({ label: "Short Note" }),
              }),
              {
                label: "Places",
                itemLabel: (props) => props.fields.name.value || "Place",
              }
            ),
          }),
          {
            label: "Categories",
            itemLabel: (props) => props.fields.heading.value || "Category",
          }
        ),
      },
    }),

    registry: singleton({
      label: "Registry",
      path: "content/registry",
      format: { data: "json" },
      schema: {
        intro: fields.text({ multiline: true, label: "Introduction Text" }),
        note: fields.text({ multiline: true, label: "Gift Note (shown at the bottom)" }),
        registries: fields.array(
          fields.object({
            name: fields.text({ label: "Registry Name" }),
            description: fields.text({ label: "Short Description" }),
            url: fields.text({ label: "Registry URL" }),
            buttonLabel: fields.text({ label: "Button Label", description: "e.g., View Registry" }),
          }),
          {
            label: "Registries",
            itemLabel: (props) => props.fields.name.value || "Registry",
          }
        ),
      },
    }),

    faqs: singleton({
      label: "FAQs",
      path: "content/faqs",
      format: { data: "json" },
      schema: {
        questions: fields.array(
          fields.object({
            question: fields.text({ label: "Question" }),
            answer: fields.text({ multiline: true, label: "Answer" }),
          }),
          {
            label: "Questions",
            itemLabel: (props) => props.fields.question.value || "Question",
          }
        ),
      },
    }),

    journey: singleton({
      label: "Our Journey Map",
      path: "content/journey",
      format: { data: "json" },
      schema: {
        mapImage: fields.image({
          label: "Map Image",
          description: "The background map image — stops are pinned on top of this",
          directory: "public/images",
          publicPath: "/images/",
        }),
        stops: fields.array(
          fields.object({
            location: fields.text({ label: "Location Name", description: "e.g., Paris" }),
            story: fields.text({ multiline: true, label: "Story" }),
            x: fields.number({ label: "X Position (% from left)", description: "0 = far left, 100 = far right" }),
            y: fields.number({ label: "Y Position (% from top)", description: "0 = top, 100 = bottom" }),
          }),
          {
            label: "Stops",
            itemLabel: (props) => props.fields.location.value || "Stop",
          }
        ),
      },
    }),

    gallery: singleton({
      label: "Gallery",
      path: "content/gallery",
      format: { data: "json" },
      schema: {
        images: fields.array(
          fields.object({
            src: fields.image({
              label: "Photo",
              directory: "public/images/gallery",
              publicPath: "/images/gallery/",
            }),
            alt: fields.text({ label: "Caption / Alt Text" }),
          }),
          {
            label: "Photos",
            itemLabel: (props) => props.fields.alt.value || "Photo",
          }
        ),
      },
    }),
  },
});
