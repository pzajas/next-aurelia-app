import Booking from "@/components/sections/Booking";
import DirectorManifesto from "@/components/sections/DirectorManifesto";
import Footer from "@/components/sections/Footer";
import Founder from "@/components/sections/Founder";
import Gallery from "@/components/sections/Gallery";
import Hero from "@/components/sections/Hero";
import PrestigeMetrics from "@/components/sections/PrestigeMetrics";
import Products from "@/components/sections/Products";
import Services from "@/components/sections/Services";
import Testimonial from "@/components/sections/Testimonial";


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
      <Footer />
    </main>
  );
}
