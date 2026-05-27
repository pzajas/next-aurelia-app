"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { media } from "@/lib/media";
import { mobileNavPalette } from "@/lib/nav-glass";
import {
  mobileNavMotion,
  NAV_EASE,
  NAV_EASE_SNAP,
} from "@/lib/nav-motion";
import { cn } from "@/lib/utils";

export { MOBILE_HEADER_HEIGHT as NAV_HEADER_HEIGHT } from "@/lib/header-metrics";

const t = mobileNavMotion;
const p = mobileNavPalette;

function MobileNavLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <a href={href} onClick={onNavigate} className="group block py-1.5">
      <span
        className={cn(
          "block font-serif text-[clamp(1.84rem,6.3vw,2.38rem)] font-light",
          "leading-[1.28] tracking-[0.022em]",
          "transition-[opacity,letter-spacing] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:opacity-[0.5] group-hover:tracking-[0.032em]",
          "group-active:opacity-[0.65]",
          p.fg
        )}
      >
        {label}
      </span>
    </a>
  );
}

export function MenuToggleIcon({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "menu-toggle-icon relative block h-[12px] w-[22px]",
        className
      )}
      data-open={open ? "" : undefined}
      aria-hidden
    >
      <span className="menu-toggle-line menu-toggle-line-top" />
      <span className="menu-toggle-line menu-toggle-line-bottom" />
    </span>
  );
}

type MobileNavOverlayProps = {
  open: boolean;
  items: { id: string; href: string; label: string }[];
  ctaLabel: string;
  ctaSubline: string;
  editionMark: string;
  onClose: () => void;
  onExitComplete?: () => void;
};

