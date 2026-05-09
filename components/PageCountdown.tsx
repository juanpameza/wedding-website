import siteContent from "@/content/site.json";
import { shouldShowCountdown, type CountdownPageKey } from "@/lib/site-style";
import Countdown from "./Countdown";

type Props = {
  page: CountdownPageKey;
};

export default function PageCountdown({ page }: Props) {
  if (!shouldShowCountdown(siteContent, page)) return null;
  return <Countdown targetDate={siteContent.weddingDateTime} />;
}
