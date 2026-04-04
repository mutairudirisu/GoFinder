"use client";

export const Newsletter = () => {
  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden z-40">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-12 opacity-10">
        <i className="ph-fill ph-paper-plane-tilt text-9xl text-white"></i>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-6">Don't miss the best drops.</h2>
        <p className="text-gray-300 text-lg mb-10">Get the latest housing tips, roommate horror stories (and how to avoid them), and exclusive deals.</p>

        <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <input type="email" placeholder="student@university.edu" className="flex-1 px-6 py-4 rounded-xl border-2 border-transparent focus:border-brand-400 focus:outline-none bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm" />
          <button type="button" className="px-8 py-4 bg-brand-400 text-brand-dark font-bold rounded-xl hover:bg-brand-300 transition-colors">Subscribe</button>
        </form>
        <p className="text-gray-500 text-xs mt-4">No spam, we promise. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};