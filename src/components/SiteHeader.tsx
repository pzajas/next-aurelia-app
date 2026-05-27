"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import MobileNavOverlay, {
  MenuToggleIcon,
} from "@/components/MobileNavOverlay";
import {
  headerScrollTransition,
  resolveHeaderHeight,
} from "@/lib/header-metrics";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  navChrome,
  NAV_GLASS_DARK,
  resolveNavChromeTheme,
} from "@/lib/nav-glass";
import { NAV_EASE, getMobileNavCloseDurationSec, navTimings } from "@/lib/nav-motion";
import {
  isScrollLocked,
  lockScroll,
  releaseNavVisual,
  unlockScroll,
} from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 50;

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const morphTransition = { duration: 0.65, ease: easeLuxury };

const navRevealContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const navRevealItem = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeLuxury },
  },
};

const navItems = [
  { key: "atelier" as const, href: "#atelier", id: "atelier" },
  { key: "journal" as const, href: "#journal", id: "journal" },
  { key: "disciplines" as const, href: "#services", id: "services" },
  { key: "archive" as const, href: "#works", id: "works" },
  { key: "stories" as const, href: "#opinie", id: "opinie" },
  { key: "contact" as const, href: "#contact", id: "contact" },
];

const sectionIds = navItems.map((item) => item.id);

type UnderlineMetrics = { left: number; width: number } | null;

function NavLink({
  href,
  label,
  scrolled,
  registerRef,
  onNavigate,
  className,
  darkBar = false,
}: {
  href: string;
  label: string;
  scrolled: boolean;
  registerRef?: (id: string, el: HTMLAnchorElement | null) => void;
  onNavigate?: (id: string) => void;
  className?: string;
  darkBar?: boolean;
}) {
  const id = href.replace("#", "");

  return (
    <a
      ref={registerRef ? (el) => registerRef(id, el) : undefined}
      href={href}
      onClick={() => onNavigate?.(id)}
      className={cn(
        "relative text-[9px] font-sans uppercase tracking-[0.38em]",
        "transition-[opacity,letter-spacing,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "after:pointer-events-none after:absolute after:-bottom-1 after:left-1/2 after:h-px after:w-0 after:-translate-x-1/2 after:scale-y-[0.35] after:bg-white/45 after:transition-[width,opacity] after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:after:w-full hover:after:opacity-100",
        darkBar
          ? "text-white/52 hover:text-white/88 hover:tracking-[0.4em]"
          : cn(
              "opacity-90 group-hover/nav:opacity-[0.55] hover:!opacity-100 hover:tracking-[0.44em]",
              scrolled ? "text-[#141210]" : "text-white"
            ),
        className
      )}
    >
      {label}
    </a>
  );
}

function RequestAppointmentCta({
  label,
  scrolled,
  className,
  onClick,
  variant = "classic",
}: {
  label: string;
  scrolled: boolean;
  className?: string;
  onClick?: () => void;
  variant?: "classic" | "desktop-bar";
}) {
  if (variant === "desktop-bar") {
    return (
      <a
        href="#contact"
        onClick={onClick}
        data-cursor-cta
        className={cn(
          "group/cta relative inline-flex items-center gap-2.5 text-[9px] font-sans uppercase tracking-[0.36em] text-white/88",
          "transition-[opacity,color,letter-spacing] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:text-white hover:tracking-[0.4em]",
          "after:pointer-events-none after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-y-[0.35] after:bg-white/40 after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] after:content-['']",
          "after:scale-x-0 group-hover/cta:after:scale-x-100",
          className
        )}
      >
        <span className="whitespace-nowrap">{label}</span>
        <span className="text-[11px] leading-none text-white/45" aria-hidden>
          →
        </span>
      </a>
    );
  }

  return (
    <a
      href="#contact"
      onClick={onClick}
      className={cn(
        "inline-flex flex-col items-center opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:opacity-80",
        scrolled ? "text-[#141210]" : "text-white",
        className
      )}
    >
      <span className="text-[9px] font-sans uppercase tracking-[0.38em] whitespace-nowrap">
        {label}
      </span>
      <span className="mt-1.5 flex w-full justify-center" aria-hidden>
        <span
          className={cn(
            "block h-px w-[60%] origin-center scale-y-[0.35]",
            scrolled ? "bg-[#141210]/40" : "bg-white/45"
          )}
        />
      </span>
    </a>
  );
}

