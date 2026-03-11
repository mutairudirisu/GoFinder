import React from "react";
import {
  Hero as AboutHero,
  Mission,
  Values,
  Team,
  CTA,
} from "@/components/sections/About";


export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <Mission />
      <Values />
      <Team />
      <CTA />
    </>
  );
}
