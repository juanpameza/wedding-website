// Fails the build if an oversized image lands in public/images.
//
// Why: Vercel's image optimizer bills a cache write for every variant it
// generates, and output size scales with the source. In Oct 2026 the
// original 5-17 MB PNGs in this folder burned ~89K of the Hobby plan's
// 100K monthly write units. Keystatic writes CMS uploads straight into
// public/images at full size, so this guard catches the next re-upload.
//
// Fix: resize to <=1200px on the long edge and export as WebP (~100-400 KB).
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images");
const LIMIT_BYTES = 1 * 1024 * 1024; // 1 MB

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

const files = await walk(ROOT).catch(() => []);
const offenders = [];
for (const file of files) {
  const { size } = await stat(file);
  if (size > LIMIT_BYTES) {
    offenders.push({ file: path.relative(process.cwd(), file), size });
  }
}

if (offenders.length > 0) {
  console.error(
    `\nx ${offenders.length} image(s) in public/images exceed ${LIMIT_BYTES / 1024 / 1024} MB:\n`,
  );
  for (const { file, size } of offenders) {
    console.error(`  ${(size / 1024 / 1024).toFixed(1).padStart(6)} MB  ${file}`);
  }
  console.error(
    "\nResize to <=1200px and export as WebP before committing (see scripts/check-image-sizes.mjs).\n",
  );
  process.exit(1);
}

console.log(
  `ok: ${files.length} image(s) in public/images are all under ${LIMIT_BYTES / 1024 / 1024} MB`,
);