export default function SiteHeader() {
  const { t, copy } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [underline, setUnderline] = useState<UnderlineMetrics>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Dark menu header overlay — fades out in one pass after overlay exit */
  const [menuHeaderDark, setMenuHeaderDark] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const savedScrollYRef = useRef(0);
  const headerColorReleasedRef = useRef(false);
  const closeFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeFinishFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const registerRef = useCallback((id: string, el: HTMLAnchorElement | null) => {
    if (el) linkRefs.current.set(id, el);
    else linkRefs.current.delete(id);
  }, []);

  const clearCloseTimers = useCallback(() => {
    if (closeFallbackRef.current) {
      clearTimeout(closeFallbackRef.current);
      closeFallbackRef.current = null;
    }
    if (closeFinishFallbackRef.current) {
      clearTimeout(closeFinishFallbackRef.current);
      closeFinishFallbackRef.current = null;
    }
  }, []);

  const beginHeaderColorRelease = useCallback(() => {
    if (headerColorReleasedRef.current) return;
    headerColorReleasedRef.current = true;
    setScrolled(savedScrollYRef.current > SCROLL_THRESHOLD);
    setMenuHeaderDark(false);
    releaseNavVisual();
  }, []);

  const finishMenuClose = useCallback(() => {
    clearCloseTimers();
    beginHeaderColorRelease();
    unlockScroll();
  }, [beginHeaderColorRelease, clearCloseTimers]);

  const closeMenu = useCallback(() => {
    clearCloseTimers();
    headerColorReleasedRef.current = false;
    setMenuOpen(false);

    const colorReleaseMs = Math.max(
      0,
      (getMobileNavCloseDurationSec() - navTimings.headerReleaseLeadSec) * 1000
    );
    closeFallbackRef.current = setTimeout(beginHeaderColorRelease, colorReleaseMs);
    closeFinishFallbackRef.current = setTimeout(finishMenuClose, 600);
  }, [beginHeaderColorRelease, clearCloseTimers, finishMenuClose]);

  const handleMenuExitComplete = useCallback(() => {
    finishMenuClose();
  }, [finishMenuClose]);

  const openMenu = useCallback(() => {
    clearCloseTimers();
    headerColorReleasedRef.current = false;
    savedScrollYRef.current =
      typeof window !== "undefined"
        ? window.scrollY
        : savedScrollYRef.current;
    setMenuHeaderDark(true);
    if (!isScrollLocked()) lockScroll();
    setMenuOpen(true);
  }, [clearCloseTimers]);

  const handleMenuTouchStart = useCallback(() => {
    if (!menuOpen) {
      savedScrollYRef.current = window.scrollY;
      lockScroll();
    }
  }, [menuOpen]);

  const toggleMenu = useCallback(() => {
    if (menuOpen) closeMenu();
    else openMenu();
  }, [menuOpen, closeMenu, openMenu]);

  useLayoutEffect(() => {
    if (menuOpen && !isScrollLocked()) lockScroll();
  }, [menuOpen]);

  const mobileNavItems = navItems.map((item) => ({
    id: item.id,
    href: item.href,
    label: t(copy.nav[item.key]),
  }));

  const updateUnderline = useCallback(() => {
    if (!activeId || !navRef.current) {
      setUnderline(null);
      return;
    }

    const link = linkRefs.current.get(activeId);
    const nav = navRef.current;
    if (!link) {
      setUnderline(null);
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const lineWidth = rect.width * 0.62;
    const lineLeft = rect.left - navRect.left + (rect.width - lineWidth) / 2;

    setUnderline({ left: lineLeft, width: lineWidth });
  }, [activeId]);

  useEffect(() => {
    const onScroll = () => {
      if (isScrollLocked()) return;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      clearCloseTimers();
      if (isScrollLocked()) unlockScroll();
    };
  }, [clearCloseTimers]);

  useEffect(() => {
    if (!scrolled) setActiveId(null);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        if (!scrolled) return;

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          );

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
    return () => sectionObserver.disconnect();
  }, [scrolled]);

  useEffect(() => {
    updateUnderline();
  }, [updateUnderline, scrolled, activeId]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ro = new ResizeObserver(() => updateUnderline());
    ro.observe(nav);
    window.addEventListener("resize", updateUnderline);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateUnderline);
    };
  }, [updateUnderline]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const syncDesktop = () => setIsDesktop(mq.matches);
    syncDesktop();
    mq.addEventListener("change", syncDesktop);
    return () => mq.removeEventListener("change", syncDesktop);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) {
        clearCloseTimers();
        headerColorReleasedRef.current = false;
        setMenuOpen(false);
        setMenuHeaderDark(false);
        unlockScroll();
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [clearCloseTimers]);

  const chromeFrozen = menuOpen || menuHeaderDark;
  const scrollYForChrome = chromeFrozen
    ? savedScrollYRef.current
    : typeof window !== "undefined"
      ? window.scrollY
      : 0;
  const pageChromeTheme = resolveNavChromeTheme(
    scrolled,
    scrollYForChrome,
    SCROLL_THRESHOLD
  );
  const pageChrome = navChrome[pageChromeTheme];
  const pageHeaderSurface =
    pageChromeTheme === "light" ? pageChrome.header : null;
  const pageFgColor = pageChromeTheme === "light" ? "#141210" : "#ffffff";
  const headerFgColor = menuHeaderDark
    ? "#ffffff"
    : isDesktop
      ? "#ffffff"
      : pageFgColor;
  const menuOverlayOpacity = menuHeaderDark ? 1 : 0;
  const headerFgTransition = {
    duration: menuHeaderDark
      ? navTimings.headerSurfaceOpen
      : navTimings.headerFgClose,
    ease: NAV_EASE,
    delay: navTimings.headerFgCloseDelay,
  };
  const headerSurfaceOverlayTransition = {
    duration: menuHeaderDark
      ? navTimings.headerSurfaceOpen
      : navTimings.headerSurfaceClose,
    ease: NAV_EASE,
    delay: navTimings.headerSurfaceCloseDelay,
  };
  const headerSurfaceTransition =
    "background 480ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 480ms cubic-bezier(0.22, 1, 0.36, 1), border-color 480ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1)";
  const headerSurfaceStyle = {
    background: pageHeaderSurface?.background ?? "transparent",
    backdropFilter: pageHeaderSurface?.backdropFilter ?? "none",
    WebkitBackdropFilter: pageHeaderSurface?.WebkitBackdropFilter ?? "none",
    borderBottom: pageHeaderSurface?.borderBottom ?? "1px solid transparent",
    boxShadow: pageHeaderSurface?.boxShadow ?? "none",
  };
  const mobilePageGrainOpacity =
    pageChromeTheme === "light" && pageHeaderSurface ? 0.028 : 0;

  const desktopHeaderVisible = isDesktop && scrolled && !menuHeaderDark;
  const mobileHeaderVisible =
    !isDesktop && scrolled && !menuHeaderDark && Boolean(pageHeaderSurface);
  const headerHeight = resolveHeaderHeight(isDesktop, scrolled);
  const logoScale = 1;
  const underlineBottom = isDesktop
    ? desktopHeaderVisible
      ? 11
      : 16
    : 14;

  const desktopGlassStyle = {
    background: NAV_GLASS_DARK.background,
    backdropFilter: NAV_GLASS_DARK.backdropFilter,
    WebkitBackdropFilter: NAV_GLASS_DARK.WebkitBackdropFilter,
    boxShadow: NAV_GLASS_DARK.boxShadow,
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--site-header-height",
      `${headerHeight}px`
    );
    return () => {
      document.documentElement.style.removeProperty("--site-header-height");
    };
  }, [headerHeight]);

  return (
    <>
      <motion.header
        className={cn(
          "top-0 z-[250] w-full min-w-0 isolate",
          "max-md:fixed max-md:left-0 max-md:right-0",
          "md:sticky"
        )}
        style={{
          height: headerHeight,
          color: headerFgColor,
        }}
        initial={false}
        animate={{ color: headerFgColor }}
        transition={{
          color: headerFgTransition,
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] hidden will-change-[opacity,backdrop-filter] md:block"
          style={desktopGlassStyle}
          initial={false}
          animate={{ opacity: desktopHeaderVisible ? 1 : 0 }}
          transition={headerScrollTransition}
          aria-hidden
        />

        <motion.div
          className="site-header-grain pointer-events-none absolute inset-0 z-[2] hidden md:block"
          initial={false}
          animate={{ opacity: desktopHeaderVisible ? 0.028 : 0 }}
          transition={headerScrollTransition}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] hidden h-px bg-white/10 md:block"
          initial={false}
          animate={{ opacity: desktopHeaderVisible ? 1 : 0 }}
          transition={headerScrollTransition}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 z-[1] will-change-[opacity,backdrop-filter] md:hidden"
          initial={false}
          animate={{ opacity: mobileHeaderVisible ? 1 : 0 }}
          transition={headerSurfaceOverlayTransition}
          style={headerSurfaceStyle}
          aria-hidden
        />

        <motion.div
          className="mobile-nav-header-match pointer-events-none absolute inset-0 z-[2] md:hidden"
          initial={false}
          animate={{ opacity: menuOverlayOpacity }}
          transition={headerSurfaceOverlayTransition}
          aria-hidden={!menuHeaderDark}
        />

        <motion.div
          className="site-header-grain pointer-events-none absolute inset-0 z-[3] md:hidden"
          initial={false}
          animate={{
            opacity: menuHeaderDark ? 0.032 : mobilePageGrainOpacity,
          }}
          transition={headerSurfaceOverlayTransition}
          aria-hidden
        />

        <nav
          ref={navRef}
          className="relative z-10 grid h-full min-w-0 grid-cols-[1fr_auto] items-center gap-4 px-6 md:flex md:px-8 lg:px-10"
          aria-label="Main navigation"
        >
          <motion.div
            className="flex shrink-0 items-center justify-self-start md:gap-7 lg:gap-8"
            animate={{ scale: logoScale }}
            transition={headerScrollTransition}
            style={{ transformOrigin: "left center" }}
          >
            <Link
              href="/"
              onClick={closeMenu}
              className={cn(
                "text-[10px] uppercase transition-opacity duration-[650ms] hover:opacity-65",
                "font-sans tracking-[0.52em]",
                "md:font-serif md:text-[11px] md:tracking-[0.22em] md:text-white/95"
              )}
              style={{
                color: "inherit",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              AURELIA
            </Link>

            <span
              className="hidden h-3.5 w-px shrink-0 bg-white/14 md:block"
              aria-hidden
            />
          </motion.div>

          <motion.ul
            className={cn(
              "group/nav hidden min-w-0 flex-1 items-center justify-center md:flex",
              "transition-[gap] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              desktopHeaderVisible
                ? "gap-5 lg:gap-6 xl:gap-7"
                : "gap-6 lg:gap-8 xl:gap-9"
            )}
            variants={navRevealContainer}
            initial="hidden"
            animate="show"
          >
            {navItems.map((item) => (
              <motion.li key={item.id} variants={navRevealItem}>
                <NavLink
                  href={item.href}
                  label={t(copy.nav[item.key])}
                  scrolled={scrolled}
                  registerRef={registerRef}
                  onNavigate={setActiveId}
                  darkBar
                />
              </motion.li>
            ))}
          </motion.ul>

          <div className="ml-8 hidden shrink-0 md:block lg:ml-10">
            <RequestAppointmentCta
              label={t(copy.nav.requestAppointment)}
              scrolled={scrolled}
              variant="desktop-bar"
            />
          </div>

          <button
            type="button"
            className={cn(
              "relative flex h-10 w-10 items-center justify-center md:hidden",
              "outline-none [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none"
            )}
            style={{ color: "inherit" }}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t(copy.nav.close) : t(copy.nav.menu)}
            onTouchStart={handleMenuTouchStart}
            onClick={toggleMenu}
          >
            <MenuToggleIcon open={menuOpen} />
          </button>

          {underline && (
            <motion.span
              className="pointer-events-none absolute hidden h-px origin-center scale-y-[0.35] bg-white/40 md:block"
              initial={false}
              animate={{
                left: underline.left,
                width: underline.width,
                opacity: 1,
              }}
              transition={morphTransition}
              style={{ bottom: underlineBottom }}
              aria-hidden
            />
          )}
        </nav>
      </motion.header>

      <MobileNavOverlay
        open={menuOpen}
        items={mobileNavItems}
        ctaLabel={t(copy.nav.requestAppointment)}
        ctaSubline={t(copy.nav.ctaSubline)}
        editionMark={t(copy.nav.editionMark)}
        onClose={closeMenu}
        onExitComplete={handleMenuExitComplete}
      />
    </>
  );
}
