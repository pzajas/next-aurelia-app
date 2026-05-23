"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy } from "./copy";
import { t as translate, tLines } from "./index";
import { defaultLocale, type Bilingual, type Locale } from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (entry: Bilingual) => string;
  tLines: (lines: readonly Bilingual[]) => string[];
  copy: typeof copy;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  const t = useCallback(
    (entry: Bilingual) => translate(entry, locale),
    [locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      tLines: (lines) => tLines(lines, locale),
      copy,
    }),
    [locale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: (entry: Bilingual) => translate(entry, defaultLocale),
      tLines: (lines: readonly Bilingual[]) => tLines(lines, defaultLocale),
      copy,
    };
  }
  return ctx;
}
