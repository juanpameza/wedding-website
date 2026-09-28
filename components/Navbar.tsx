"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isNavGroup, navItems, navLinks, type NavGroup } from "@/lib/nav-links";

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

      {/* Desktop links — py keeps the active pill clear of the bar's edges */}
      <ul className="hidden flex-wrap justify-center py-1.5 md:flex">
        {navItems.map((item) =>
          isNavGroup(item) ? (
            <NavDropdown key={item.label} group={item} pathname={pathname} />
          ) : (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`nav-link${pathname === item.href ? " active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>

      {/* Mobile full-screen menu — a flat list; the dropdown grouping only
          exists to keep the horizontal desktop bar short */}
      <div
        id="mobile-menu"
        className={`nav-mobile-menu md:hidden${open ? " open" : ""}`}
      >
        <ul className="flex flex-col items-center gap-1">
          {navLinks.map(({ label, href }) => {
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

/**
 * Desktop dropdown for a nav group. Opens on mouse hover or on click/Enter
 * (touch and keyboard), closes on Escape, outside pointer-down, focus leaving
 * the group, or navigation. Uses the disclosure pattern (button + list of
 * links) rather than ARIA menu roles, so no arrow-key handling is required.
 */
function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isActive = group.links.some((link) => link.href === pathname);
  const menuId = `nav-menu-${group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <li
      ref={rootRef}
      className="nav-dropdown"
      data-open={open}
      // Hover only for a real mouse: on touch the emulated mouseenter would
      // open the menu and the following click would immediately close it.
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        className={`nav-link nav-dropdown-toggle${isActive ? " active" : ""}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        {group.label}
        <svg
          className="nav-dropdown-caret"
          viewBox="0 0 10 6"
          aria-hidden="true"
        >
          <path
            d="M1 1l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <ul id={menuId} className="nav-dropdown-menu">
        {group.links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className={`nav-link nav-dropdown-link${pathname === href ? " active" : ""}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
