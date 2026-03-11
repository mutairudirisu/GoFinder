// use explicit Hero path or named import from index
import { FAQ, FeaturesGrid, Marquee, Pricing, Testimonials } from "@/components/sections/Home";
import Hero from "@/components/sections/Home/Hero";

export default function Home() {
  return  (
    <>
      <Hero />
      <Marquee />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>

  );

}