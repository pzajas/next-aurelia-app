"use client";

import HeroCinematicPortrait from "@/components/sections/HeroCinematicPortrait";
import HeroMobileCopy from "@/components/sections/HeroMobileCopy";
import { useIntroReveal } from "@/lib/intro/IntroRevealContext";
import {
  HERO_DESKTOP_IMAGE_ENTRANCE,
  HERO_INTRO_PEEK,
} from "@/lib/intro/timing";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { HERO_MOBILE_SIZES } from "@/lib/hero-image-preload";
import { media } from "@/lib/media";
import Image from "next/image";
import { useEffect, useState } from "react";

const DESKTOP_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

export default function Hero() {
  const { t, copy } = useLocale();
  const {
    deferHeroImage,
    deferHeroCopy,
    heroIntroPeek,
    entranceFromIntro,
  } = useIntroReveal();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [copyReady, setCopyReady] = useState(false);

  const revealImage = imageLoaded && !deferHeroImage;
  const revealCopy = revealImage && !deferHeroCopy;
  const peekImage = heroIntroPeek && imageLoaded && deferHeroImage;

  useEffect(() => {
    if (revealCopy) {
      setCopyReady(true);
    }
  }, [revealCopy]);

  const showDesktopImage = entranceFromIntro
    ? peekImage || revealImage
    : imageLoaded;

  const desktopScale = revealImage
    ? 1
    : peekImage
      ? HERO_INTRO_PEEK.scale
      : HERO_DESKTOP_IMAGE_ENTRANCE.fromScale;

  const desktopFilter = peekImage
    ? `blur(${HERO_INTRO_PEEK.blurPx}px) brightness(${HERO_INTRO_PEEK.brightness})`
    : "blur(0px) brightness(1)";

  const desktopImageTransition = entranceFromIntro
    ? [
        `opacity ${HERO_DESKTOP_IMAGE_ENTRANCE.opacityDurationS}s ${DESKTOP_EASE}`,
        `transform ${HERO_DESKTOP_IMAGE_ENTRANCE.scaleDurationS}s ${DESKTOP_EASE}`,
        `filter ${HERO_INTRO_PEEK.unblurDurationS}s ${DESKTOP_EASE}`,
      ].join(", ")
    : "none";

  return (
    <section
      id="hero"
      className="relative h-[100svh] md:h-screen w-full mt-[-58px] md:mt-[-88px] bg-[#020202] overflow-hidden"
    >
      <div
        className="md:hidden absolute inset-0 will-change-[filter]"
        style={{
          filter: peekImage
            ? `blur(${HERO_INTRO_PEEK.blurPx}px) brightness(${HERO_INTRO_PEEK.brightness})`
            : "blur(0px) brightness(1)",
          transition: entranceFromIntro
            ? `filter ${HERO_INTRO_PEEK.unblurDurationS}s ${DESKTOP_EASE}`
            : "none",
        }}
      >
        <HeroCinematicPortrait
          src={media.hero.src}
          alt="Aurelia"
          visible={imageLoaded}
          deferEntrance={deferHeroImage && !heroIntroPeek}
          reveal={revealImage}
          onLoad={() => setImageLoaded(true)}
          className="object-cover object-[60%_center] grayscale contrast-[1.06] brightness-[1.02]"
          sizes={HERO_MOBILE_SIZES}
        />
      </div>

      <div
        className="absolute inset-0 hidden md:block origin-center will-change-[transform,opacity,filter]"
        style={{
          opacity: showDesktopImage ? 1 : 0,
          transform: `scale(${desktopScale}) translateZ(0)`,
          filter: desktopFilter,
          transition: desktopImageTransition,
        }}
      >
        <Image
          src={media.hero.src}
          alt="Aurelia"
          fill
          priority
          loading="eager"
          fetchPriority="high"
          quality={75}
          className="object-contain object-[72%_center] grayscale contrast-[1.06] brightness-[1.02]"
          sizes={HERO_MOBILE_SIZES}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      <HeroMobileCopy
        reveal={revealCopy}
        edition={t(copy.hero.edition)}
        tagline={t(copy.hero.tagline)}
        subtitle={t(copy.hero.subtitle)}
      />

      <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block px-10 pb-20 pt-24">
        <div
          style={{
            opacity: copyReady ? 1 : 0,
            transform: copyReady
              ? "translateY(0) translateZ(0)"
              : "translateY(6px) translateZ(0)",
            clipPath: copyReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition:
              "opacity 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s, clip-path 0.95s cubic-bezier(0.16,1,0.3,1) 0.1s",
            willChange: "transform, opacity, clip-path",
          }}
          className="text-[12px] font-sans uppercase text-white/50 mb-4 tracking-[0.42em]"
        >
          {t(copy.hero.edition)}
        </div>

        <h1
          style={{
            opacity: copyReady ? 1 : 0,
            transform: copyReady
              ? "translateY(0) translateZ(0)"
              : "translateY(40px) translateZ(0)",
            clipPath: copyReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition:
              "opacity 1.25s cubic-bezier(0.16,1,0.3,1) 0.28s, transform 1.25s cubic-bezier(0.16,1,0.3,1) 0.28s, clip-path 1.1s cubic-bezier(0.16,1,0.3,1) 0.28s",
            willChange: "transform, opacity, clip-path",
          }}
          className="font-serif text-[clamp(4.5rem,18vw,9rem)] font-light leading-none text-white/95"
        >
          AURELIA
        </h1>

        <p
          style={{
            opacity: copyReady ? 1 : 0,
            transform: copyReady
              ? "translateY(0) translateZ(0)"
              : "translateY(20px) translateZ(0)",
            clipPath: copyReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition:
              "opacity 1.1s cubic-bezier(0.16,1,0.3,1) 0.44s, transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.44s, clip-path 0.95s cubic-bezier(0.16,1,0.3,1) 0.44s",
            willChange: "transform, opacity, clip-path",
          }}
          className="font-serif italic text-[clamp(1.2rem,2.5vw,2rem)] text-white/88 mt-3"
        >
          {t(copy.hero.tagline)}
        </p>

        <p
          style={{
            opacity: copyReady ? 1 : 0,
            transform: copyReady
              ? "translateY(0) translateZ(0)"
              : "translateY(14px) translateZ(0)",
            clipPath: copyReady ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
            transition:
              "opacity 0.95s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.95s cubic-bezier(0.16,1,0.3,1) 0.6s, clip-path 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s",
            willChange: "transform, opacity, clip-path",
          }}
          className="text-[12px] font-sans uppercase tracking-[0.45em] text-white/45 mt-4"
        >
          {t(copy.hero.subtitle)}
        </p>
      </div>

      <div
        style={{
          opacity: copyReady ? 1 : 0,
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.85s",
        }}
        className="absolute bottom-8 right-8 z-20 hidden md:block text-[12px] font-sans uppercase text-white/40 tracking-[0.38em]"
      >
        {t(copy.hero.appointmentOnly)}
      </div>
    </section>
  );
}
