"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export function JourneyScroller() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const sidePct = useTransform(scrollYProgress, [0, 0.35], [48, 0]);
  const bottomPct = useTransform(scrollYProgress, [0, 0.35], [97, 0]);
  const radiusPx = useTransform(scrollYProgress, [0, 0.35], [112, 48]);
  const clipPath = useMotionTemplate`inset(0px ${sidePct}% ${bottomPct}% round ${radiusPx}px)`;

  const containerY = useTransform(scrollYProgress, [0, 0.35], [-260, 0]);
  const containerScale = useTransform(scrollYProgress, [0, 0.35], [0.62, 1]);
  const containerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.35], [0, 0.55, 1]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);

  const steps = [
    {
      title: "Discover homes & hostels",
      desc: "Hunt verified spaces across Nigeria with powerful filters.",
      icon: "ph-bold ph-magnifying-glass",
      badge: "Finder",
    },
    {
      title: "Student accommodation",
      desc: "Compare rooms, split bills, and plan your semester budget.",
      icon: "ph-bold ph-student",
      badge: "Campus",
    },
    {
      title: "Match roommates",
      desc: "Share invite links, join groups, and lock the perfect fit.",
      icon: "ph-bold ph-users-three",
      badge: "Roommates",
    },
    {
      title: "Verified hosting",
      desc: "List in minutes, verify once, and publish instantly.",
      icon: "ph-bold ph-seal-check",
      badge: "Host",
    },
    
    {
      title: "Chat & contact",
      desc: "Message hosts, ask questions, and keep it on GIGS.",
      icon: "ph-bold ph-chats",
      badge: "Inbox",
    },
    {
      title: "And many more",
      desc: "Wishlist, maps, deposits, calendars — all in one place.",
      icon: "ph-bold ph-sparkle",
      badge: "Future",
    },
  ];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => window.clearInterval(id);
  }, [isInView, steps.length]);

  const active = useMemo(() => {
    const fallback = { title: "", desc: "", icon: "ph-bold ph-sparkle", badge: "GIGS" };
    return steps[Math.min(steps.length - 1, Math.max(0, activeIndex))] ?? fallback;
  }, [activeIndex]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden z-50 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-brand-50" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-12 w-[360px] h-[360px] bg-emerald-400/10 rounded-full blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Scroll story</span>
          </div>
          <h2 className="mt-6 font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-brand-dark">
            What you can do on <span className="text-brand-600">GIGS Rentals</span>
          </h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            A beautiful walkthrough from hunting to hosting — all in one scroll.
          </p>
        </div>

        <div className="mt-14 relative h-[100vh]">
          <motion.div
            style={{ clipPath }}
            className="sticky top-24 rounded-[56px] bg-brand-900 border border-brand-800 shadow-2xl overflow-hidden"
          >
            <motion.div
              style={{ y: containerY, scale: containerScale, opacity: containerOpacity }}
              className="relative p-8 sm:p-10 lg:p-12"
            >
              <div className="absolute inset-0 bg-grid-pattern bg-[length:36px_36px] opacity-20" />
              <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-brand-500/25 rounded-full blur-[110px]" />
              <div className="absolute -bottom-28 left-1/3 w-[520px] h-[520px] bg-emerald-400/15 rounded-full blur-[110px]" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                    <i className={`${active.icon} text-emerald-300`}></i>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{active.badge}</span>
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
                      Step {activeIndex + 1} / {steps.length}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white leading-tight">
                    {active.title}
                  </h3>
                  <p className="text-white/75 text-base sm:text-lg max-w-xl">
                    {active.desc}
                  </p>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-200 border border-emerald-400/20 text-[10px] font-bold uppercase tracking-widest">
                      <i className="ph-fill ph-seal-check"></i>
                      Verified
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                      <i className="ph-bold ph-lightning"></i>
                      Fast
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                      <i className="ph-bold ph-shield-check"></i>
                      Secure
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-20 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-emerald-400 flex items-center justify-center shadow-[0_18px_70px_rgba(52,211,153,0.35)]">
                    <svg width="54" height="54" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M28 41.75a6.95 6.95 0 0 0 6.8-5.55C40 35.4 42 32.48 42 29.51c0-1.94-.83-3.83-2.33-5.19.15-.57.22-1.15.22-1.75 0-3.97-3.22-6.94-6.94-6.94-.76 0-1.5.12-2.19.36A6.96 6.96 0 0 0 25.9 14a6.94 6.94 0 0 0-6.8 5.55C16 20.36 14 23.27 14 26.24c0 1.94.83 3.83 2.33 5.19-.15.57-.22 1.15-.22 1.75 0 3.97 3.22 6.94 6.94 6.94.76 0 1.5-.12 2.19-.36A6.95 6.95 0 0 0 28 41.75Z"
                        fill="#06281C"
                      />
                    </svg>
                  </div>

                  <div className="relative h-[420px] sm:h-[460px] rounded-[48px] border border-white/10 bg-black/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-[420px] px-6">
                        <div className="relative h-[360px] overflow-hidden">
                          {steps.map((s, idx) => {
                            const d = idx - activeIndex;
                            const abs = Math.abs(d);
                            const y = d * 70;
                            const scale = 1 - Math.min(0.42, abs * 0.08);
                            const opacity = 1 - Math.min(0.92, abs * 0.18);
                            const isActive = abs === 0;

                            return (
                              <motion.div
                                key={s.title}
                                animate={{ y, scale, opacity }}
                                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                                className="absolute left-1/2 -translate-x-1/2 w-full"
                                style={{ top: "50%" }}
                              >
                                <div
                                  className={`h-[60px] rounded-full flex items-center gap-3 px-4 border backdrop-blur-md ${
                                    isActive
                                      ? "bg-emerald-400/10 border-emerald-400/25"
                                      : "bg-white/5 border-white/10"
                                  }`}
                                >
                                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
                                    <i className={`${s.icon} ${isActive ? "text-emerald-200" : "text-white/70"}`}></i>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className={`text-sm font-bold line-clamp-1 ${isActive ? "text-white" : "text-white/80"}`}>
                                      {s.title}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/45">{s.badge}</div>
                                  </div>
                                  <div className="shrink-0 w-10 h-10 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-white/60">
                                    <i className="ph ph-caret-right"></i>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default JourneyScroller;
