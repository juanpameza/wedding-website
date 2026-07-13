// Generate a print-ready QR code for the RSVP link.
//
//   npm run qr -- https://your-domain.com/rsvp
//
// Produces a vector SVG (use this for print — crisp at any size) and a large
// PNG (for screens / quick sharing) in ./qr.
//
// The code is STATIC: it encodes the URL directly, so it never expires and
// doesn't depend on any third-party service. Which also means the URL is baked
// in permanently — be sure it's the final one before you print anything.

import QRCode from "qrcode";
import { mkdir, writeFile } from "node:fs/promises";

const url = process.argv[2];

if (!url || !/^https?:\/\//.test(url)) {
  console.error("Usage: npm run qr -- https://your-domain.com/rsvp");
  process.exit(1);
}

// errorCorrectionLevel "H" recovers ~30% of the code, so it still scans if a
// corner is obscured, printed on texture, or has a small logo laid over it.
const options = {
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#000000", light: "#FFFFFF" }, // black on white scans most reliably
};

await mkdir("qr", { recursive: true });

const svg = await QRCode.toString(url, { ...options, type: "svg" });
await writeFile("qr/rsvp-qr.svg", svg);

await QRCode.toFile("qr/rsvp-qr.png", url, { ...options, width: 2048 });

console.log(`QR code for ${url}`);
console.log("  qr/rsvp-qr.svg  (vector — use for print)");
console.log("  qr/rsvp-qr.png  (2048px — use for screens)");
console.log("\nScan it with your phone before printing anything.");
