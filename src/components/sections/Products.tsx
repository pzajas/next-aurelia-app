"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media } from "@/lib/media";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Products() {
  const { t, copy } = useLocale();

  const products = [
    { image: media.products[1].src, ...copy.products.items[0] },
    { image: media.products[2].src, ...copy.products.items[1] },
  ];

  return (
    <section className="cinematic-section bg-[#f8f8f8]">
      <motion.div className="cinematic-bloom" aria-hidden />
      <div className="max-w-6xl mx-auto px-4 md:px-10 pt-24 md:pt-32 pb-20">
        <div className="text-[10px] font-sans uppercase tracking-[0.4em] text-foreground/60 mb-16">
          {t(copy.products.label)}
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          {products.map((product, index) => (
            <motion.div
              key={t(product.name)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 1 }}
              className={index === 1 ? "md:mt-16" : undefined}
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={product.image}
                  alt={t(product.name)}
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="font-serif text-[2rem] text-foreground mt-4">
                {t(product.name)}
              </h3>
              <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-foreground/50 mt-2">
                {t(product.tagline)}
              </div>
              <div className="w-8 border-t border-foreground/20 mt-4" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
