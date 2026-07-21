import { config, fields, singleton } from "@keystatic/core";
import { colorField } from "@/lib/keystatic-color-field";
import {
  DEFAULT_TYPOGRAPHY,
  FONT_SELECT_OPTIONS,
  TYPOGRAPHY_FONT_SELECT_OPTIONS,
  type TypographyRole,
} from "@/lib/site-style";

function typographyField(
  label: string,
  role: TypographyRole,
  description?: string,
) {
  const defaults = DEFAULT_TYPOGRAPHY[role];

  return fields.object(
    {
      fontFamily: fields.select({
        label: "Font",
        options: TYPOGRAPHY_FONT_SELECT_OPTIONS,
        defaultValue: defaults.fontFamily,
      }),
      fontSize: fields.number({
        label: "Size (px)",
        defaultValue: defaults.fontSize,
        step: 1,
        validation: { min: 8, max: 180 },
      }),
      bold: fields.checkbox({
        label: "Bold",
        defaultValue: defaults.bold,
      }),
      italic: fields.checkbox({
        label: "Italic",
        defaultValue: defaults.italic,
      }),
    },
    { label, description, layout: [6, 6, 6, 6] },
  );
}

function imageLayoutFields(defaultWidth: number, defaultHeight?: number) {
  return {
    imageWidth: fields.number({
      label: "Image Width (px)",
      defaultValue: defaultWidth,
      step: 1,
      validation: { min: 80, max: 1600 },
    }),
    ...(defaultHeight
      ? {
          imageHeight: fields.number({
            label: "Image Height (px)",
            defaultValue: defaultHeight,
            step: 1,
            validation: { min: 80, max: 1600 },
          }),
        }
      : {}),
    imagePadding: fields.number({
      label: "Image Padding (px)",
      defaultValue: 0,
      step: 1,
      validation: { min: 0, max: 160 },
    }),
  };
}

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
          description: "Default for headings and decorative text",
          options: FONT_SELECT_OPTIONS,
          defaultValue: "Great Vibes",
        }),
        bodyFont: fields.select({
          label: "Body Font",
          description: "Default for paragraphs, nav, and buttons",
          options: FONT_SELECT_OPTIONS,
          defaultValue: "Cormorant Garamond",
        }),
        baseFontSize: fields.number({
          label: "Base Font Size (px)",
          description: "Scales all text proportionally. Default is 16.",
          defaultValue: 16,
          validation: { min: 13, max: 22 },
        }),
        typography: fields.object(
          {
            homeNames: typographyField("Home Names", "homeNames"),
            homeAmpersand: typographyField("Home Ampersand", "homeAmpersand"),
            homeDetails: typographyField("Home Date & Location", "homeDetails"),
            pageHeading: typographyField("Page Headings", "pageHeading"),
            sectionHeading: typographyField("Section Headings", "sectionHeading"),
            sectionSubheading: typographyField("Subheadings / Eyebrows", "sectionSubheading"),
            cardHeading: typographyField("Card Headings", "cardHeading"),
            bodyText: typographyField("Body Text", "bodyText"),
            nav: typographyField("Navigation", "nav"),
            button: typographyField("Buttons", "button"),
            countdownNumber: typographyField("Countdown Numbers", "countdownNumber"),
            countdownLabel: typographyField("Countdown Labels", "countdownLabel"),
          },
          {
            label: "Detailed Typography",
            description: "Override font, size, bold, and italic settings for specific parts of the site.",
          },
        ),
        countdownVisibility: fields.object(
          {
            home: fields.checkbox({ label: "Home", defaultValue: true }),
            journey: fields.checkbox({ label: "Our Journey", defaultValue: false }),
            itinerary: fields.checkbox({ label: "Itinerary", defaultValue: false }),
            travel: fields.checkbox({ label: "Travel & Stay", defaultValue: false }),
            hairMakeup: fields.checkbox({ label: "Hair & Makeup", defaultValue: false }),
            thingsToDo: fields.checkbox({ label: "Things To Do", defaultValue: false }),
            gallery: fields.checkbox({ label: "Gallery", defaultValue: false }),
            registry: fields.checkbox({ label: "Registry", defaultValue: false }),
            faqs: fields.checkbox({ label: "FAQs", defaultValue: false }),
          },
          {
            label: "Countdown Visibility",
            description: "Choose which pages show the wedding countdown.",
            layout: [4, 4, 4, 4, 4, 4, 4, 4, 4],
          },
        ),
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
        logoMaxWidth: fields.number({
          label: "Logo Width (px)",
          defaultValue: 448,
          step: 1,
          validation: { min: 120, max: 1200 },
        }),
        logoPadding: fields.number({
          label: "Logo Padding (px)",
          defaultValue: 24,
          step: 1,
          validation: { min: 0, max: 160 },
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
                ...imageLayoutFields(256, 224),
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
        airportLat: fields.number({
          label: "Airport Latitude",
          description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
          validation: { min: -90, max: 90 },
        }),
        airportLng: fields.number({
          label: "Airport Longitude",
          description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
          validation: { min: -180, max: 180 },
        }),
        airportVisaNote: fields.text({ label: "Visa Note", description: "e.g., U.S. citizens do not need a visa." }),
        airportArrivalRecommendation: fields.text({ multiline: true, label: "Arrival Recommendation" }),
        planningContact: fields.text({ label: "Planning Contact Phone / Email" }),
        venue: fields.object(
          {
            name: fields.text({ label: "Venue Name" }),
            note: fields.text({ label: "Note", description: "Shown in the map popup, e.g. Wedding reception venue" }),
            lat: fields.number({
              label: "Latitude",
              description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
              validation: { min: -90, max: 90 },
            }),
            lng: fields.number({
              label: "Longitude",
              description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
              validation: { min: -180, max: 180 },
            }),
          },
          {
            label: "Wedding Venue Map Pin",
            description: "Shown on the hotel map with a distinct green pin",
          }
        ),
        hotels: fields.array(
          fields.object({
            name: fields.text({ label: "Hotel Name" }),
            address: fields.text({ label: "Address" }),
            phone: fields.text({ label: "Phone" }),
            reserveLink: fields.text({ label: "Booking URL or Promo Code Instructions" }),
            lat: fields.number({
              label: "Latitude",
              description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
              validation: { min: -90, max: 90 },
            }),
            lng: fields.number({
              label: "Longitude",
              description: "Map pin position — right-click the spot in Google Maps to copy coordinates",
              validation: { min: -180, max: 180 },
            }),
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
            phone: fields.text({ label: "Phone / WhatsApp" }),
            email: fields.text({ label: "Email" }),
            instagram: fields.text({ label: "Instagram Handle" }),
            location: fields.text({
              label: "Location",
              description: "Address or area — used for the Google Maps link",
            }),
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
                driveTime: fields.text({
                  label: "Approx. Drive Time",
                  description: "e.g., ~1.5–2 hrs — shown as a subtitle",
                }),
                note: fields.text({ label: "Short Note" }),
                whereToEat: fields.text({
                  label: "Where to Eat",
                  description: "Restaurant recommendation shown below the note",
                }),
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
        mapMaxWidth: fields.number({
          label: "Map Width (px)",
          defaultValue: 1493,
          step: 1,
          validation: { min: 600, max: 2400 },
        }),
        mapPadding: fields.number({
          label: "Map Padding (px)",
          defaultValue: 0,
          step: 1,
          validation: { min: 0, max: 180 },
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
            imageWidthPercent: fields.number({
              label: "Display Width (%)",
              defaultValue: 100,
              step: 1,
              validation: { min: 25, max: 100 },
            }),
            imagePadding: fields.number({
              label: "Image Padding (px)",
              defaultValue: 0,
              step: 1,
              validation: { min: 0, max: 120 },
            }),
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
