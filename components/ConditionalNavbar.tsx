"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar({ monogram }: { monogram?: string }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/keystatic")) return null;
  return <Navbar monogram={monogram} />;
}
