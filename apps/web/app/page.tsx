// use explicit Hero path or named import from index
import { AgentsEnterprise, FAQ, FeaturesGrid, JourneyScroller, Marquee, Newsletter, PlatformShowcase, Testimonials } from "@/components/sections/Home";
import Hero from "@/components/sections/Home/Hero";

export default function Home() {
  return  (
    <>
      <Hero />
      <Marquee />
      <JourneyScroller />
      {/* <PlatformShowcase /> */}
      <AgentsEnterprise />
      <FeaturesGrid />
      <Testimonials />
      <Newsletter />
      <FAQ />
    </>
  );
}

