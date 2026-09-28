export type NavLink = { label: string; href: string };
export type NavGroup = { label: string; links: NavLink[] };
export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "links" in item;
}

// Top-level structure of the navbar. A group renders as a dropdown on desktop;
// the mobile overlay and the footer show every page as a flat list.
export const navItems: NavItem[] = [
  { label: "Home",        href: "/" },
  { label: "Our Journey", href: "/our-journey" },
  {
    label: "Guest Info",
    links: [
      { label: "Itinerary",     href: "/itinerary" },
      { label: "Travel & Stay", href: "/travel-stay" },
      { label: "Hair & Makeup", href: "/hair-makeup" },
      { label: "Things To Do",  href: "/things-to-do" },
    ],
  },
  { label: "Music",       href: "/music" },
  { label: "Gallery",     href: "/gallery" },
  { label: "Registry",    href: "/registry" },
  { label: "RSVP",        href: "/rsvp" },
  { label: "FAQs",        href: "/faqs" },
];

/** Every page link in nav order with groups flattened. */
export const navLinks: NavLink[] = navItems.flatMap((item) =>
  isNavGroup(item) ? item.links : [item],
);
