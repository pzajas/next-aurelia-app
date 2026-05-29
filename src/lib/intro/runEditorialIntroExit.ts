import {
  INTRO_LINE_MS,
  INTRO_PINCH_MS,
  INTRO_ROLL_UP_MS,
  INTRO_TEXT_EXIT_MS,
  SITE_MAX_WIDTH_PX,
} from "@/lib/intro/timing";
import { scrollPageToTop } from "@/lib/intro/scrollPageToTop";
import gsap from "gsap";

export type EditorialIntroRefs = {
  curtain: HTMLElement;
  content: HTMLElement;
  meta: HTMLElement;
  line: HTMLElement;
};

export type EditorialIntroCallbacks = {
  onRollUpStart: () => void;
  onComplete: () => void;
};

export function runEditorialIntroExit(
  refs: EditorialIntroRefs,
  callbacks: EditorialIntroCallbacks,
  reducedMotion: boolean
): gsap.core.Timeline {
  const targetWidth = Math.min(SITE_MAX_WIDTH_PX, window.innerWidth);
  const pinchEnd = INTRO_PINCH_MS / 1000;

  if (reducedMotion) {
    scrollPageToTop();
    callbacks.onRollUpStart();
    gsap.set(refs.curtain, { y: "-100%" });
    callbacks.onComplete();
    return gsap.timeline();
  }

  const startWidth = window.innerWidth;

  gsap.set(refs.line, { scaleY: 0, transformOrigin: "top center" });
  gsap.set(refs.curtain, {
    width: startWidth,
    maxWidth: startWidth,
    marginLeft: "auto",
    marginRight: "auto",
  });

  const tl = gsap.timeline({
    onComplete: () => {
      scrollPageToTop();
      callbacks.onComplete();
    },
  });

  tl.to(
    refs.curtain,
    {
      width: targetWidth,
      maxWidth: targetWidth,
      duration: pinchEnd,
      ease: "power3.inOut",
    },
    0
  );

  tl.to(
    refs.meta,
    {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
    },
    pinchEnd
  );

  tl.to(
    refs.content,
    {
      y: -140,
      opacity: 0,
      duration: INTRO_TEXT_EXIT_MS / 1000,
      ease: "power2.in",
    },
    pinchEnd + 0.05
  );

  const lineStart = pinchEnd + INTRO_TEXT_EXIT_MS / 1000 + 0.05;

  tl.to(
    refs.line,
    {
      scaleY: 1,
      duration: INTRO_LINE_MS / 1000,
      ease: "power2.inOut",
    },
    lineStart
  );

  const rollStart = lineStart + INTRO_LINE_MS / 1000;

  tl.add(() => {
    scrollPageToTop();
    callbacks.onRollUpStart();
  }, rollStart);

  tl.to(
    refs.curtain,
    {
      yPercent: -100,
      duration: INTRO_ROLL_UP_MS / 1000,
      ease: "power4.in",
    },
    rollStart
  );

  return tl;
}
