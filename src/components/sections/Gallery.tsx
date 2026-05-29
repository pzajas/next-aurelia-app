"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CinematicSurface from "@/components/CinematicSurface";
import GalleryMobileFeed from "@/components/sections/GalleryMobileFeed";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { media, lookupMedia } from "@/lib/media";

const GALLERY_HERO = media.galleryHero.src;

const EASE = [0.19, 1, 0.22, 1] as const;
const HOVER_EASE = [0.22, 1, 0.36, 1] as const;
const HOVER_MOTION = { duration: 0.82, ease: HOVER_EASE };

type LightboxItem = {
  src: string;
  width: number;
  height: number;
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
  src: string;
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
  // Rząd 1 — scalony lewy (row1+row2) + nape + arch
  {
    id: "r1r2-merged",
    span: { col: "1 / 2", row: "1 / 5" },
    src: media.galleryMergedR1R2.src,
    altIndex: 8,
    objectPosition: "50% 38%",
    labelIndex: 4,
  },
  { id: "r1-nape", span: { col: "2 / 3", row: "1 / 3" }, src: media.gallery[2].src, altIndex: 4, objectPosition: "50% 48%" },
  {
    id: "r1-arch",
    span: { col: "3 / 5", row: "1 / 3" },
    src: media.gallery[8].src,
    altIndex: 3,
    objectPosition: "50% 38%",
    labelIndex: 1,
  },

  // Rząd 2 — jedno szerokie zdjęcie
  {
    id: "r2-wide",
    span: { col: "2 / 5", row: "3 / 5" },
    src: media.gallery[6].src,
    altIndex: 2,
    objectPosition: "50% 48%",
  },

  // Klaster lewy + hero prawy
  {
    id: "r4-macro",
    span: { col: "1 / 3", row: "7 / 11" },
    src: media.gallery[9].src,
    altIndex: 0,
    objectPosition: "50% 52%",
    labelIndex: 2,
  },
  {
    id: "hero",
    span: { col: "3 / 5", row: "5 / 11" },
    src: GALLERY_HERO,
    altIndex: 8,
    objectPosition: "50% 38%",
    priority: true,
    labelIndex: 0,
  },

  // Dół — jedno szerokie + czwarte
  {
    id: "r6-wide",
    span: { col: "1 / 4", row: "11 / 13" },
    src: media.gallery[7].src,
    altIndex: 2,
    objectPosition: "50% 52%",
  },
  { id: "r6-d", span: { col: "4 / 5", row: "11 / 13" }, src: media.gallery[10].src, altIndex: 4, objectPosition: "50% 42%" },
];

/** Cytat pod dawnymi dwoma portretami (kolumny 1–2, rzędy 5–7). */
const QUOTE_SPAN: Span = { col: "1 / 3", row: "5 / 7" };

const MOBILE_TILES: Tile[] = [
  {
    id: "m-hero",
    span: { col: "1 / 3", row: "1 / 4" },
    src: GALLERY_HERO,
    altIndex: 8,
    priority: true,
    objectPosition: "50% 36%",
    labelIndex: 0,
  },
  {
    id: "m-r1r2",
    span: { col: "1 / 2", row: "3 / 7" },
    src: media.galleryMergedR1R2.src,
    altIndex: 8,
    objectPosition: "50% 38%",
  },
  { id: "m-2", span: { col: "2 / 3", row: "4 / 6" }, src: media.gallery[2].src, altIndex: 4, objectPosition: "50% 45%" },
  { id: "m-6a", span: { col: "1 / 2", row: "9 / 11" }, src: media.gallery[9].src, altIndex: 0, objectPosition: "50% 50%" },
  { id: "m-6b", span: { col: "2 / 3", row: "9 / 11" }, src: media.gallery[10].src, altIndex: 4, objectPosition: "50% 40%" },
];

const MOBILE_QUOTE: Span = { col: "1 / 3", row: "6 / 8" };

