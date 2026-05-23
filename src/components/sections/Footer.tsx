import Link from "next/link";
import { copy, t } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n/types";

const locale = defaultLocale;

const footerLinks = [
  { key: "atelier" as const, href: "#atelier" },
  { key: "journal" as const, href: "#journal" },
  { key: "disciplines" as const, href: "#services" },
  { key: "archive" as const, href: "#works" },
  { key: "stories" as const, href: "#opinie" },
  { key: "contact" as const, href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-background">
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.5em] text-foreground">
              AURELIA
            </div>
            <div className="text-[9px] font-sans uppercase text-foreground/40 mt-1">
              {t(copy.footer.tagline, locale)}
            </div>
          </div>

          <div className="text-left md:text-center space-x-2">
            {footerLinks.map((item, i) => (
              <span key={item.key}>
                <Link
                  href={item.href}
                  className="text-[9px] font-sans uppercase text-foreground/50 leading-relaxed tracking-[0.25em] hover:text-foreground/70 transition-colors"
                >
                  {t(copy.nav[item.key], locale)}
                </Link>
                {i < footerLinks.length - 1 && (
                  <span className="text-[9px] text-foreground/30 mx-2">·</span>
                )}
              </span>
            ))}
          </div>

          <div className="text-left md:text-right">
            <div className="text-[9px] font-sans uppercase text-foreground/50 leading-relaxed tracking-[0.25em]">
              {t(copy.footer.locations, locale)}
            </div>
            <div className="text-[9px] font-sans uppercase text-foreground/30 mt-1">
              {t(copy.footer.appointmentOnly, locale)}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-foreground/8">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-[8px] font-sans uppercase text-foreground/25">
            {t(copy.footer.copyright, locale)}
          </div>
          <div className="text-[8px] font-sans uppercase text-foreground/25">
            {t(copy.footer.credit, locale)}
          </div>
        </div>
      </div>
    </footer>
  );
}
