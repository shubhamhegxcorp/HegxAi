'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const SandParticles = dynamic(() => import('./SandParticles'), { ssr: false });

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="w-full relative scroll-mt-20 overflow-hidden flex flex-col items-center justify-center min-h-[580px] md:min-h-[660px] lg:min-h-[720px]"
      style={{
        backgroundColor: '#E3DACC',
        borderTop: '1px solid var(--color-black)',
        borderBottom: '1px solid var(--color-black)',
        padding: '60px 24px',
      }}
    >
      {/* Anchor for #connect as well */}
      <span id="connect" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* Left Hand: Robot Hand (Left ~35% width, vertically centered, reaching inward toward center) */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[35%] overflow-hidden pointer-events-auto z-0 flex items-center"
        aria-hidden="true"
      >
        <SandParticles
          imageSrc="/assets/robot-hand-clean.png"
          mouseRadius={0.6}
          repulsion={0.14}
          returnSpeed={0.02}
          friction={0.85}
        />
      </div>

      {/* Right Hand: Human Hand (Right ~35% width, vertically centered, reaching inward toward center) */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[35%] overflow-hidden pointer-events-auto z-0 flex items-center"
        aria-hidden="true"
      >
        <SandParticles
          imageSrc="/assets/human-hand-clean.png"
          mouseRadius={0.6}
          repulsion={0.14}
          returnSpeed={0.02}
          friction={0.85}
        />
      </div>

      {/* Middle ~30% Gap: Absolutely Centered Text Overlay */}
      <div
        className="relative z-10 flex flex-col items-center text-center w-full pointer-events-none px-4"
        style={{
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        {/* Small mono label */}
        <span
          style={{
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-black)',
            marginBottom: '18px',
          }}
        >
          LET&apos;S BUILD
        </span>

        {/* Large bold headline */}
        <h2
          style={{
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4.2vw, 48px)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-black)',
            margin: 0,
            maxWidth: '520px',
          }}
        >
          Ready to automate your operations?
        </h2>

        {/* One line supporting text */}
        <p
          style={{
            fontFamily: 'var(--font-ibm-plex-mono), monospace',
            fontSize: '15px',
            lineHeight: 1.6,
            color: 'rgba(0, 0, 0, 0.7)',
            marginTop: '20px',
            marginBottom: '36px',
            maxWidth: '460px',
          }}
        >
          Book a free audit and see exactly where automation saves you the most time.
        </p>

        {/* Primary button */}
        <Link
          href="#book-audit"
          className="pointer-events-auto inline-flex items-center justify-center no-underline hover:opacity-85 transition-opacity focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
          style={{
            borderRadius: '9999px',
            padding: '16px 36px',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '15px',
            backgroundColor: 'var(--color-black)',
            color: 'var(--color-white)',
          }}
        >
          Book a free audit
        </Link>
      </div>
    </section>
  );
}
