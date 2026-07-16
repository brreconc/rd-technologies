import { OG_ALT, OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

// Twitter/X reutiliza el mismo diseño 1200×630 (card summary_large_image).
export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TwitterImage() {
  return renderOgImage();
}
