'use client';

import React from 'react';
import Link from 'next/link';
import BlinkingSquares from './BlinkingSquares';
import { useLenis } from './SmoothScroll';

export default function Footer() {
  const { scrollTo } = useLenis();

  return (
    <footer
      className="w-full relative overflow-hidden"
      style={{
        backgroundColor: '#000000',
        color: 'var(--color-white)',
        padding: '80px 24px 44px',
      }}
    >
      {/* BlinkingSquares Canvas Background Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 60%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 60%)',
        }}
        aria-hidden="true"
      >
        <BlinkingSquares
          direction="bottom"
          gridSize={32}
          squareSize={0.3}
          fadeStart={0.5}
          fadeEnd={0.88}
          falloff={0.85}
          minBrightness={0.4}
          twinkleSpeed={0.8}
          twinkleStrength={0.85}
          intensity={1.1}
          opacity={0.65}
          squareColor="#E3DACC"
          backgroundColor="transparent"
          dpr={1.5}
          className="w-full h-full"
        />
      </div>

      {/* Footer Content - Elevated above canvas */}
      <div
        className="relative z-10 w-full"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Column 1: Brand Wordmark & Tagline */}
          <div className="flex flex-col items-start">
            <Link
              href="/"
              className="inline-flex items-center text-white no-underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: '17px',
                letterSpacing: '0.04em',
                color: 'var(--color-white)',
              }}
              aria-label="HEGXAI Home"
            >
              HEGXAI
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '13px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '12px',
                maxWidth: '280px',
                margin: '12px 0 0 0',
              }}
            >
              Intelligent automation for modern enterprises.
            </p>
          </div>

          {/* Column 2: Navigate */}
          <div className="flex flex-col items-start">
            <span
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                marginBottom: '16px',
              }}
            >
              NAVIGATE
            </span>
            <ul
              className="flex flex-col gap-3 list-none p-0 m-0"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: '14px',
              }}
            >
              <li>
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#services', { offset: -110, duration: 1.2 });
                  }}
                  className="text-white no-underline hover:underline underline-offset-4 opacity-85 hover:opacity-100 transition-opacity"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#process"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#process', { offset: -110, duration: 1.2 });
                  }}
                  className="text-white no-underline hover:underline underline-offset-4 opacity-85 hover:opacity-100 transition-opacity"
                >
                  Process
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#faq', { offset: -110, duration: 1.2 });
                  }}
                  className="text-white no-underline hover:underline underline-offset-4 opacity-85 hover:opacity-100 transition-opacity"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#contact', { offset: -110, duration: 1.2 });
                  }}
                  className="text-white no-underline hover:underline underline-offset-4 opacity-85 hover:opacity-100 transition-opacity"
                >
                  Connect
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Connect & Socials */}
          <div className="flex flex-col items-start">
            <span
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.45)',
                marginBottom: '16px',
              }}
            >
              CONNECT
            </span>
            <a
              href="mailto:hello@hegxai.com"
              className="text-white no-underline hover:underline underline-offset-4 opacity-85 hover:opacity-100 transition-opacity"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '13px',
                color: 'var(--color-white)',
              }}
            >
              hello@hegxai.com
            </a>

            <div
              className="flex items-center gap-4 mt-4"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontSize: '13px',
              }}
            >
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white no-underline hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                LinkedIn
              </a>
              <span className="opacity-30" aria-hidden="true">/</span>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white no-underline hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className="w-full flex items-center justify-between"
          style={{
            marginTop: '64px',
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            © 2026 HEGXAI. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
