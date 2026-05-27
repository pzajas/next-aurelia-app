"use client";

import SiteHeader from "@/components/SiteHeader";

/** Header lives inside `.site-shell` — same column width as page content on desktop. */
export default function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell mx-auto w-full min-w-0 max-w-[var(--site-max-width)] min-h-full bg-background">
      <SiteHeader />
      {children}
    </div>
  );
}
