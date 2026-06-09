import React from "react";
import {
  Hero as PricingHero,
  StudentBanner,
  LandlordPricing,
  PricingAddOns,
  PricingFAQ,
  CTA,
} from "@/components/sections/Pricing";

export default function PricingPage() {
  return (
    <>
        <PricingHero />
        <StudentBanner />
        <LandlordPricing />
        <div className="max-w-6xl mx-auto px-6">
          <PricingAddOns />
        </div>
        <PricingFAQ />
        <CTA />
    </>
  );
}
