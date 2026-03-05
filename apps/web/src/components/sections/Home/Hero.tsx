"use client";

import { Button } from "@repo/ui/button";
import { FileUpload } from "@repo/ui/file-upload";

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
        <h1 className="text-5xl font-sans mb-4">GIGS Rental</h1>
        <p className="text-xl mb-8">
          Find Homes , shared SPACES.
        </p>
        <Button
          appName="web"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Browse Now
        </Button>

        <FileUpload />
      </div>
    </section>
  );
};

export default Hero;
