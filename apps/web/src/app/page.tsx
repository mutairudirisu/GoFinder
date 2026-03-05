// use explicit Hero path or named import from index
import { FAQ, FeaturesGrid, Footer, Header, Marquee, Pricing, Testimonials } from "@/components/sections/Home";
import Hero from "@/components/sections/Home/Hero";

export default function Home() {
  return  (
    <>
      <Header />
      <Hero />
      <Marquee />
      <FeaturesGrid />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Footer />
    </>

  );

}