/** Match Next.js `sizes` to actual grid column span — avoids upscaling tiny assets. */
function tileSizes(span: Span): string {
  const match = span.col.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (!match) return "(max-width: 1280px) 25vw, 320px";
  const cols = Number(match[2]) - Number(match[1]);
  const vw = (cols / 4) * 100;
  const maxPx = Math.round((CONTAINER_MAX / 4) * cols);
  return `(max-width: 1280px) ${vw}vw, ${maxPx}px`;
}

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
  const intrinsic = { width: item.width, height: item.height };

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
      className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[#0a0a0a]/96 p-6 md:p-10"
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
            unoptimized
            quality={95}
            className="h-auto max-h-[min(88vh,920px)] w-auto max-w-[min(92vw,760px)] object-contain grayscale contrast-[1.08] brightness-[0.96]"
            style={{ objectPosition: item.objectPosition }}
          />
        ) : null}
      </motion.figure>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 font-sans text-[12px] uppercase tracking-[0.42em] text-white/45 transition-colors duration-300 hover:text-white/70 md:right-8 md:top-8"
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
    filter: "grayscale(1) brightness(0.94) contrast(1.06)",
  },
  hover: {
    scale: 1.06,
    filter: "grayscale(1) brightness(0.98) contrast(1.1)",
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

  const open = () => {
    const asset = lookupMedia(tile.src);
    onOpen({
      src: asset.src,
      width: asset.width,
      height: asset.height,
      alt,
      objectPosition: tile.objectPosition,
    });
  };

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
      data-cursor-gallery
      data-cursor-label={label || "VIEW"}
      className="gallery-tile relative min-h-0 cursor-pointer overflow-hidden bg-[#0a0a0a] p-0 text-left outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
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
          quality={80}
          priority={tile.priority}
          loading={tile.priority ? "eager" : "lazy"}
          fetchPriority={tile.priority ? "high" : "auto"}
          className="object-cover"
          style={{ objectPosition: tile.objectPosition }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        variants={grainVariants}
        transition={hoverTransition}
        className="cinematic-grain cinematic-grain--tile pointer-events-none absolute inset-0 z-[1]"
      />

      <EditorialCorners />

      {label ? (
        <motion.p
          variants={captionVariants}
          transition={hoverTransition}
          className="pointer-events-none absolute bottom-3 left-3 z-10 font-sans text-[12px] uppercase tracking-[0.5em] text-white/62"
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
      className="flex min-h-0 flex-col items-center justify-center bg-[#0a0a0a] px-4 py-6 text-center"
      style={{ gridColumn: span.col, gridRow: span.row }}
    >
      <p className="max-w-[min(22rem,92%)] font-serif text-[clamp(1.3rem,2.6vw,1.9rem)] font-light italic leading-[1.48] text-white/[0.88]">
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
    <CinematicSurface
      ref={sectionRef}
      intenseGrain
      className="py-16 md:py-20"
      contentClassName="mx-auto w-full max-w-[1280px] px-4 md:px-10"
    >
      <div className="w-full">
        <motion.header
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          transition={{ duration: 1.05, ease: EASE }}
          className="mb-10 flex items-start justify-between md:mb-12 will-change-[transform,opacity]"
        >
          <div className="space-y-1">
            <p className="font-sans text-[12px] uppercase tracking-[0.42em] text-white/36">
              {t(copy.gallery.brand)}
            </p>
            <p className="hidden font-sans text-[12px] uppercase tracking-[0.36em] text-white/26 md:block">
              {t(copy.gallery.atelier)}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <p className="font-sans text-[12px] uppercase tracking-[0.42em] text-white/36">
              {t(copy.gallery.selectedWorks)}
            </p>
            <p className="hidden font-sans text-[12px] uppercase tracking-[0.36em] text-white/26 md:block">
              {t(copy.gallery.volume)}
            </p>
          </div>
        </motion.header>

        <motion.div
          className="max-md:hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
        >
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
                sizes={tileSizes(tile.span)}
                onOpen={setLightbox}
                label={
                  tile.labelIndex !== undefined
                    ? t(copy.gallery.hoverLabels[tile.labelIndex])
                    : undefined
                }
              />
            ))}
          </div>
        </motion.div>

        <GalleryMobileFeed
          tiles={MOBILE_TILES}
          quoteLine1={t(copy.gallery.quoteLine1)}
          quoteLine2={t(copy.gallery.quoteLine2)}
          getAlt={(altIndex) => t(copy.gallery.alts[altIndex])}
          onOpen={setLightbox}
        />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
          className="mt-10 flex items-end justify-between md:mt-12 will-change-[opacity]"
        >
          <a
            href="#works"
            className="font-sans text-[12px] uppercase tracking-[0.38em] text-white/36 underline decoration-white/18 decoration-1 underline-offset-[5px] transition-colors duration-500 hover:text-white/50"
          >
            {t(copy.gallery.viewAll)}
          </a>
          <p className="hidden font-sans text-[12px] uppercase tracking-[0.38em] text-white/26 md:block">
            {t(copy.gallery.themes)}
          </p>
        </motion.footer>
      </div>

      <AnimatePresence>
        {lightbox ? (
          <GalleryLightbox
            key={lightbox.src}
            item={lightbox}
            closeLabel={t(copy.nav.close)}
            onClose={closeLightbox}
          />
        ) : null}
      </AnimatePresence>
    </CinematicSurface>
  );
}
