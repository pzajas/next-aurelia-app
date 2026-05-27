"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const STORAGE_KEY = "aurelia:cookies-accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const preferences = () => {
    localStorage.setItem(STORAGE_KEY, "minimal");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 left-[max(2rem,calc((100vw-72rem)/2))] z-9998"
        >
          <div className="border border-white/15 bg-black/90 backdrop-blur-md px-10 py-8 text-center max-w-md">
            <p className="font-serif italic text-[15px] leading-relaxed text-white/80 mb-8">
              Ta strona używa minimalnych plików cookies
              w&nbsp;celach analitycznych i&nbsp;dla poprawy
              Twojego doświadczenia.
            </p>
            <div className="flex items-center justify-center gap-0">
              <button
                onClick={preferences}
                className="font-sans text-[12px] uppercase tracking-[0.2em] text-white/60 hover:text-white/90 transition-colors duration-300 px-6 py-2"
              >
                Preferencje
              </button>
              <span className="h-4 w-px bg-white/20" />
              <button
                onClick={accept}
                className="font-sans text-[12px] uppercase tracking-[0.2em] text-white/90 hover:text-white transition-colors duration-300 px-6 py-2"
              >
                Akceptuję
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
