"use client";

import CinematicSurface from "@/components/CinematicSurface";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

const itemReveal = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.35, ease: easeLuxury },
  },
};

export default function DirectorManifesto() {
  const { t, tLines, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12% 0px" });
  const [entered, setEntered] = useState(false);

  const quoteLines = tLines(copy.manifesto.lines);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [12, -10]);

  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  return (
    <CinematicSurface
      ref={sectionRef}
      intenseGrain
      className="border-b border-white/10 editorial-whitespace-xl"
    >
      <motion.div style={{ y: parallaxY }} className="px-10 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, x: -16, letterSpacing: "0.28em" }}
            animate={
              entered ? { opacity: 1, x: 0, letterSpacing: "0.4em" } : undefined
            }
            transition={{ duration: 1.2, ease: easeLuxury }}
            className="text-[12px] font-sans uppercase text-white/40 mb-14 md:mb-16"
          >
            {t(copy.manifesto.label)}
          </motion.p>

          <motion.blockquote
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.14,
                  delayChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            className="font-serif italic font-light text-[clamp(1.35rem,2.8vw,2.35rem)] leading-[1.45] text-white/92"
          >
            {quoteLines.map((line) => (
              <motion.span
                key={line}
                variants={itemReveal}
                className="block will-change-transform"
              >
                {line}
              </motion.span>
            ))}
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={entered ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 1.1, delay: 0.72, ease: easeLuxury }}
            className="mt-12 text-[12px] font-sans uppercase tracking-[0.3em] text-white/50 will-change-transform"
          >
            {t(copy.manifesto.attribution)}
          </motion.p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={entered ? { width: 48, opacity: 1 } : undefined}
            transition={{ duration: 1.15, delay: 0.88, ease: easeLuxury }}
            className="h-px bg-white/20 mx-auto mt-14"
          />
        </div>
      </motion.div>
    </CinematicSurface>
  );
}
