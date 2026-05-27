/** Static AVIF paths under `public/` — avoids Turbopack AVIF import warnings. */

export type MediaAsset = {
  src: string;
  width: number;
  height: number;
};

export const media = {
  hero: { src: "/images/hero333.avif", width: 935, height: 1683 },
  wow: { src: "/images/hero.avif", width: 923, height: 1703 },
  galleryHero: { src: "/images/gallery_big.avif", width: 1023, height: 1537 },
  galleryMergedPortraits: { src: "/images/gallery-merged-portraits.avif", width: 3072, height: 1024 },
  galleryMergedR1R2: { src: "/images/gallery-gen-r1r2-new.avif", width: 1536, height: 1024 },
  gallery: {
    1: { src: "/images/gallery-gen-model-1.avif", width: 1536, height: 1024 },
    2: { src: "/images/gallery-gen-nape.avif", width: 2048, height: 1365 },
    3: { src: "/images/gallery-gen-model-2.avif", width: 1536, height: 1024 },
    4: { src: "/images/gallery-gen-model-3.avif", width: 1536, height: 1024 },
    5: { src: "/images/gallery-gen-tools-1.avif", width: 2048, height: 3077 },
    6: { src: "/images/gallery-gen-wide-top.avif", width: 1536, height: 1024 },
    7: { src: "/images/gallery-gen-wide-bottom.avif", width: 2400, height: 1600 },
    8: { src: "/images/gallery-gen-arch-v7.avif", width: 1536, height: 1024 },
    9: { src: "/images/gallery-gen-macro.avif", width: 1536, height: 1024 },
    10: { src: "/images/gallery-gen-cutting-v1.avif", width: 1536, height: 1024 },
  },
  products: {
    1: { src: "/assets/product-1.avif", width: 896, height: 1280 },
    2: { src: "/assets/product-2.avif", width: 896, height: 1280 },
  },
  people: {
    person: { src: "/images/person.avif", width: 1100, height: 1430 },
    founder: { src: "/images/founder-ok.avif", width: 1536, height: 1024 },
    employee1: { src: "/images/founder-margaux.avif", width: 1536, height: 1024 },
    employee2: { src: "/images/founder-elias.avif", width: 1536, height: 1024 },
    employee3: { src: "/images/founder-amelie.avif", width: 1536, height: 1024 },
  },
} as const satisfies Record<string, MediaAsset | Record<string, MediaAsset>>;

const MEDIA_LIST: MediaAsset[] = [
  media.hero,
  media.wow,
  media.galleryHero,
  media.galleryMergedPortraits,
  media.galleryMergedR1R2,
  ...Object.values(media.gallery),
  ...Object.values(media.products),
  ...Object.values(media.people),
];

export function lookupMedia(src: string): MediaAsset {
  return (
    MEDIA_LIST.find((m) => m.src === src) ?? {
      src,
      width: 896,
      height: 1280,
    }
  );
}

export function mediaSrc(asset: MediaAsset): string {
  return asset.src;
}
