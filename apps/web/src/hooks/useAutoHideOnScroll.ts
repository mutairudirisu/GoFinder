"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  enabled?: boolean;
  topReset?: number;
  deltaThreshold?: number;
};

export function useAutoHideOnScroll(options: Options = {}) {
  const [hidden, setHidden] = useState(false);
  const lastPosRef = useRef(0);

  const enabled = options.enabled ?? true;
  const topReset = options.topReset ?? 40;
  const deltaThreshold = options.deltaThreshold ?? 8;

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    let raf = 0;

    const readPos = () => window.scrollY || 0;
    lastPosRef.current = readPos();

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const current = readPos();
        const prev = lastPosRef.current;
        const delta = current - prev;
        lastPosRef.current = current;

        if (current < topReset) {
          setHidden(false);
          return;
        }
        if (delta > deltaThreshold) setHidden(true);
        if (delta < -deltaThreshold) setHidden(false);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled, topReset, deltaThreshold]);

  return { hidden, setHidden };
}
