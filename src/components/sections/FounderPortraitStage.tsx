"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

export type FounderPortraitStageProps = {
  activeKey: string;
  imageSrc: string;
  imageAlt: string;
  revealClip: MotionValue<string>;
  imageParallaxY: MotionValue<string>;
  entered: boolean;
  transitioning: boolean;
  priority?: boolean;
  fetchPriority?: "high" | "auto" | "low" | "auto";
  loading?: "eager" | "lazy";
  sizes?: string;
  quality?: number;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  imageStyle?: CSSProperties;
  grainClassName?: string;
  imageOffsetX?: number;
  children?: ReactNode;
};

export default function FounderPortraitStage({
  activeKey,
  imageSrc,
  imageAlt,
  revealClip,
  imageParallaxY,
  entered,
  transitioning,
  priority,
  fetchPriority,
  loading = "lazy",
  sizes = "(max-width: 768px) 120vw, (max-width: 1200px) 100vw, 1400px",
  quality = 82,
  className,
  imageClassName,
  objectPosition,
  imageStyle,
  grainClassName,
  imageOffsetX,
  children,
}: FounderPortraitStageProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={{ y: imageParallaxY }}>
        {children}

        <motion.div
          className="absolute inset-0"
          style={imageOffsetX !== undefined ? { x: imageOffsetX } : undefined}
        >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: entered ? revealClip : "inset(0% 0% 100% 0%)",
          }}
          animate={
            reducedMotion ? { scale: 1 } : { scale: [1, 1.02, 1] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 14,
                  repeat: Infinity,
                  ease: easeLuxury,
                }
          }
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={activeKey}
              className="absolute inset-0"
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority={priority}
                fetchPriority={fetchPriority}
                loading={loading}
                quality={quality}
                className={cn("object-cover grayscale", imageClassName)}
                style={{
                  objectPosition,
                  ...imageStyle,
                }}
                sizes={sizes}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        </motion.div>
      </motion.div>

      <div
        className={cn(
          "founder-mobile-grain pointer-events-none absolute inset-0 z-[4]",
          transitioning ? "opacity-[0.055]" : "opacity-[0.032]",
          grainClassName
        )}
        aria-hidden
      />
    </div>
  );
}

export function useFounderPortraitMotion(
  scrollYProgress: MotionValue<number>
) {
  const revealProgress = useTransform(scrollYProgress, [0.08, 0.42], [0, 1]);
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], ["3%", "-2%"]);
  const revealClip = useTransform(
    revealProgress,
    [0, 1],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );
  return {
    revealProgress,
    imageParallaxY,
    revealClip,
  };
}
