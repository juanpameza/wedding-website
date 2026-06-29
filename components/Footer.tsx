import siteContent from "@/content/site.json";
import BotanicalAccent from "./BotanicalAccent";
import { FLOWERS } from "@/lib/flowers";

export default function Footer() {
  return (
    <footer className="site-footer relative overflow-hidden">
      <BotanicalAccent
        src={FLOWERS.pinkGinger}
        corner="bottom-left"
        width={200}
        opacity={0.75}
        className="-ml-6 hidden sm:block"
      />
      <BotanicalAccent
        src={FLOWERS.ranunculus}
        corner="bottom-right"
        width={200}
        opacity={0.75}
        flip
        className="-mr-6 hidden sm:block"
      />

      <div className="relative z-10">
        <p className="footer-names">
          {siteContent.coupleNameA} &amp; {siteContent.coupleNameB}
        </p>
        <p className="footer-detail">
          {siteContent.weddingDate} &middot; {siteContent.weddingLocation}
        </p>
      </div>
    </footer>
  );
}
