import { defaultLocale, type Bilingual, type Locale } from "./types";
import { copy } from "./copy";

export { copy, defaultLocale };
export type { Bilingual, Locale };

export function t(entry: Bilingual, locale: Locale = defaultLocale): string {
  return entry[locale];
}

export function tLines(
  lines: readonly Bilingual[],
  locale: Locale = defaultLocale
): string[] {
  return lines.map((line) => t(line, locale));
}
