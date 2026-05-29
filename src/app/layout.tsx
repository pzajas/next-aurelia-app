import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import Script from "next/script";
import AppChrome from "@/components/AppChrome";
import HeroPreloadLinks from "@/components/HeroPreloadLinks";
import SessionIntro from "@/components/SessionIntro";

const CinematicCursor = dynamic(() => import("@/components/CinematicCursor"));
const CookieConsent = dynamic(() => import("@/components/CookieConsent"));
import { IntroRevealProvider } from "@/lib/intro/IntroRevealContext";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { copy, t } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n/types";
import "./globals.css";

const INTRO_BOOT_SCRIPT = `try{if(!sessionStorage.getItem("aurelia:intro-seen")){document.documentElement.setAttribute("data-intro","1")}}catch(e){}`;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: t(copy.meta.title, defaultLocale),
  description: t(copy.meta.description, defaultLocale),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <HeroPreloadLinks />
      </head>
      <body className="min-h-full overflow-x-clip" suppressHydrationWarning>
        <Script id="aurelia-session-intro" strategy="beforeInteractive">
          {INTRO_BOOT_SCRIPT}
        </Script>
        <LocaleProvider initialLocale={defaultLocale}>
          <IntroRevealProvider>
            <SessionIntro />
            <CinematicCursor />
            <AppChrome>{children}</AppChrome>
            <CookieConsent />
          </IntroRevealProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
