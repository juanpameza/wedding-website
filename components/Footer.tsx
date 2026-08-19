import Link from "next/link";
import siteContent from "@/content/site.json";
import { navLinks } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Each name is an unbreakable unit so narrow screens wrap between
          name / & / name — never in the middle of a name. */}
      <p className="footer-names">
        <span className="whitespace-nowrap">{siteContent.coupleNameA}</span>{" "}
        &amp;{" "}
        <span className="whitespace-nowrap">{siteContent.coupleNameB}</span>
      </p>
      <p className="footer-detail">
        {siteContent.weddingDate} &middot; {siteContent.weddingLocation}
      </p>
      <nav aria-label="Footer">
        <ul className="footer-nav">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link href={href} className="footer-nav-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
