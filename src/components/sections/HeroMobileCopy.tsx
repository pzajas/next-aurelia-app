"use client";

import { HERO_TEXT_DELAYS, heroTextTransition } from "@/lib/hero-motion";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type HeroMobileCopyProps = {
  reveal: boolean;
  edition: string;
  tagline: string;
  subtitle: string;
};

function HeroTextBlock({
  reveal,
  delay,
  y,
  className,
  children,
}: {
  reveal: boolean;
  delay: number;
  y: number;
  className: string;
  children: ReactNode;
}) {
  const reduced = Boolean(useReducedMotion());
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y };
  const shown = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={hidden}
      animate={reveal ? shown : hidden}
      transition={heroTextTransition(reveal ? delay : 0, reduced)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroMobileCopy({
  reveal,
  edition,
  tagline,
  subtitle,
}: HeroMobileCopyProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-12 pt-24 md:hidden">
      <HeroTextBlock
        reveal={reveal}
        delay={HERO_TEXT_DELAYS.microEdition}
        y={6}
        className="text-[12px] font-sans uppercase text-white/50 mb-4 tracking-[0.42em]"
      >
        {edition}
      </HeroTextBlock>

      <HeroTextBlock
        reveal={reveal}
        delay={HERO_TEXT_DELAYS.logo}
        y={8}
        className="font-serif text-[clamp(4.5rem,18vw,9rem)] font-light leading-none text-white/95"
      >
        AURELIA
      </HeroTextBlock>

      <HeroTextBlock
        reveal={reveal}
        delay={HERO_TEXT_DELAYS.title}
        y={10}
        className="font-serif italic text-[clamp(1.2rem,2.5vw,2rem)] text-white/88 mt-3"
      >
        {tagline}
      </HeroTextBlock>

      <HeroTextBlock
        reveal={reveal}
        delay={HERO_TEXT_DELAYS.microSubtitle}
        y={6}
        className="text-[12px] font-sans uppercase tracking-[0.45em] text-white/45 mt-4"
      >
        {subtitle}
      </HeroTextBlock>
    </div>
  );
}
