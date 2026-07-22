import Link from "next/link";
import siteContent from "@/content/site.json";
import { navLinks } from "@/lib/nav-links";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-names">
        {siteContent.coupleNameA} &amp; {siteContent.coupleNameB}
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
