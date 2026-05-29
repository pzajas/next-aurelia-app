"use client";

import { HERO_IMAGE_QUALITY, HERO_MOBILE_SIZES } from "@/lib/hero-image-preload";
import {
  HERO_BREATH,
  HERO_BREATH_SCALE,
  HERO_FILTER_REST,
  HERO_FILTER_SETTLE_IN,
  HERO_IMAGE_ENTRANCE,
  HERO_IMAGE_HOLD,
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
  visible: boolean;
  reveal: boolean;
  onLoad?: () => void;
  className?: string;
  sizes?: string;
};

export default function HeroCinematicPortrait({
  src,
  alt,
  visible,
  reveal,
  onLoad,
  className,
  sizes = HERO_MOBILE_SIZES,
}: HeroCinematicPortraitProps) {
  const reduced = Boolean(useReducedMotion());
  const [ambient, setAmbient] = useState(false);

  const hidden = reduced
    ? { opacity: 0, scale: 1, filter: HERO_FILTER_REST }
    : {
        opacity: 0,
        scale: HERO_IMAGE_SCALE_FROM,
        filter: HERO_FILTER_SETTLE_IN,
      };

  const hold = reduced
    ? { opacity: 1, scale: 1, filter: HERO_FILTER_REST }
    : HERO_IMAGE_HOLD;

  const shown = reduced
    ? { opacity: 1, scale: 1, filter: HERO_FILTER_REST }
    : {
        opacity: 1,
        scale: 1,
        filter: HERO_FILTER_REST,
      };

  const motionState = !visible ? hidden : reveal ? shown : hold;

  return (
    <motion.div
      className="absolute inset-0 touch-manipulation will-change-[transform,filter,opacity]"
      initial={false}
      animate={motionState}
      transition={
        reduced
          ? { duration: 0.25 }
          : reveal
            ? HERO_IMAGE_ENTRANCE
            : { duration: 0 }
      }
      onAnimationComplete={() => {
        if (reveal && visible && !reduced) setAmbient(true);
      }}
      whileTap={reduced || !visible || !reveal ? undefined : HERO_TAP}
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
          quality={HERO_IMAGE_QUALITY}
          className={className}
          sizes={sizes}
          onLoad={onLoad}
        />
      </motion.div>
    </motion.div>
  );
}
