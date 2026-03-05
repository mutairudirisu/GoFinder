import React from "react";
import {
  Header,
  Hero as AboutHero,
  Mission,
  Values,
  Team,
  CTA,
} from "@/components/sections/About";
import { Footer } from "@/components/sections/Home";

export default function AboutUsPage() {
  return (
    <>
      <Header />

      <main>
        <AboutHero />
        <Mission />
        <Values />
        <Team />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
