"use client";

/**
 * Marquee component with scrolling text and icons.
 * Displays repeating brand messages with star icons.
 */
export const Marquee = () => {
  const items = [
    "Trusted by 10,000+ Students",
    "Easy Payments",
    "Verified Landlords",
    "Great Experience",
  ];

  return (
    <div className="bg-brand-dark py-4 z-50 border-y-2 border-brand-dark">
      <div className=" flex gap-12 animate-marquee whitespace-nowrap" style={{ animationDuration: "20s" }}>
        {/* Repeat items to fill marquee */}
        {[...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="text-white font-display text-2xl font-bold uppercase tracking-widest opacity-50 flex items-center gap-3 flex-shrink-0"
          >
            <i className="ph-fill ph-star text-brand-400"></i>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
