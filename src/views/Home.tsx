import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/sections/Hero";
import PrestigeMetrics from "@/components/sections/PrestigeMetrics";
import Founder from "@/components/sections/Founder";
import DirectorManifesto from "@/components/sections/DirectorManifesto";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import Testimonial from "@/components/sections/Testimonial";
import Products from "@/components/sections/Products";
import Booking from "@/components/sections/Booking";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="w-full min-w-0 bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <PrestigeMetrics />
      <section id="atelier" className="scroll-mt-[58px]">
        <Founder />
      </section>
      <section id="journal" className="scroll-mt-[58px]">
        <DirectorManifesto />
      </section>
      <section id="services" className="scroll-mt-[58px]">
        <Services />
      </section>
      <section id="works" className="scroll-mt-[58px]">
        <Gallery />
      </section>
      <section id="opinie" className="scroll-mt-[58px]">
        <Testimonial />
      </section>
      <Products />
      <section id="contact" className="scroll-mt-[58px]">
        <Booking />
      </section>
      <Footer />
      </main>
    </>
  );
}
