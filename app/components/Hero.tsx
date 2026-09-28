'use client';

import { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

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

export default function Hero() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: 'var(--color-black)',
        minHeight: '90vh',
      }}
    >
      {/* ShapeWaves Background */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 0, pointerEvents: 'auto' }}
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
          minHeight: '90vh',
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
            }}
          >
            Intelligent Automation for Modern Enterprises
          </h1>

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
            <Link
              href="#book-audit"
              className="inline-flex items-center justify-center no-underline bg-white text-black focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              style={{
                borderRadius: '9999px',
                padding: '14px 28px',
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontWeight: 600,
                fontSize: '15px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Book a free audit
            </Link>

            <Link
              href="#how-it-works"
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
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
