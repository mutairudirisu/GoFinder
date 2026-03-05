"use client";

import { Button } from "@repo/ui/button";
import { FileUpload } from "@repo/ui/file-upload";
import Link from "next/link";

/**
 * A simple hero section used on the landing page of the web app.
 *
 * The component uses basic Tailwind utility classes for layout and
 * typography and renders a title, subtitle and a call‑to‑action button.
 */
export const Hero = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-8xl font-display mb-4">GyGS Rental</h1>
        <p className="text-xl mb-8">
          Find Homes , shared SPACES.
        </p>
        <Link href="/listings/create" className="px-5 py-2.5 bg-brand-500 text-brand-dark font-bold rounded-lg border-2 border-brand-dark hover:shadow-brutal transition-all text-sm">
            List Property
        </Link>
      </div>
    </section>
  );
};

export default Hero;
