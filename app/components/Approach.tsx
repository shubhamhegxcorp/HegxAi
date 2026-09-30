import React from 'react';

export default function Approach() {
  return (
    <section
      id="approach"
      className="w-full"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '72px 24px 130px',
        borderTop: '1px solid var(--color-black)',
        borderBottom: '1px solid var(--color-black)',
        scrollMarginTop: '110px',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          className="flex flex-col items-start text-left"
          style={{
            maxWidth: '740px',
          }}
        >
          {/* Small mono label */}
          <span
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
              marginBottom: '24px',
            }}
          >
            03 / OUR APPROACH
          </span>

          {/* Manifesto paragraph */}
          <p
            style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(23px, 2.9vw, 31px)',
              lineHeight: 1.28,
              letterSpacing: '-0.02em',
              color: 'var(--color-black)',
              margin: 0,
            }}
          >
            We start with the work, not the technology. HEGXAI maps how your team
            actually operates, then builds automation around the tools and people you
            already have — measured in hours returned and errors removed, never in
            novelty.
          </p>
        </div>
      </div>
    </section>
  );
}
