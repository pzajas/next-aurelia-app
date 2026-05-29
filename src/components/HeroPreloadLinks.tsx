import {
  HERO_IMAGE_QUALITY,
  HERO_MOBILE_SIZES,
  heroPreloadSrcSet,
  nextOptimizedImageUrl,
} from "@/lib/hero-image-preload";
import { media } from "@/lib/media";

/** Preload the same optimized URLs `next/image` requests (not raw `/public` paths). */
export default function HeroPreloadLinks() {
  const src = media.hero.src;
  const href = nextOptimizedImageUrl(src, 480, HERO_IMAGE_QUALITY);
  const imageSrcSet = heroPreloadSrcSet(src, HERO_IMAGE_QUALITY);

  return (
    <link
      rel="preload"
      as="image"
      href={href}
      imageSrcSet={imageSrcSet}
      imageSizes={HERO_MOBILE_SIZES}
      fetchPriority="high"
    />
  );
}
