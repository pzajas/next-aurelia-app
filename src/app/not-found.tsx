import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-card p-8 shadow-sm">
        <div className="flex mb-4 gap-2 items-center">
          <AlertCircle className="h-8 w-8 text-destructive shrink-0" />
          <h1 className="text-2xl font-serif font-light">Page not found</h1>
        </div>

        <p className="text-sm text-muted-foreground">
          This atelier does not exist. Return to the maison.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-[12px] font-sans uppercase tracking-[0.35em] text-foreground hover:opacity-60 transition-opacity"
        >
          Back to Aurelia
        </Link>
      </div>
    </div>
  );
}
