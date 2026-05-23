"use client";

import Image, { type StaticImageData } from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const PERSON_HERO = "/images/person.png";

const EASE = [0.19, 1, 0.22, 1] as const;
const HOVER_EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_MOTION = { duration: 0.82, ease: HOVER_EASE };

type LightboxItem = {
  src: StaticImageData | string;
  alt: string;
  objectPosition: string;
};

const CONTAINER_MAX = 1280;
const GAP = 32;

/** Wysokości rzędów — pionowe portrety i duże kwadraty, nie niskie paski */
const GRID_ROWS = [
  "minmax(200px, 1.35fr)",
  "minmax(200px, 1.35fr)",
  "minmax(180px, 1.15fr)",
  "minmax(180px, 1.15fr)",
  "minmax(160px, 1fr)",
  "minmax(160px, 1fr)",
  "minmax(160px, 1fr)",
  "minmax(160px, 1fr)",
  "minmax(160px, 1fr)",
  "minmax(190px, 1.2fr)",
  "minmax(190px, 1.2fr)",
  "minmax(190px, 1.15fr)",
].join(" ");

type Span = { col: string; row: string };

type Tile = {
  id: string;
  span: Span;
  src: StaticImageData | string;
  altIndex: number;
  objectPosition: string;
  priority?: boolean;
  /** Mikro-typografia w lewym dolnym rogu — tylko większe kafle */
  labelIndex?: number;
};

/**
 * Natalie — 4 kolumny, 11 rzędów wysokości.
 * Klucz: span 2+ rzędów = portrety pionowe; hero 7 rzędów; makro 4 rzędy; dół 2 rzędy.
 */
const TILES: Tile[] = [
  // Rząd 1 — trzy pionowe (2 rzędy wysokości każdy)
  { id: "r1-chair", span: { col: "1 / 2", row: "1 / 3" }, src: gallery1, altIndex: 0, objectPosition: "52% 28%" },
  { id: "r1-nape", span: { col: "2 / 3", row: "1 / 3" }, src: gallery2, altIndex: 1, objectPosition: "50% 38%" },
  {
    id: "r1-arch",
    span: { col: "3 / 5", row: "1 / 3" },
    src: gallery4,
    altIndex: 3,
    objectPosition: "42% 52%",
    labelIndex: 1,
  },

  // Rząd 2 — cytat (kwadrat) + trzy pionowe
  { id: "r2-motion", span: { col: "2 / 3", row: "3 / 5" }, src: gallery3, altIndex: 2, objectPosition: "44% 36%" },
  { id: "r2-tools", span: { col: "3 / 4", row: "3 / 5" }, src: gallery5, altIndex: 4, objectPosition: "54% 50%" },
  { id: "r2-bob", span: { col: "4 / 5", row: "3 / 5" }, src: gallery2, altIndex: 1, objectPosition: "68% 35%" },

  // Klaster lewy + hero prawy
  { id: "r3-wave", span: { col: "1 / 2", row: "5 / 7" }, src: gallery3, altIndex: 2, objectPosition: "50% 58%" },
  {
    id: "r3-hall",
    span: { col: "2 / 3", row: "5 / 9" },
    src: gallery4,
    altIndex: 3,
    objectPosition: "55% 48%",
    labelIndex: 4,
  },
  {
    id: "r4-macro",
    span: { col: "1 / 3", row: "7 / 11" },
    src: gallery1,
    altIndex: 0,
    objectPosition: "48% 68%",
    labelIndex: 2,
  },
  {
    id: "hero",
    span: { col: "3 / 5", row: "5 / 11" },
    src: PERSON_HERO,
    altIndex: 8,
    objectPosition: "38% 22%",
    priority: true,
    labelIndex: 0,
  },

  // Dół — cztery pionowe (2 rzędy), bez nakładania na makro
  { id: "r6-a", span: { col: "1 / 2", row: "11 / 13" }, src: gallery3, altIndex: 2, objectPosition: "46% 40%" },
  { id: "r6-b", span: { col: "2 / 3", row: "11 / 13" }, src: gallery5, altIndex: 4, objectPosition: "50% 46%" },
  { id: "r6-c", span: { col: "3 / 4", row: "11 / 13" }, src: gallery4, altIndex: 3, objectPosition: "50% 42%" },
  { id: "r6-d", span: { col: "4 / 5", row: "11 / 13" }, src: gallery1, altIndex: 0, objectPosition: "58% 32%" },
];

const QUOTE_SPAN: Span = { col: "1 / 2", row: "3 / 5" };

