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
    <a
      href={href}
      onClick={onNavigate}
      className="group block py-[clamp(0.06rem,0.55svh,0.44rem)]"
    >
      <span
        className={cn(
          "block font-serif text-[clamp(1.45rem,4.4svh,2.4rem)] font-light",
          "leading-[1.18] tracking-[0.015em]",
          "transition-[opacity,letter-spacing] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:opacity-[0.62] group-hover:tracking-[0.022em]",
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
        panelVariants: fade(0.3, 0.04),
        atmosphereVariants: fade(0.2, 0.06),
        listVariants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
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
            ease: NAV_EASE,
          },
        },
      } satisfies Variants,

      panelVariants: {
        hidden: { y: 0, clipPath: "inset(0% 0% 100% 0%)" },
        visible: {
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          transition: {
            duration: 0.74,
            delay: 0.03,
            ease: NAV_EASE,
          },
        },
        exit: {
          y: 0,
          clipPath: "inset(0% 0% 100% 0%)",
          transition: {
            duration: 0.6,
            delay: 0.01,
            ease: NAV_EASE,
          },
        },
      } satisfies Variants,

      atmosphereVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.88,
            delay: 0.18,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            duration: 0.36,
            ease: NAV_EASE,
          },
        },
      } satisfies Variants,

      listVariants: {
        hidden: { opacity: 0, y: 14 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: 0.075,
            delayChildren: 0.44,
          },
        },
        exit: {
          opacity: 0,
          y: 0,
          transition: {
            staggerChildren: 0.03,
            staggerDirection: -1,
          },
        },
      } satisfies Variants,

      linkVariants: {
        hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.64, ease: NAV_EASE },
        },
        exit: {
          opacity: 0,
          y: -2,
          filter: "blur(6px)",
          transition: { duration: 0.32, ease: NAV_EASE },
        },
      } satisfies Variants,

      accentVariants: {
        hidden: { scaleX: 0, opacity: 0 },
        visible: {
          scaleX: 1,
          opacity: 0.6,
          transition: {
            duration: 0.64,
            delay: 0.72,
            ease: NAV_EASE,
          },
        },
        exit: {
          scaleX: 0,
          opacity: 0,
          transition: { duration: 0.24, ease: NAV_EASE },
        },
      } satisfies Variants,

      ctaVariants: {
        hidden: { opacity: 0, y: 20, filter: "blur(7px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.68,
            delay: 0.46 + items.length * 0.075 + 0.18,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          y: -2,
          filter: "blur(6px)",
          transition: { duration: 0.28, ease: NAV_EASE },
        },
      } satisfies Variants,

      editionVariants: {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.56,
            delay: 0.52 + items.length * 0.075 + 0.24,
            ease: NAV_EASE,
          },
        },
        exit: {
          opacity: 0,
          transition: { duration: 0.2, ease: NAV_EASE },
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
            className="fixed inset-x-0 bottom-0 top-[var(--site-header-height,58px)] z-[180] bg-[#0A0A0A] md:hidden outline-none [-webkit-tap-highlight-color:transparent]"
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
            className="fixed inset-x-0 bottom-0 top-[var(--site-header-height,58px)] z-[185] flex flex-col overflow-hidden border-0 outline-none md:hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={motionSet.panelVariants}
          >
            <motion.div className="mobile-nav-depth" aria-hidden />
            <motion.div className="mobile-nav-depth__vignette" aria-hidden />

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
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                </motion.div>
              </div>
            </motion.div>

            <div
              className="site-header-grain pointer-events-none absolute inset-0 opacity-[0.032]"
              aria-hidden
            />

            <motion.div
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:pt-8"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={motionSet.listVariants}
            >
              <div className="flex min-h-0 flex-1 flex-col justify-between">
                <div className="min-h-0">
                  <motion.div
                    className={cn(
                      "mb-[clamp(0.7rem,2.6svh,1.8rem)] h-px w-12 origin-left mobile-nav-accent-breathe",
                      p.accent
                    )}
                    variants={motionSet.accentVariants}
                    aria-hidden
                  />

                  <ul className="flex min-h-0 flex-col justify-center gap-[clamp(0.5rem,1.8svh,1.35rem)]">
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
                    className="mt-[clamp(0.85rem,3svh,2.2rem)] border-t border-white/8 pt-[clamp(0.7rem,2.2svh,1.25rem)]"
                  >
                    <a
                      href="#contact"
                      onClick={onClose}
                      className={cn(
                        "group inline-flex flex-col items-start",
                        p.fgCta
                      )}
                    >
                      <span className="text-[11px] font-sans font-normal uppercase tracking-[0.4em] transition-[opacity,letter-spacing] duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-60 group-hover:tracking-[0.44em] group-active:opacity-72">
                        {ctaLabel}
                      </span>
                      <span
                        className={cn(
                          "mt-[clamp(0.4rem,1.2svh,0.75rem)] block h-px w-20 origin-left scale-y-[0.35] transition-[transform,opacity] duration-[860ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-[1.3] group-hover:opacity-90 group-active:scale-x-[1.15]",
                          p.ctaRule
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "mt-[clamp(0.35rem,1.2svh,0.8rem)] font-sans text-[10px] uppercase tracking-[0.34em] leading-relaxed",
                          p.fgMuted
                        )}
                      >
                        {ctaSubline}
                      </span>
                    </a>
                  </motion.div>
                </div>

                <motion.p
                  variants={motionSet.editionVariants}
                  className={cn(
                    "pt-[clamp(0.4rem,1.6svh,0.9rem)] font-sans text-[10px] uppercase tracking-[0.4em]",
                    p.edition
                  )}
                >
                  {editionMark}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
