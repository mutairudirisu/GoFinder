import React from "react";
import {
  Hero as ContactHero,
  ContactForm,
  CTA,
} from "@/components/sections/Contact";

export default function ContactPage() {
  return (
    <>
        <ContactHero />
        <ContactForm />
        <CTA />
    </>
  );
}
