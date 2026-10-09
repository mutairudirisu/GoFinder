// use explicit Hero path or named import from index
import { AgentsEnterprise, FAQ, FeaturesGrid, JourneyScroller, Marquee, Newsletter, Testimonials, StudentLifestyleBanner } from "@/components/sections/Home";
import Hero from "@/components/sections/Home/Hero";

export default function Home() {
  return  (
    <>
      <Hero />
      {/* Spacer to push content below the fixed hero viewport */}
      <div className="h-[100svh]" />
      {/* Content scrolls over the fixed hero */}
      <div className="relative z-10 bg-white">
        <Marquee />
        <JourneyScroller />
        <AgentsEnterprise />
        <FeaturesGrid />
        <StudentLifestyleBanner />
        <Testimonials />
        <Newsletter />
        <FAQ />
      </div>
    </>
  );
}

