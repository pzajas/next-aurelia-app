"use client";

import {
  HERO_COPY_AFTER_IMAGE_MS,
  HERO_IMAGE_AFTER_INTRO_MS,
} from "@/lib/intro/timing";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type RevealOptions = {
  immediate?: boolean;
  /** Skip post-intro delay — handoff from intro peek layer */
  afterIntroComplete?: boolean;
};

type IntroRevealContextValue = {
  deferHeroImage: boolean;
  deferHeroCopy: boolean;
  heroIntroPeek: boolean;
  entranceFromIntro: boolean;
  peekHeroUnderIntro: () => void;
  revealHeroImage: (options?: RevealOptions) => void;
  revealHeroCopy: (options?: RevealOptions) => void;
  /** @deprecated use revealHeroImage + revealHeroCopy */
  revealHero: (options?: RevealOptions) => void;
};

const IntroRevealContext = createContext<IntroRevealContextValue>({
  deferHeroImage: false,
  deferHeroCopy: false,
  heroIntroPeek: false,
  entranceFromIntro: false,
  peekHeroUnderIntro: () => {},
  revealHeroImage: () => {},
  revealHeroCopy: () => {},
  revealHero: () => {},
});

export function useIntroReveal() {
  return useContext(IntroRevealContext);
}

export function IntroRevealProvider({ children }: { children: ReactNode }) {
  const [deferHeroImage, setDeferHeroImage] = useState(false);
  const [deferHeroCopy, setDeferHeroCopy] = useState(false);
  const [heroIntroPeek, setHeroIntroPeek] = useState(false);
  const [entranceFromIntro, setEntranceFromIntro] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "1") {
      setDeferHeroImage(true);
      setDeferHeroCopy(true);
      setEntranceFromIntro(true);
    }
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);
    };
  }, []);

  const peekHeroUnderIntro = useCallback(() => {
    setHeroIntroPeek(true);
  }, []);

  const revealHeroCopy = useCallback((options?: RevealOptions) => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    if (options?.immediate) {
      setDeferHeroCopy(false);
      return;
    }
    setDeferHeroCopy(false);
  }, []);

  const startHeroCopyTimer = useCallback(() => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => {
      setDeferHeroCopy(false);
      copyTimerRef.current = null;
    }, HERO_COPY_AFTER_IMAGE_MS);
  }, []);

  const revealHeroImage = useCallback(
    (options?: RevealOptions) => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      if (imageTimerRef.current) clearTimeout(imageTimerRef.current);

      if (options?.immediate) {
        setHeroIntroPeek(false);
        setDeferHeroImage(false);
        setDeferHeroCopy(false);
        return;
      }

      if (options?.afterIntroComplete) {
        requestAnimationFrame(() => {
          setHeroIntroPeek(false);
          setDeferHeroImage(false);
          startHeroCopyTimer();
        });
        return;
      }

      const runImageReveal = () => {
        requestAnimationFrame(() => {
          setHeroIntroPeek(false);
          setDeferHeroImage(false);
          startHeroCopyTimer();
        });
      };

      if (HERO_IMAGE_AFTER_INTRO_MS <= 0) {
        runImageReveal();
        return;
      }

      imageTimerRef.current = setTimeout(() => {
        imageTimerRef.current = null;
        runImageReveal();
      }, HERO_IMAGE_AFTER_INTRO_MS);
    },
    [startHeroCopyTimer]
  );

  const revealHero = useCallback(
    (options?: RevealOptions) => {
      revealHeroImage(options);
    },
    [revealHeroImage]
  );

  const value = useMemo(
    () => ({
      deferHeroImage,
      deferHeroCopy,
      heroIntroPeek,
      entranceFromIntro,
      peekHeroUnderIntro,
      revealHeroImage,
      revealHeroCopy,
      revealHero,
    }),
    [
      deferHeroImage,
      deferHeroCopy,
      heroIntroPeek,
      entranceFromIntro,
      peekHeroUnderIntro,
      revealHeroImage,
      revealHeroCopy,
      revealHero,
    ]
  );

  return (
    <IntroRevealContext.Provider value={value}>
      {children}
    </IntroRevealContext.Provider>
  );
}
