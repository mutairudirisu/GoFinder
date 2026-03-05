import React from "react";
import {
  Header,
  Hero as ContactHero,
  ContactForm,
  CTA,
} from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Home";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main>
        <ContactHero />
        <ContactForm />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
