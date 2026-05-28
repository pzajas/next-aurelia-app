"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const easeLuxury = [0.22, 1, 0.36, 1] as const;

export default function ClosingManifesto() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-editorial bg-layer-1"
      aria-hidden
    >
      <div className="flex items-center justify-center px-4 py-32 md:px-10 md:py-44 lg:py-52">
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={inView ? { opacity: 1, scaleY: 1 } : undefined}
          transition={{ duration: 1.25, ease: easeLuxury }}
          className="h-[560px] w-px shrink-0 origin-center bg-foreground/18"
        />
      </div>
    </section>
  );
}
