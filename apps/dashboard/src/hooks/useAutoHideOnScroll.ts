"use client";

import { useEffect, useRef, useState } from "react";

<<<<<<< HEAD
type Options<T extends HTMLElement = HTMLElement> =
=======
type Options =
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
  | {
      mode: "window";
      enabled: boolean;
      topReset?: number;
      deltaThreshold?: number;
    }
  | {
      mode: "element";
      enabled: boolean;
<<<<<<< HEAD
      elementRef: React.RefObject<T | null>;
=======
      elementRef: React.RefObject<HTMLElement | null>;
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
      topReset?: number;
      deltaThreshold?: number;
    };

<<<<<<< HEAD
export function useAutoHideOnScroll<T extends HTMLElement = HTMLElement>(options: Options<T>) {
=======
export function useAutoHideOnScroll(options: Options) {
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
  const [hidden, setHidden] = useState(false);
  const lastPosRef = useRef(0);

  useEffect(() => {
    if (!options.enabled) {
      setHidden(false);
      return;
    }

    const topReset = options.topReset ?? 24;
    const deltaThreshold = options.deltaThreshold ?? 10;

    const target =
      options.mode === "window"
        ? window
<<<<<<< HEAD
        : (options.elementRef.current as T | null);
=======
        : options.elementRef.current;
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2

    if (!target) return;

    let raf = 0;

    const readPos = () => {
      if (options.mode === "window") return window.scrollY || 0;
      return (options.elementRef.current?.scrollTop ?? 0) as number;
    };

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

    if (options.mode === "window") {
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        if (raf) window.cancelAnimationFrame(raf);
        window.removeEventListener("scroll", onScroll);
      };
    }

<<<<<<< HEAD
    const el = options.elementRef.current as T | null;
=======
    const el = options.elementRef.current;
>>>>>>> 3cf4ee25e3193adf65befbc4a4994bdf101bfef2
    el?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      el?.removeEventListener("scroll", onScroll);
    };
  }, [
    options.enabled,
    options.mode,
    options.topReset,
    options.deltaThreshold,
    options.mode === "element" ? options.elementRef : null,
  ]);

  return { hidden, setHidden };
}
