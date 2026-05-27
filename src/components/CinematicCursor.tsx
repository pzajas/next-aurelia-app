"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LERP = 0.18;
const DOT_SIZE = 7;
const DOT_EXPANDED = 44;
const MAGNETIC_RADIUS = 90;
const MAGNETIC_STRENGTH = 0.22;
const CTA_SHIFT_MAX = 2.5;

type CursorMode = "default" | "hover" | "gallery" | "cta";

export default function CinematicCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const rafId = useRef(0);
  const modeRef = useRef<CursorMode>("default");
  const ctaElRef = useRef<Element | null>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [labelText, setLabelText] = useState("");
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const touch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouch(touch);
  }, []);

  const resetCtaTransforms = useCallback(() => {
    if (ctaElRef.current) {
      const el = ctaElRef.current as HTMLElement;
      el.style.removeProperty("--cta-tx");
      el.style.removeProperty("--cta-ty");
    }
    ctaElRef.current = null;
  }, []);

  const resolveMode = useCallback(
    (el: Element | null) => {
      if (!el) {
        if (modeRef.current !== "default") {
          modeRef.current = "default";
          setMode("default");
          setLabelText("");
          resetCtaTransforms();
        }
        return;
      }

      const gallery = el.closest("[data-cursor-gallery]");
      if (gallery) {
        if (modeRef.current !== "gallery") {
          resetCtaTransforms();
          modeRef.current = "gallery";
          setMode("gallery");
          setLabelText(gallery.getAttribute("data-cursor-label") || "VIEW");
        }
        return;
      }

      const cta = el.closest("[data-cursor-cta]");
      if (cta) {
        if (modeRef.current !== "cta" || ctaElRef.current !== cta) {
          resetCtaTransforms();
          ctaElRef.current = cta;
          modeRef.current = "cta";
          setMode("cta");
          setLabelText("");
        }
        return;
      }

      const interactive = el.closest("a, button, [data-cursor-magnetic]");
      if (interactive) {
        if (modeRef.current !== "hover") {
          resetCtaTransforms();
          modeRef.current = "hover";
          setMode("hover");
          setLabelText("");
        }
        return;
      }

      if (modeRef.current !== "default") {
        modeRef.current = "default";
        setMode("default");
        setLabelText("");
        resetCtaTransforms();
      }
    },
    [resetCtaTransforms]
  );

  useEffect(() => {
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
      resolveMode(document.elementFromPoint(e.clientX, e.clientY));
    };

    const onLeave = () => {
      setVisible(false);
      resetCtaTransforms();
    };
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouch, visible, resolveMode, resetCtaTransforms]);

  useEffect(() => {
    if (isTouch) return;

    const tick = () => {
      let tx = mouse.current.x;
      let ty = mouse.current.y;

      if (modeRef.current === "hover") {
        const hovered = document.elementFromPoint(mouse.current.x, mouse.current.y);
        const target = hovered?.closest("a, button, [data-cursor-magnetic]");
        if (target) {
          const r = target.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = cx - mouse.current.x;
          const dy = cy - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAGNETIC_RADIUS) {
            const f = (1 - dist / MAGNETIC_RADIUS) * MAGNETIC_STRENGTH;
            tx += dx * f;
            ty += dy * f;
          }
        }
      }

      pos.current.x += (tx - pos.current.x) * LERP;
      pos.current.y += (ty - pos.current.y) * LERP;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${pos.current.x + 18}px, ${pos.current.y + 18}px, 0)`;
      }

      if (modeRef.current === "cta" && ctaElRef.current) {
        const el = ctaElRef.current as HTMLElement;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = ((mouse.current.x - cx) / (r.width / 2)) * CTA_SHIFT_MAX;
        const dy = ((mouse.current.y - cy) / (r.height / 2)) * CTA_SHIFT_MAX;
        el.style.setProperty("--cta-tx", `${dx.toFixed(2)}px`);
        el.style.setProperty("--cta-ty", `${dy.toFixed(2)}px`);
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isTouch]);

  if (isTouch) return null;

  const scale =
    mode === "gallery"
      ? DOT_EXPANDED / DOT_SIZE
      : mode === "hover" || mode === "cta"
        ? 1.5
        : 1;

  const opacity = !visible
    ? 0
    : mode === "gallery"
      ? 0.07
      : 0.82;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          willChange: "transform",
          mixBlendMode: "difference",
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "#fff",
            transform: `scale(${scale})`,
            opacity,
            transition:
              "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>

      <div
        ref={labelRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ willChange: "transform" }}
      >
        <span
          className="block font-serif text-[10px] uppercase tracking-[0.35em]"
          style={{
            color: "rgba(250,247,243,0.72)",
            opacity: mode === "gallery" ? 1 : 0,
            transform:
              mode === "gallery" ? "translateY(0)" : "translateY(3px)",
            transition:
              "opacity 0.45s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {labelText}
        </span>
      </div>
    </>
  );
}
