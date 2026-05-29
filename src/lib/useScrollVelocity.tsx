"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ScrollVelocityContextValue = {
  /** 0 = slow scroll, 1 = fast scroll (smoothed) */
  normalized: number;
  /** Peak-aware sample for locking row choreography */
  sampleForReveal: () => number;
};

const ScrollVelocityContext = createContext<ScrollVelocityContextValue>({
  normalized: 0,
  sampleForReveal: () => 0,
});

export function ScrollVelocityProvider({ children }: { children: ReactNode }) {
  const [normalized, setNormalized] = useState(0);
  const smoothedRef = useRef(0);
  const instantRef = useRef(0);
  const peakRef = useRef(0);

  const sampleForReveal = useCallback(() => {
    return Math.min(
      1,
      Math.max(smoothedRef.current, instantRef.current, peakRef.current)
    );
  }, []);

  useEffect(() => {
    let lastY =
      window.scrollY || document.documentElement.scrollTop || 0;
    let lastT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const dy = Math.abs(y - lastY);
      const dt = Math.max(now - lastT, 16);
      const pxPerMs = dy / dt;

      const raw = Math.min(1, Math.max(0, (pxPerMs - 0.06) / 0.72));
      instantRef.current = raw;
      smoothedRef.current = smoothedRef.current * 0.7 + raw * 0.3;
      peakRef.current = Math.max(peakRef.current * 0.9, raw);
      setNormalized(smoothedRef.current);

      lastY = y;
      lastT = now;
    };

    const decayPeak = window.setInterval(() => {
      peakRef.current *= 0.82;
    }, 120);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(decayPeak);
    };
  }, []);

  return (
    <ScrollVelocityContext.Provider value={{ normalized, sampleForReveal }}>
      {children}
    </ScrollVelocityContext.Provider>
  );
}

export function useScrollVelocity() {
  return useContext(ScrollVelocityContext).normalized;
}

export function useScrollVelocityReveal() {
  const ctx = useContext(ScrollVelocityContext);
  return ctx.sampleForReveal;
}
