'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface LenisContextValue {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(LenisContext);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Skip entirely if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
    });

    setLenisInstance(lenis);
    (window as any).lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis via GSAP ticker
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerUpdate);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      setLenisInstance(null);
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement,
    options?: { offset?: number; duration?: number }
  ) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: options?.offset ?? -110,
        duration: options?.duration ?? 1.2,
      });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
