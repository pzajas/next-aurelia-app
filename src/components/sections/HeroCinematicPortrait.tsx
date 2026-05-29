"use client";

import {
  HERO_BREATH,
  HERO_BREATH_SCALE,
  HERO_FILTER_REST,
  HERO_FILTER_SETTLE_IN,
  HERO_IMAGE_ENTRANCE,
  HERO_IMAGE_SCALE_FROM,
  HERO_TAP,
  HERO_TONAL,
  HERO_TONAL_FILTER,
} from "@/lib/hero-motion";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type HeroCinematicPortraitProps = {
  src: string;
  alt: string;
  reveal: boolean;
  onLoad?: () => void;
  className?: string;
  sizes?: string;
};

export default function HeroCinematicPortrait({
  src,
  alt,
  reveal,
  onLoad,
  className,
  sizes = "(max-width: 1200px) 100vw, 1200px",
}: HeroCinematicPortraitProps) {
  const reduced = Boolean(useReducedMotion());
  const [ambient, setAmbient] = useState(false);

  const hidden = reduced
    ? { opacity: 0 }
    : {
        opacity: 0,
        scale: HERO_IMAGE_SCALE_FROM,
        filter: HERO_FILTER_SETTLE_IN,
      };

  const shown = reduced
    ? { opacity: 1 }
    : {
        opacity: 1,
        scale: 1,
        filter: HERO_FILTER_REST,
      };

  return (
    <motion.div
      className="absolute inset-0 touch-manipulation will-change-[transform,filter,opacity]"
      initial={hidden}
      animate={reveal ? shown : hidden}
      transition={
        reduced ? { duration: 0.25 } : HERO_IMAGE_ENTRANCE
      }
      onAnimationComplete={() => {
        if (reveal && !reduced) setAmbient(true);
      }}
      whileTap={reduced || !reveal ? undefined : HERO_TAP}
      style={{ transformOrigin: "center 42%" }}
    >
      <motion.div
        className="absolute inset-0 will-change-[transform,filter]"
        style={{ transformOrigin: "center 42%" }}
        animate={
          ambient && !reduced
            ? {
                scale: HERO_BREATH_SCALE,
                filter: HERO_TONAL_FILTER,
              }
            : { scale: 1, filter: HERO_FILTER_REST }
        }
        transition={
          ambient && !reduced
            ? {
                scale: HERO_BREATH.transition,
                filter: HERO_TONAL.transition,
              }
            : undefined
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={80}
          className={className}
          sizes={sizes}
          onLoad={onLoad}
        />
      </motion.div>
    </motion.div>
  );
}
