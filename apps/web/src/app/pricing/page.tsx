import React from "react";
import {
  Header,
  Hero as PricingHero,
  StudentBanner,
  LandlordPricing,
  PricingAddOns,
  PricingFAQ,
  CTA,
} from "@/components/sections/Pricing";
import { Footer } from "@/components/sections/Home";

export default function PricingPage() {
  return (
    <>
      <Header />

      <main>
        <PricingHero />
        <StudentBanner />
        <LandlordPricing />
        <div className="max-w-6xl mx-auto px-6">
          <PricingAddOns />
        </div>
        <PricingFAQ />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
