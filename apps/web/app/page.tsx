// use explicit Hero path or named import from index
import { FAQ, FeaturesGrid, Marquee, PlatformShowcase, Pricing, Testimonials } from "@/components/sections/Home";
import Hero from "@/components/sections/Home/Hero";

export default function Home() {
  return  (
    <>
      <Hero />
      <PlatformShowcase />
      <Marquee />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );

}