const MOBILE_TILES: Tile[] = [
  {
    id: "m-hero",
    span: { col: "1 / 3", row: "1 / 4" },
    src: PERSON_HERO,
    altIndex: 8,
    priority: true,
    objectPosition: "42% 18%",
    labelIndex: 0,
  },
  { id: "m-1", span: { col: "1 / 2", row: "4 / 6" }, src: gallery1, altIndex: 0, objectPosition: "50% 30%" },
  { id: "m-2", span: { col: "2 / 3", row: "4 / 6" }, src: gallery2, altIndex: 1, objectPosition: "50% 38%" },
  { id: "m-3", span: { col: "1 / 2", row: "6 / 9" }, src: gallery3, altIndex: 2, objectPosition: "45% 55%" },
  { id: "m-4", span: { col: "2 / 3", row: "6 / 8" }, src: gallery5, altIndex: 4, objectPosition: "52% 48%" },
  { id: "m-5", span: { col: "2 / 3", row: "8 / 9" }, src: gallery4, altIndex: 3, objectPosition: "48% 52%" },
  { id: "m-6a", span: { col: "1 / 2", row: "9 / 11" }, src: gallery4, altIndex: 3, objectPosition: "50% 50%" },
  { id: "m-6b", span: { col: "2 / 3", row: "9 / 11" }, src: gallery2, altIndex: 1, objectPosition: "50% 40%" },
];

const MOBILE_QUOTE: Span = { col: "1 / 3", row: "3 / 4" };

const cornerVariants = {
  idle: { opacity: 0, scale: 0.6 },
  hover: { opacity: 1, scale: 1 },
};

function EditorialCorners() {
  return (
    <>
      <motion.div
        aria-hidden
        variants={cornerVariants}
        transition={HOVER_MOTION}
        className="pointer-events-none absolute left-3 top-3 z-10"
      >
        <motion.span
          variants={{ idle: { x: -4, y: -4 }, hover: { x: 0, y: 0 } }}
          transition={HOVER_MOTION}
          className="block h-px w-5 bg-white/88"
        />
        <motion.span
          variants={{ idle: { x: -4, y: -4 }, hover: { x: 0, y: 0 } }}
          transition={HOVER_MOTION}
          className="block h-5 w-px bg-white/88"
        />
      </motion.div>
      <motion.div
        aria-hidden
        variants={cornerVariants}
        transition={HOVER_MOTION}
        className="pointer-events-none absolute bottom-3 right-3 z-10 flex flex-col items-end"
      >
        <motion.span
          variants={{ idle: { x: 4, y: 4 }, hover: { x: 0, y: 0 } }}
          transition={HOVER_MOTION}
          className="block h-5 w-px bg-white/88"
        />
        <motion.span
          variants={{ idle: { x: 4, y: 4 }, hover: { x: 0, y: 0 } }}
          transition={HOVER_MOTION}
          className="block h-px w-5 bg-white/88"
        />
      </motion.div>
    </>
  );
}

function GalleryLightbox({
  item,
  closeLabel,
  onClose,
}: {
  item: LightboxItem;
  closeLabel: string;
  onClose: () => void;
}) {
  const intrinsic =
    typeof item.src === "string"
      ? null
      : { width: item.src.width, height: item.src.height };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: HOVER_EASE }}
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[#050505]/96 p-6 md:p-10"
      onClick={onClose}
    >
      <motion.figure
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.55, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[min(88vh,920px)] max-w-[min(92vw,760px)] items-center justify-center"
      >
        {intrinsic ? (
          <Image
            src={item.src}
            alt={item.alt}
            width={intrinsic.width}
            height={intrinsic.height}
            className="h-auto max-h-[min(88vh,920px)] w-auto max-w-[min(92vw,760px)] object-contain grayscale contrast-[1.08] brightness-[0.96]"
            style={{ objectPosition: item.objectPosition }}
          />
        ) : (
          <div className="relative h-[min(88vh,920px)] w-[min(92vw,560px)]">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="92vw"
              className="object-contain grayscale contrast-[1.08] brightness-[0.96]"
              style={{ objectPosition: item.objectPosition }}
            />
          </div>
        )}
      </motion.figure>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 font-sans text-[9px] uppercase tracking-[0.42em] text-white/45 transition-colors duration-300 hover:text-white/70 md:right-8 md:top-8"
      >
        {closeLabel}
      </button>
    </motion.div>,
    document.body
  );
}

const imageVariants = {
  idle: {
    scale: 1,
    filter: "grayscale(1) brightness(0.92) contrast(1.1)",
  },
  hover: {
    scale: 1.05,
    filter: "grayscale(1) brightness(1) contrast(1.14)",
  },
};

const grainVariants = {
  idle: { opacity: 0 },
  hover: { opacity: 0.055 },
};

const captionVariants = {
  idle: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0 },
};

