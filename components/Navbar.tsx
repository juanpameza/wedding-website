"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Home",          href: "/" },
  { label: "Our Journey",   href: "/our-journey" },
  { label: "Itinerary",     href: "/itinerary" },
  { label: "Travel & Stay", href: "/travel-stay" },
  { label: "Hair & Makeup", href: "/hair-makeup" },
  { label: "Things To Do",  href: "/things-to-do" },
  { label: "Gallery",       href: "/gallery" },
  { label: "Registry",      href: "/registry" },
  { label: "RSVP",          href: "/rsvp" },
  { label: "FAQs",          href: "/faqs" },
];

export default function Navbar({ monogram = "S & J" }: { monogram?: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  return (
    <nav className="nav-bar sticky top-0 z-50">
      {/* Mobile bar: monogram + hamburger */}
      <div className="flex items-center justify-between px-5 py-3 md:hidden">
        <Link href="/" className="nav-monogram" onClick={() => setOpen(false)}>
          {monogram}
        </Link>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`nav-toggle-icon${open ? " open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Desktop links */}
      <ul className="hidden flex-wrap justify-center md:flex">
        {links.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Mobile full-screen menu */}
      <div
        id="mobile-menu"
        className={`nav-mobile-menu md:hidden${open ? " open" : ""}`}
      >
        <ul className="flex flex-col items-center gap-1">
          {links.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`nav-link nav-link-mobile${isActive ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? undefined : -1}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