export default function MobileNavOverlay({
  open,
  items,
  ctaLabel,
  ctaSubline,
  editionMark,
  onClose,
  onExitComplete,
}: MobileNavOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const motionSet = useMemo(() => {
    if (reducedMotion) {
      const fade = (duration: number, delay = 0): Variants => ({
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration, delay, ease: NAV_EASE },
        },
        exit: {
          opacity: 0,
          transition: { duration: duration * 0.75, ease: NAV_EASE_SNAP },
        },
      });

      return {
        dimVariants: fade(0.2),
        panelVariants: fade(0.24, 0.04),
        atmosphereVariants: fade(0.2, 0.06),
        listVariants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } },
          exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
        },
        linkVariants: fade(0.2),
        accentVariants: fade(0.18),
        ctaVariants: fade(0.2, 0.1),
        editionVariants: fade(0.18, 0.12),
      };
    }

    return {
      dimVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: t.open.dim, ease: NAV_EASE },
        },
        exit: {
          opacity: 0,
          transition: {
            duration: t.close.dim,
            delay: t.close.dimDelay,
            ease: NAV_EASE_SNAP,
          },
        },
      } satisfies Variants,

      panelVariants: {
        hidden: { opacity: 0, y: 24, filter: "blur(12px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: t.open.panel,
            delay: t.open.panelDelay,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          y: 14,
          filter: "blur(8px)",
          transition: {
            duration: t.close.panel,
            delay: t.close.panelDelay,
            ease: NAV_EASE_SNAP,
          },
        },
      } satisfies Variants,

      atmosphereVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: t.open.atmosphere,
            delay: t.open.atmosphereDelay,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            duration: t.close.atmosphere,
            delay: t.close.atmosphereDelay,
            ease: NAV_EASE_SNAP,
          },
        },
      } satisfies Variants,

      listVariants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: t.open.linkStagger,
            delayChildren: t.open.linkDelay,
          },
        },
        exit: {
          transition: {
            staggerChildren: t.close.linkStagger,
            staggerDirection: -1,
          },
        },
      } satisfies Variants,

      linkVariants: {
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: t.open.linkDuration, ease: NAV_EASE },
        },
        exit: {
          opacity: 0,
          y: -8,
          transition: { duration: t.close.linkDuration, ease: NAV_EASE_SNAP },
        },
      } satisfies Variants,

      accentVariants: {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
          scaleX: 1,
          opacity: 0.85,
          transition: {
            duration: t.open.accentLine,
            delay: t.open.accentDelay,
            ease: NAV_EASE,
          },
        },
        exit: {
          scaleX: 0,
          opacity: 0,
          transition: { duration: t.close.accent, ease: NAV_EASE_SNAP },
        },
      } satisfies Variants,

      ctaVariants: {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: t.open.linkDuration,
            delay:
              t.open.linkDelay +
              items.length * t.open.linkStagger +
              t.open.ctaExtraDelay,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          y: 6,
          transition: { duration: t.close.linkDuration, ease: NAV_EASE_SNAP },
        },
      } satisfies Variants,

      editionVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: t.open.linkDuration,
            delay:
              t.open.linkDelay +
              items.length * t.open.linkStagger +
              t.open.ctaExtraDelay +
              t.open.editionDelay,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          transition: { duration: t.close.edition, ease: NAV_EASE_SNAP },
        },
      } satisfies Variants,
    };
  }, [reducedMotion, items.length]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {open ? (
        <>
          <motion.button
            key="nav-dim"
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[180] bg-[#0A0A0A] md:hidden outline-none [-webkit-tap-highlight-color:transparent]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={motionSet.dimVariants}
            onClick={onClose}
          />

          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[185] flex flex-col overflow-hidden border-0 outline-none md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={motionSet.panelVariants}
          >
            <motion.div className="mobile-nav-depth" aria-hidden />
            <motion.div className="mobile-nav-depth__vignette" aria-hidden />
            <motion.div className="mobile-nav-depth__sheen" aria-hidden />

            <div
              className="mobile-nav-light-bloom mobile-nav-light-bloom--dark"
              aria-hidden
            />

            <motion.div
              className="mobile-nav-atmosphere mobile-nav-atmosphere--dark"
              variants={motionSet.atmosphereVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden
            >
              <div className="mobile-nav-atmosphere__inner">
                <motion.div className="relative h-full w-full blur-[56px] scale-[1.14]">
                  <Image
                    src={media.hero.src}
                    alt=""
                    fill
                    className="object-cover object-[center_24%] grayscale contrast-[1.06] brightness-[0.88]"
                    sizes="100vw"
                  />
                </motion.div>
              </div>
            </motion.div>

            <div
              className="site-header-grain pointer-events-none absolute inset-0 opacity-[0.032]"
              aria-hidden
            />

            <motion.div
              className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-8 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(58px+2.85rem)]"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={motionSet.listVariants}
            >
              <motion.div
                className={cn(
                  "mb-11 h-px w-[3.5rem] origin-left mobile-nav-accent-breathe",
                  p.accent
                )}
                variants={motionSet.accentVariants}
                aria-hidden
              />

              <ul className="flex flex-col gap-[1.75rem] sm:gap-[1.85rem]">
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={motionSet.linkVariants}
                    className="overflow-hidden"
                  >
                    <MobileNavLink
                      href={item.href}
                      label={item.label}
                      onNavigate={onClose}
                    />
                  </motion.li>
                ))}
              </ul>

              <motion.div
                variants={motionSet.ctaVariants}
                className="mt-[4.5rem] sm:mt-[5rem]"
              >
                <a
                  href="#contact"
                  onClick={onClose}
                  className={cn(
                    "group inline-flex flex-col items-start",
                    p.fgCta
                  )}
                >
                  <span className="text-[10px] font-sans font-normal uppercase tracking-[0.44em] transition-[opacity,letter-spacing] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-55 group-hover:tracking-[0.48em] group-active:opacity-72">
                    {ctaLabel}
                  </span>
                  <span
                    className={cn(
                      "mt-3 block h-px w-[5rem] origin-left scale-y-[0.35] transition-[transform,opacity] duration-[820ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[1.5] group-hover:opacity-95 group-active:scale-x-[1.25]",
                      p.ctaRule
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "mt-3.5 font-sans text-[8px] uppercase tracking-[0.36em] leading-relaxed",
                      p.fgMuted
                    )}
                  >
                    {ctaSubline}
                  </span>
                </a>
              </motion.div>

              <motion.p
                variants={motionSet.editionVariants}
                className={cn(
                  "mt-auto pt-14 font-sans text-[7px] uppercase tracking-[0.42em]",
                  p.edition
                )}
              >
                {editionMark}
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