function PhotoTile({
  tile,
  alt,
  sizes,
  label,
  onOpen,
}: {
  tile: Tile;
  alt: string;
  sizes: string;
  label?: string;
  onOpen: (item: LightboxItem) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const motionState = focused ? "hover" : "idle";
  const hoverTransition = reduceMotion ? { duration: 0 } : HOVER_MOTION;
  const imageMotion = reduceMotion
    ? { idle: { scale: 1 }, hover: { scale: 1 } }
    : imageVariants;

  const open = () =>
    onOpen({
      src: tile.src,
      alt,
      objectPosition: tile.objectPosition,
    });

  return (
    <motion.button
      type="button"
      initial="idle"
      whileHover={reduceMotion ? undefined : "hover"}
      animate={motionState}
      variants={{ idle: {}, hover: {} }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      aria-label={alt}
      className="gallery-tile relative min-h-0 cursor-pointer overflow-hidden bg-[#050505] p-0 text-left outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
      style={{ gridColumn: tile.span.col, gridRow: tile.span.row }}
    >
      <motion.div
        className="absolute inset-0 origin-center will-change-transform"
        variants={imageMotion}
        transition={hoverTransition}
      >
        <Image
          src={tile.src}
          alt={alt}
          fill
          sizes={sizes}
          priority={tile.priority}
          className="object-cover"
          style={{ objectPosition: tile.objectPosition }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        variants={grainVariants}
        transition={hoverTransition}
        className="testimonial-grain pointer-events-none absolute inset-0 z-[1] mix-blend-overlay"
      />

      <EditorialCorners />

      {label ? (
        <motion.p
          variants={captionVariants}
          transition={hoverTransition}
          className="pointer-events-none absolute bottom-3 left-3 z-10 font-sans text-[7px] uppercase tracking-[0.5em] text-white/62"
        >
          {label}
        </motion.p>
      ) : null}
    </motion.button>
  );
}

function QuoteTile({ line1, line2, span }: { line1: string; line2: string; span: Span }) {
  return (
    <div
      className="flex min-h-0 flex-col items-center justify-center bg-[#050505] px-4 py-6 text-center"
      style={{ gridColumn: span.col, gridRow: span.row }}
    >
      <p className="max-w-[10.5rem] font-serif text-[clamp(0.82rem, 1.3vw, 1.08rem)] font-light italic leading-[1.52] text-white/[0.88]">
        {line1}
        <br />
        {line2}
      </p>
      <div className="mt-3.5 h-px w-7 bg-white/25" aria-hidden />
    </div>
  );
}

export default function Gallery() {
  const { t, copy } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-6% 0px" });
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  return (
    <section ref={sectionRef} id="works" className="relative bg-[#050505] py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 1.1, ease: EASE }}
        className="mx-auto w-full px-5 md:px-8"
        style={{ maxWidth: CONTAINER_MAX }}
      >
        <header className="mb-10 flex items-start justify-between md:mb-12">
          <div className="space-y-1">
            <p className="font-sans text-[9px] uppercase tracking-[0.42em] text-white/50">
              {t(copy.gallery.brand)}
            </p>
            <p className="font-sans text-[8px] uppercase tracking-[0.36em] text-white/26">
              {t(copy.gallery.atelier)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-sans text-[9px] uppercase tracking-[0.42em] text-white/50">
              {t(copy.gallery.selectedWorks)}
            </p>
            <p className="font-sans text-[8px] uppercase tracking-[0.36em] text-white/26">
              {t(copy.gallery.volume)}
            </p>
          </div>
        </header>

        <div className="max-md:hidden">
          <div
            className="grid w-full grid-cols-4"
            style={{ gap: GAP, gridTemplateRows: GRID_ROWS }}
          >
            <QuoteTile
              line1={t(copy.gallery.quoteLine1)}
              line2={t(copy.gallery.quoteLine2)}
              span={QUOTE_SPAN}
            />
            {TILES.map((tile) => (
              <PhotoTile
                key={tile.id}
                tile={tile}
                alt={t(copy.gallery.alts[tile.altIndex])}
                sizes="(max-width: 1280px) 25vw, 300px"
                onOpen={setLightbox}
                label={
                  tile.labelIndex !== undefined
                    ? t(copy.gallery.hoverLabels[tile.labelIndex])
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        <div className="md:hidden">
          <div
            className="grid w-full grid-cols-2"
            style={{
              gap: 20,
              gridTemplateRows: "1.2fr 0.5fr 1fr 1.1fr 1fr 0.9fr 1fr 1fr",
              minHeight: "720px",
            }}
          >
            <QuoteTile
              line1={t(copy.gallery.quoteLine1)}
              line2={t(copy.gallery.quoteLine2)}
              span={MOBILE_QUOTE}
            />
            {MOBILE_TILES.map((tile) => (
              <PhotoTile
                key={tile.id}
                tile={tile}
                alt={t(copy.gallery.alts[tile.altIndex])}
                sizes="50vw"
                onOpen={setLightbox}
                label={
                  tile.labelIndex !== undefined
                    ? t(copy.gallery.hoverLabels[tile.labelIndex])
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        <footer className="mt-10 flex items-end justify-between md:mt-12">
          <a
            href="#works"
            className="font-sans text-[8px] uppercase tracking-[0.38em] text-white/36 underline decoration-white/18 decoration-1 underline-offset-[5px] transition-colors duration-500 hover:text-white/50"
          >
            {t(copy.gallery.viewAll)}
          </a>
          <p className="hidden font-sans text-[8px] uppercase tracking-[0.38em] text-white/26 md:block">
            {t(copy.gallery.themes)}
          </p>
        </footer>
      </motion.div>

      <AnimatePresence>
        {lightbox ? (
          <GalleryLightbox
            key={
              typeof lightbox.src === "string" ? lightbox.src : lightbox.src.src
            }
            item={lightbox}
            closeLabel={t(copy.nav.close)}
            onClose={closeLightbox}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
