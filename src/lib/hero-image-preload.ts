/** URLs matching `next/image` output for preload hints. */

export const HERO_IMAGE_QUALITY = 75;

export const HERO_MOBILE_SIZES =
  "(max-width: 480px) 100vw, (max-width: 768px) 460px, 725px";

export function nextOptimizedImageUrl(
  src: string,
  width: number,
  quality = HERO_IMAGE_QUALITY,
) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
}

/** Preload srcset aligned with `deviceSizes` + mobile hero `sizes`. */
export function heroPreloadSrcSet(src: string, quality = HERO_IMAGE_QUALITY) {
  const widths = [480, 640, 750] as const;
  return widths
    .map((w) => `${nextOptimizedImageUrl(src, w, quality)} ${w}w`)
    .join(", ");
}
