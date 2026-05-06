"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Home",          href: "/" },
  { label: "Itinerary",     href: "/itinerary" },
  { label: "Travel & Stay", href: "/travel-stay" },
  { label: "Hair & Makeup", href: "/hair-makeup" },
  { label: "Things To Do",  href: "/things-to-do" },
  { label: "Gallery",       href: "/gallery" },
  { label: "Registry",      href: "/registry" },
  { label: "FAQs",          href: "/faqs" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky top-0 z-50 flex flex-wrap items-center justify-center"
      style={{ backgroundColor: "transparent" }}
    >
      <ul className="flex flex-wrap justify-center">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className="nav-link"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-nav)",
                        color: "#fff",
                      }
                    : {
                        color: "var(--color-nav)",
                      }
                }
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
