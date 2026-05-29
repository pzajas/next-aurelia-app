"use client";

import {
  GALLERY_FILTER_REST,
  GALLERY_IMAGE_HOLD,
  GALLERY_IMAGE_TAP,
  GALLERY_MOBILE,
  galleryImageTransition,
  galleryQuoteTransition,
} from "@/lib/gallery-motion";
import { lookupMedia } from "@/lib/media";
import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type GalleryTile = {
  id: string;
  src: string;
  altIndex: number;
  objectPosition: string;
  priority?: boolean;
};

type LightboxPayload = {
  src: string;
  width: number;
  height: number;
  alt: string;
  objectPosition: string;
};

const inViewOptions = {
  once: true,
  amount: GALLERY_MOBILE.inViewAmount,
  margin: GALLERY_MOBILE.inViewMargin,
} as const;

function MobilePhotoTile({
  tile,
  alt,
  onOpen,
}: {
  tile: GalleryTile;
  alt: string;
  onOpen: (item: LightboxPayload) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, inViewOptions);
  const reduced = Boolean(useReducedMotion());

  const hold = reduced
    ? { opacity: 1, scale: 1, filter: GALLERY_FILTER_REST }
    : GALLERY_IMAGE_HOLD;
  const shown = {
    opacity: 1,
    scale: 1,
    filter: GALLERY_FILTER_REST,
  };

  const open = () => {
    const asset = lookupMedia(tile.src);
    onOpen({
      src: asset.src,
      width: asset.width,
      height: asset.height,
      alt,
      objectPosition: tile.objectPosition,
    });
  };

  return (
    <motion.button
      type="button"
      onClick={open}
      whileTap={reduced || !inView ? undefined : GALLERY_IMAGE_TAP}
      className="relative block w-full overflow-hidden bg-[#0a0a0a] touch-manipulation"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <motion.div
        ref={ref}
        className="relative aspect-[4/5] will-change-[transform,filter,opacity]"
        style={{ transformOrigin: "center 42%" }}
        initial={false}
        animate={inView ? shown : hold}
        transition={
          inView ? galleryImageTransition(reduced) : { duration: 0 }
        }
      >
        <Image
          src={tile.src}
          alt={alt}
          fill
          quality={80}
          loading={tile.priority ? "eager" : "lazy"}
          priority={tile.priority}
          className="object-cover"
          style={{ objectPosition: tile.objectPosition }}
            sizes="(max-width: 768px) 100vw, 640px"
        />
      </motion.div>
    </motion.button>
  );
}

function MobileQuote({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, inViewOptions);
  const reduced = Boolean(useReducedMotion());

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={galleryQuoteTransition(reduced)}
      className="bg-[#0a0a0a] px-5 py-8 text-center will-change-[transform,opacity]"
    >
      <p className="font-serif text-[clamp(1.5rem,7.2vw,2rem)] italic leading-[1.5] text-white/88">
        {line1}
        <br />
        {line2}
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.24 } : { opacity: 0 }}
        transition={{
          ...galleryQuoteTransition(reduced),
          delay: reduced ? 0 : 0.28,
        }}
        className="mx-auto mt-3 h-px w-8 bg-white"
        aria-hidden
      />
    </motion.div>
  );
}

type GalleryMobileFeedProps = {
  tiles: GalleryTile[];
  quoteLine1: string;
  quoteLine2: string;
  getAlt: (altIndex: number) => string;
  onOpen: (item: LightboxPayload) => void;
};

export default function GalleryMobileFeed({
  tiles,
  quoteLine1,
  quoteLine2,
  getAlt,
  onOpen,
}: GalleryMobileFeedProps) {
  const firstGroup = tiles.slice(0, 3);
  const secondGroup = tiles.slice(3);

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {firstGroup.map((tile) => (
        <MobilePhotoTile
          key={tile.id}
          tile={tile}
          alt={getAlt(tile.altIndex)}
          onOpen={onOpen}
        />
      ))}

      <MobileQuote line1={quoteLine1} line2={quoteLine2} />

      {secondGroup.map((tile) => (
        <MobilePhotoTile
          key={tile.id}
          tile={tile}
          alt={getAlt(tile.altIndex)}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
