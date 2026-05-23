"use client";

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

export const HERO_POST_INTRO_DELAY_MS = 500;

type RevealHeroOptions = {
  immediate?: boolean;
};

type IntroRevealContextValue = {
  deferHeroEntrance: boolean;
  entranceFromIntro: boolean;
  revealHero: (options?: RevealHeroOptions) => void;
};

const IntroRevealContext = createContext<IntroRevealContextValue>({
  deferHeroEntrance: false,
  entranceFromIntro: false,
  revealHero: () => {},
});

export function useIntroReveal() {
  return useContext(IntroRevealContext);
}

export function IntroRevealProvider({ children }: { children: ReactNode }) {
  const [deferHeroEntrance, setDeferHeroEntrance] = useState(false);
  const [entranceFromIntro, setEntranceFromIntro] = useState(false);
  const revealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (document.documentElement.dataset.intro === "1") {
      setDeferHeroEntrance(true);
      setEntranceFromIntro(true);
    }
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
  }, []);

  const revealHero = useCallback((options?: RevealHeroOptions) => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);

    const delay = options?.immediate ? 0 : HERO_POST_INTRO_DELAY_MS;
    if (delay === 0) {
      setDeferHeroEntrance(false);
      return;
    }

    revealTimeoutRef.current = setTimeout(() => {
      setDeferHeroEntrance(false);
      revealTimeoutRef.current = null;
    }, delay);
  }, []);

  const value = useMemo(
    () => ({ deferHeroEntrance, entranceFromIntro, revealHero }),
    [deferHeroEntrance, entranceFromIntro, revealHero]
  );

  return (
    <IntroRevealContext.Provider value={value}>
      {children}
    </IntroRevealContext.Provider>
  );
}
