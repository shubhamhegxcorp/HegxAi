'use client';

import { useSyncExternalStore, useLayoutEffect, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SpecularButton from './SpecularButton';
import { useLenis } from './SmoothScroll';

// Dynamically import ShapeWaves to avoid SSR issues with WebGPU
const ShapeWaves = dynamic(() => import('./ShapeWaves'), {
  ssr: false,
});

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getReducedMotionServerSnapshot = () => false;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function Hero() {
  const { scrollTo, lenis } = useLenis();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadAndCtasRef = useRef<HTMLDivElement>(null);
  const statLineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Sync ScrollTrigger refresh when Lenis instance is available
  useEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
    }
  }, [lenis]);

  // Pinned scroll-driven animation sequence
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const headline = headlineRef.current;
      const subheadAndCtas = subheadAndCtasRef.current;
      const statLine = statLineRef.current;
      const scrollIndicator = scrollIndicatorRef.current;
      const canvasContainer = canvasContainerRef.current;
      const nextSection = (section.parentElement?.querySelector(':scope > :nth-child(2)') ||
        document.querySelector('main > :nth-child(2)')) as HTMLElement | null;

      // Base initial states
      gsap.set(headline, {
        scale: 1,
        x: 0,
        y: 0,
        autoAlpha: 1,
        transformOrigin: isMobile ? 'center top' : 'center center',
      });
      gsap.set(subheadAndCtas, { autoAlpha: 1, y: 0 });
      if (statLine) {
        gsap.set(statLine, { autoAlpha: 0, y: 30 });
      }
      if (scrollIndicator) {
        gsap.set(scrollIndicator, { autoAlpha: 1, y: 0 });
      }
      if (canvasContainer) {
        gsap.set(canvasContainer, { scale: 1, filter: 'brightness(1) opacity(1)' });
      }

      // Single scrubbed GSAP timeline tied to ScrollTrigger pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=80%' : '+=150%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Total timeline duration: 100 units (representing 0% to 100% scroll distance)

      // 0% to 10%: Subtle scroll indicator cue fades out
      if (scrollIndicator) {
        tl.to(
          scrollIndicator,
          {
            autoAlpha: 0,
            y: 14,
            ease: 'power1.out',
            duration: 10,
          },
          0
        );
      }

      // 0% to 20%: Headline scales from 1 to 0.85 and shifts upward slightly (y: 0 to -40px)
      if (headline) {
        tl.to(
          headline,
          {
            scale: 0.85,
            y: -40,
            ease: 'power1.out',
            duration: 20,
          },
          0
        );
      }

      // 20% to 45%: Subhead and both CTA buttons fade out (opacity 1 to 0) and shift down (y: 0 to 20px)
      // The headline holds in place during this period
      if (subheadAndCtas) {
        tl.to(
          subheadAndCtas,
          {
            autoAlpha: 0,
            y: 20,
            ease: 'power1.out',
            duration: 25,
          },
          20
        );
      }

      // 45% to 70%: Headline fades and scales further down (scale 0.85 to 0.55, opacity 1 to 0.4)
      // and animates toward top-left of the viewport like a persistent label
      if (headline) {
        tl.to(
          headline,
          {
            scale: isMobile ? 0.65 : 0.55,
            opacity: 0.4,
            x: isMobile ? 0 : -36,
            y: isMobile ? -50 : -90,
            ease: 'power1.out',
            duration: 25,
          },
          45
        );
      }

      // 45% to 70%: New small mono stat line fades/slides in from below (closing proof beat)
      if (statLine) {
        tl.to(
          statLine,
          {
            autoAlpha: 0.85,
            y: 0,
            ease: 'power1.out',
            duration: 20,
          },
          45
        );
      }

      // 70% to 100%: ShapeWaves canvas effective scale increases slightly (desktop only)
      if (!isMobile && canvasContainer) {
        tl.to(
          canvasContainer,
          {
            scale: 1.15,
            filter: 'brightness(0.7) opacity(0.8)',
            ease: 'power1.inOut',
            duration: 30,
          },
          70
        );
      }

      // 70% to 95%: Fade out the small stat line and shrunk headline so hero is visually clear before transition
      if (headline) {
        tl.to(
          headline,
          {
            autoAlpha: 0,
            y: isMobile ? -65 : -110,
            ease: 'power1.in',
            duration: 25,
          },
          70
        );
      }

      if (statLine) {
        tl.to(
          statLine,
          {
            autoAlpha: 0,
            y: -20,
            ease: 'power1.in',
            duration: 25,
          },
          70
        );
      }

      // 95% to 100%: Exit transition into the next section (TickerStrip) with clip-path wipe reveal
      if (nextSection) {
        tl.fromTo(
          nextSection,
          {
            clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
            y: 40,
          },
          {
            clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
            y: 0,
            ease: 'power1.out',
            duration: 5,
          },
          95
        );
      }

      tl.to(
        section,
        {
          yPercent: -4,
          ease: 'power1.in',
          duration: 5,
        },
        95
      );
    }, section);

    // Refresh ScrollTrigger once DOM layout stabilizes
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--color-black)',
        minHeight: '100vh',
      }}
    >
      {/* ShapeWaves Background */}
      <div
        ref={canvasContainerRef}
        className="absolute inset-0"
        style={{ zIndex: 0, pointerEvents: 'auto', willChange: 'transform, filter' }}
      >
        <ShapeWaves
          text=""
          shapes="mixed"
          cellSize={11}
          dotSize={0.75}
          color="#888888"
          hoverColor="#FFFFFF"
          backgroundColor="#000000"
          speed={0.8}
          scale={1.2}
          contrast={1.2}
          brightness={0.45}
          fade={0.2}
          interactive={true}
          splashRadius={50}
          splashStrength={0.45}
          glow={0.35}
          intro={true}
          introDuration={1.6}
          paused={prefersReducedMotion}
          onError={(err: unknown) => {
            if (err instanceof Error) console.info('ShapeWaves info:', err.message);
          }}
        />
      </div>

      {/* Hero Content Overlay */}
      <div
        className="relative flex flex-col justify-center w-full"
        style={{
          zIndex: 1,
          minHeight: '100vh',
          padding: '120px 24px 80px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          className="relative flex flex-col"
          style={{
            maxWidth: '680px',
          }}
        >
          {/* Soft Radial Gradient Scrim for Text Legibility */}
          <div
            className="hero-scrim pointer-events-none"
            aria-hidden="true"
          />

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-center md:text-left"
            style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(40px, 6vw, 72px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-white)',
              textShadow: '0 2px 12px rgba(0,0,0,0.6)',
              margin: 0,
              willChange: 'transform, opacity',
            }}
          >
            Intelligent Automation for Modern Enterprises
          </h1>

          {/* Subhead and CTAs container */}
          <div
            ref={subheadAndCtasRef}
            className="flex flex-col"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Subhead */}
            <p
              className="text-center md:text-left"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: 1.6,
                color: '#FFFFFF',
                textShadow: '0 2px 12px rgba(0,0,0,0.6)',
                maxWidth: '560px',
                marginTop: '24px',
                margin: '24px 0 0 0',
              }}
            >
              We design, build, and deploy custom AI agents and resilient workflows that eliminate manual operational bottlenecks.
            </p>

            {/* CTA Row */}
            <div
              className="flex items-center flex-wrap justify-center md:justify-start"
              style={{
                gap: '8px',
                marginTop: '32px',
              }}
            >
              <SpecularButton
                href="#book-audit"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#contact', { offset: -110, duration: 1.2 });
                }}
                size="lg"
                radius={9999}
                baseColor="#00000022"
                lineColor="#000000"
                textColor="#000000"
                tintOpacity={0}
                intensity={0.7}
                shineSize={12}
                shineFade={35}
                followMouse={true}
                proximity={220}
                autoAnimate={false}
                className="bg-white text-black no-underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                style={{
                  borderRadius: '9999px',
                  padding: '14px 28px',
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                }}
              >
                Book a free audit
              </SpecularButton>

              <a
                href="#process"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#process', { offset: -110, duration: 1.2 });
                }}
                className="inline-flex items-center justify-center no-underline text-white focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  transition: 'text-decoration-color 0.2s ease',
                  background: 'none',
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline';
                  e.currentTarget.style.textUnderlineOffset = '4px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                See how it works
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Beat: Small centered stat line */}
      <div
        ref={statLineRef}
        className="absolute inset-x-0 flex justify-center items-center pointer-events-none px-6 text-center"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          opacity: 0,
        }}
        aria-hidden="true"
      >
        <div
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: 'clamp(12px, 1.4vw, 14px)',
            color: 'rgba(255, 255, 255, 0.85)',
            letterSpacing: '0.04em',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          2–4 week delivery · Built around the tools you already use
        </div>
      </div>

      {/* Subtle Scroll Indicator Cue */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{
          zIndex: 2,
          opacity: 1,
        }}
        aria-hidden="true"
      >
        <span
          style={{
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.45)',
            marginBottom: '6px',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '18px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))',
          }}
        />
      </div>
    </section>
  );
}
