import dynamic from "next/dynamic";
import Hero from "@/components/sections/Hero";

const PrestigeMetrics = dynamic(
  () => import("@/components/sections/PrestigeMetrics")
);
const Founder = dynamic(() => import("@/components/sections/Founder"));
const DirectorManifesto = dynamic(
  () => import("@/components/sections/DirectorManifesto")
);
const Services = dynamic(() => import("@/components/sections/Services"));
const Gallery = dynamic(() => import("@/components/sections/Gallery"));
const Testimonial = dynamic(() => import("@/components/sections/Testimonial"));
const Products = dynamic(() => import("@/components/sections/Products"));
const Booking = dynamic(() => import("@/components/sections/Booking"));
const ClosingManifesto = dynamic(
  () => import("@/components/sections/ClosingManifesto")
);
const Footer = dynamic(() => import("@/components/sections/Footer"));

export default function Home() {
  return (
    <main className="site-main w-full min-w-0 bg-background text-foreground min-h-screen max-md:pt-[58px] selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <PrestigeMetrics />
      <section id="atelier" className="scroll-mt-[var(--site-header-height,68px)]">
        <Founder />
      </section>
      <section id="journal" className="scroll-mt-[var(--site-header-height,68px)]">
        <DirectorManifesto />
      </section>
      <section id="services" className="scroll-mt-[var(--site-header-height,68px)]">
        <Services />
      </section>
      <section id="works" className="scroll-mt-[var(--site-header-height,68px)]">
        <Gallery />
      </section>
      <section id="opinie" className="scroll-mt-[var(--site-header-height,68px)]">
        <Testimonial />
      </section>

      <Products />
      <section id="contact" className="scroll-mt-[var(--site-header-height,68px)]">
        <Booking />
      </section>
      <ClosingManifesto />
      <Footer />
    </main>
  );
}
