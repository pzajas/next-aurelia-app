import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  const text = "We do not cut hair. We sculpt identity. Each session is a bespoke editorial exploration of your most authentic self, crafted by masters of the avant-garde.";

  return (
    <section className="py-32 md:py-64 bg-foreground text-background relative z-10" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-10 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/4"
        >
          <p className="font-sans text-[12px] uppercase tracking-[0.3em] text-background/50 border-t border-background/20 pt-4">
            The Director's Vision
          </p>
        </motion.div>

        <div className="w-full md:w-3/4">
          <h2 className="font-serif text-3xl md:text-5xl lg:text-7xl leading-[1.1] font-light max-w-4xl">
            {text.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h2>
        </div>
      </div>
    </section>
  );
}