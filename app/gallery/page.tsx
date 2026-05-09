import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import galleryContentRaw from "@/content/gallery.json";

type GalleryImage = { src: string | null; alt: string };
const galleryContent = galleryContentRaw as { images: GalleryImage[] };

export const metadata: Metadata = { title: "Gallery" };

const GALLERY_DIR = path.join(process.cwd(), "public", "images", "gallery");
const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

async function getFilesystemImages() {
  try {
    const files = await readdir(GALLERY_DIR, { withFileTypes: true });
    return files
      .filter((file) => file.isFile())
      .map((file) => file.name)
      .filter((fileName) =>
        IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()),
      )
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((fileName) => ({
        src: `/images/gallery/${fileName}`,
        alt: path.parse(fileName).name.replace(/[-_]/g, " "),
      }));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  // Use Keystatic-managed images if any have been added via the CMS,
  // otherwise fall back to all files in the gallery folder
  const cmsImages = galleryContent.images
    .filter((img) => img.src)
    .map((img) => ({ src: img.src as string, alt: img.alt || "" }));

  const images =
    cmsImages.length > 0 ? cmsImages : await getFilesystemImages();

  return (
    <div
      className="min-h-screen py-16 px-6"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <h1 className="page-heading">Gallery</h1>

      <div className="mx-auto max-w-6xl pb-16">
        {images.length > 0 ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {images.map((image) => (
              <figure
                key={image.src}
                className="mb-5 break-inside-avoid overflow-hidden rounded-lg"
                style={{ backgroundColor: "var(--color-bg-white)" }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="h-auto w-full transition-transform duration-300 hover:scale-[1.02]"
                />
              </figure>
            ))}
          </div>
        ) : (
          <p
            className="mx-auto max-w-2xl text-center"
            style={{ color: "var(--color-body)" }}
          >
            Photos coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
