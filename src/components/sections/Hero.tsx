"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { media } from "@/lib/media";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useIntroReveal } from "@/lib/intro/IntroRevealContext";

const HERO_EASE = [0.22, 1, 0.36, 1] as const;

const HERO_ENTRANCE = {
  edition: { delay: 1.8, duration: 0.8 },
  title: { delay: 2.0, duration: 1.0 },
  tagline: { delay: 2.2, duration: 1.0 },
  subtitle: { delay: 2.4, duration: 0.9 },
  appointment: { delay: 2.5, duration: 0.7 },
} as const;

export default function Hero() {
  const { t, copy } = useLocale();
  const { deferHeroEntrance } = useIntroReveal();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [mediaReady, setMediaReady] = useState(false);

  useEffect(() => {
    if (imageLoaded && !deferHeroEntrance) {
      setMediaReady(true);
    }
  }, [imageLoaded, deferHeroEntrance]);

  return (
    <section
      id="hero"
      className="relative h-screen w-full -mt-[88px] bg-[#020202] overflow-hidden"
    >
      <div className="absolute inset-0">
        <Image
          src={media.hero.src}
          alt="Aurelia"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={80}
          className="object-contain object-[72%_center] grayscale contrast-[1.06] brightness-[1.02]"
          sizes="(max-width: 1200px) min(100vw, 1200px), 725px"
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-10 md:px-10 pb-12 md:pb-20 pt-24">
        <div
          style={{
            opacity: mediaReady ? 1 : 0,
            transform: mediaReady ? "translateY(0) translateZ(0)" : "translateY(6px) translateZ(0)",
            clipPath: mediaReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1) 1.8s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 1.8s, clip-path 1.2s cubic-bezier(0.16,1,0.3,1) 1.8s",
            willChange: "transform, opacity, clip-path",
          }}
          className="text-[12px] font-sans uppercase text-white/50 mb-4 tracking-[0.42em]"
        >
          {t(copy.hero.edition)}
        </div>

        <h1
          style={{
            opacity: mediaReady ? 1 : 0,
            transform: mediaReady ? "translateY(0) translateZ(0)" : "translateY(40px) translateZ(0)",
            clipPath: mediaReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "opacity 1.6s cubic-bezier(0.16,1,0.3,1) 2.0s, transform 1.6s cubic-bezier(0.16,1,0.3,1) 2.0s, clip-path 1.4s cubic-bezier(0.16,1,0.3,1) 2.0s",
            willChange: "transform, opacity, clip-path",
          }}
          className="font-serif text-[clamp(4.5rem,18vw,9rem)] font-light leading-none text-white/95"
        >
          AURELIA
        </h1>

        <p
          style={{
            opacity: mediaReady ? 1 : 0,
            transform: mediaReady ? "translateY(0) translateZ(0)" : "translateY(20px) translateZ(0)",
            clipPath: mediaReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "opacity 1.4s cubic-bezier(0.16,1,0.3,1) 2.4s, transform 1.4s cubic-bezier(0.16,1,0.3,1) 2.4s, clip-path 1.2s cubic-bezier(0.16,1,0.3,1) 2.4s",
            willChange: "transform, opacity, clip-path",
          }}
          className="font-serif italic text-[clamp(1.2rem,2.5vw,2rem)] text-white/88 mt-3"
        >
          {t(copy.hero.tagline)}
        </p>

        <p
          style={{
            opacity: mediaReady ? 1 : 0,
            transform: mediaReady ? "translateY(0) translateZ(0)" : "translateY(14px) translateZ(0)",
            clipPath: mediaReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition: "opacity 1.2s cubic-bezier(0.16,1,0.3,1) 2.7s, transform 1.2s cubic-bezier(0.16,1,0.3,1) 2.7s, clip-path 1.0s cubic-bezier(0.16,1,0.3,1) 2.7s",
            willChange: "transform, opacity, clip-path",
          }}
          className="text-[12px] font-sans uppercase tracking-[0.45em] text-white/45 mt-4"
        >
          {t(copy.hero.subtitle)}
        </p>
      </div>

      <div
        style={{
          opacity: mediaReady ? 1 : 0,
          transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 3.0s",
        }}
        className="absolute bottom-8 right-8 z-20 hidden md:block text-[12px] font-sans uppercase text-white/40 tracking-[0.38em]"
      >
        {t(copy.hero.appointmentOnly)}
      </div>
    </section>
  );
}
