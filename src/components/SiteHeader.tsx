"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 50;
const HEADER_HEIGHT = 58;

const navItems = [
  { key: "atelier" as const, href: "#atelier", id: "atelier" },
  { key: "journal" as const, href: "#journal", id: "journal" },
  { key: "disciplines" as const, href: "#services", id: "services" },
  { key: "archive" as const, href: "#works", id: "works" },
  { key: "stories" as const, href: "#opinie", id: "opinie" },
  { key: "contact" as const, href: "#contact", id: "contact" },
];

const sectionIds = navItems.map((item) => item.id);

const easeLuxury = [0.22, 1, 0.36, 1] as const;
const morphTransition = { duration: 0.65, ease: easeLuxury };

type UnderlineMetrics = { left: number; width: number } | null;

function NavLink({
  href,
  label,
  scrolled,
  registerRef,
  onNavigate,
  className,
}: {
  href: string;
  label: string;
  scrolled: boolean;
  registerRef?: (id: string, el: HTMLAnchorElement | null) => void;
  onNavigate?: (id: string) => void;
  className?: string;
}) {
  const id = href.replace("#", "");

  return (
    <a
      ref={registerRef ? (el) => registerRef(id, el) : undefined}
      href={href}
      onClick={() => onNavigate?.(id)}
      className={cn(
        "relative text-[9px] font-sans uppercase tracking-[0.38em]",
        "opacity-90 transition-[opacity,letter-spacing] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "group-hover/nav:opacity-[0.55] hover:!opacity-100 hover:tracking-[0.44em]",
        scrolled ? "text-[#141210]" : "text-white",
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
}: {
  label: string;
  scrolled: boolean;
  className?: string;
  onClick?: () => void;
}) {
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

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  const registerRef = useCallback((id: string, el: HTMLAnchorElement | null) => {
    if (el) linkRefs.current.set(id, el);
    else linkRefs.current.delete(id);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

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
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

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
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const headerSolid = scrolled || menuOpen;
  const headerFg = headerSolid ? "text-[#141210]" : "text-white";

  return (
    <header
      className={cn(
        "top-0 z-[100] w-full min-w-0 isolate",
        menuOpen ? "fixed left-0 right-0 md:sticky" : "sticky"
      )}
      style={{ height: HEADER_HEIGHT }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: headerSolid ? "rgba(250, 248, 245, 0.72)" : "transparent",
          backdropFilter: headerSolid ? "blur(14px)" : "none",
          WebkitBackdropFilter: headerSolid ? "blur(14px)" : "none",
          borderBottom: headerSolid
            ? "1px solid rgba(0, 0, 0, 0.06)"
            : "1px solid transparent",
          boxShadow: headerSolid
            ? "0 2px 20px rgba(0, 0, 0, 0.03)"
            : "none",
          transition:
            "background 650ms cubic-bezier(0.22, 1, 0.36, 1), backdrop-filter 650ms cubic-bezier(0.22, 1, 0.36, 1), border-color 650ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 650ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      <div
        className="site-header-grain pointer-events-none absolute inset-0"
        style={{
          opacity: headerSolid ? 0.028 : 0,
          transition: "opacity 650ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        aria-hidden
      />

      <nav
        ref={navRef}
        className="relative grid h-full min-w-0 grid-cols-[1fr_auto] items-center gap-4 px-6 md:grid-cols-[1fr_auto_1fr] md:px-10"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={cn(
            "justify-self-start text-[10px] font-sans uppercase tracking-[0.52em] transition-all duration-[650ms] hover:opacity-65",
            headerFg
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          AURELIA
        </Link>

        <ul className="group/nav hidden justify-self-center md:flex items-center gap-7 md:gap-9 lg:gap-11">
          {navItems.map((item) => (
            <li key={item.id}>
              <NavLink
                href={item.href}
                label={t(copy.nav[item.key])}
                scrolled={scrolled}
                registerRef={registerRef}
                onNavigate={setActiveId}
              />
            </li>
          ))}
        </ul>

        <div className="justify-self-end hidden md:block">
          <RequestAppointmentCta
            label={t(copy.nav.requestAppointment)}
            scrolled={scrolled}
          />
        </div>

        <button
          type="button"
          className={cn(
            "justify-self-end md:hidden text-[9px] font-sans uppercase tracking-[0.38em] transition-opacity duration-500 hover:opacity-70",
            headerFg
          )}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? t(copy.nav.close) : t(copy.nav.menu)}
        </button>

        {underline && (
          <motion.span
            className={cn(
              "pointer-events-none absolute hidden h-px origin-center scale-y-[0.35] md:block",
              scrolled ? "bg-[#141210]" : "bg-white"
            )}
            initial={false}
            animate={{
              left: underline.left,
              width: underline.width,
              opacity: 1,
            }}
            transition={morphTransition}
            style={{ bottom: 14 }}
            aria-hidden
          />
        )}
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label={t(copy.nav.menu)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeLuxury }}
            className="fixed inset-0 z-40 flex flex-col bg-[#FAF8F5]/98 md:hidden"
            style={{ paddingTop: HEADER_HEIGHT }}
          >
            <div className="flex shrink-0 items-center justify-end px-8 pb-2">
              <button
                type="button"
                onClick={closeMenu}
                className="text-[9px] font-sans uppercase tracking-[0.38em] text-[#141210] transition-opacity duration-500 hover:opacity-70"
              >
                {t(copy.nav.close)}
              </button>
            </div>

            <ul className="flex flex-1 flex-col gap-8 overflow-y-auto px-8 pb-12 border-t border-[#141210]/10 pt-8">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.06 + index * 0.07,
                    ease: easeLuxury,
                  }}
                >
                  <NavLink
                    href={item.href}
                    label={t(copy.nav[item.key])}
                    scrolled
                    className="text-[11px] tracking-[0.42em] text-[#141210]"
                    onNavigate={closeMenu}
                  />
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: easeLuxury }}
              className="mt-12"
            >
              <RequestAppointmentCta
                label={t(copy.nav.requestAppointment)}
                scrolled
                className="text-[#141210]"
                onClick={closeMenu}
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
