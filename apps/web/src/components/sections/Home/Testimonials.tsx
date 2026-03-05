"use client";

export const Testimonials = () => {
  return (
    <section className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="font-display font-bold text-4xl">Word on the campus.</h2>
      </div>

      <div className="flex gap-6 animate-marquee px-6" style={{ animationDuration: "40s" }}>
        {/* Card 1 */}
        <div className="min-w-[400px] bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full border-2 border-brand-400 object-cover" alt="User" />
            <div>
              <p className="font-bold">Sarah Jenkins</p>
              <p className="text-sm text-gray-400">NYU Student</p>
            </div>
            <div className="ml-auto text-brand-400"><i className="ph-fill ph-quotes text-3xl"></i></div>
          </div>
          <p className="text-gray-300 leading-relaxed">"Honestly a lifesaver. Found my roommates and our apartment in less than a week. The split payment feature is genius."</p>
        </div>

        {/* Card 2 */}
        <div className="min-w-[400px] bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full border-2 border-brand-400 object-cover" alt="User" />
            <div>
              <p className="font-bold">Marcus Chen</p>
              <p className="text-sm text-gray-400">UCLA Student</p>
            </div>
            <div className="ml-auto text-brand-400"><i className="ph-fill ph-quotes text-3xl"></i></div>
          </div>
          <p className="text-gray-300 leading-relaxed">"The landlord chat keeps everything professional. I love that I can see verified reviews before visiting."</p>
        </div>

        {/* Card 3 */}
        <div className="min-w-[400px] bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full border-2 border-brand-400 object-cover" alt="User" />
            <div>
              <p className="font-bold">Emily Dao</p>
              <p className="text-sm text-gray-400">UT Austin</p>
            </div>
            <div className="ml-auto text-brand-400"><i className="ph-fill ph-quotes text-3xl"></i></div>
          </div>
          <p className="text-gray-300 leading-relaxed">"Saved me so much stress during finals week. The interface is super clean and easy to use on mobile."</p>
        </div>

        {/* Duplicate for loop illusion */}
        <div className="min-w-[400px] bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" className="w-12 h-12 rounded-full border-2 border-brand-400 object-cover" alt="User" />
            <div>
              <p className="font-bold">Jason R.</p>
              <p className="text-sm text-gray-400">Stanford</p>
            </div>
            <div className="ml-auto text-brand-400"><i className="ph-fill ph-quotes text-3xl"></i></div>
          </div>
          <p className="text-gray-300 leading-relaxed">"Best app for student housing, hands down. The filters actually work and the listings are legit."</p>
        </div>
      </div>
    </section>
  );
};
