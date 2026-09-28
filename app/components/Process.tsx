'use client';

import React from 'react';

const STEPS = [
  {
    number: '01',
    title: 'Audit',
    description: 'We map the work, find the bottlenecks, and identify the highest-value opportunities.',
  },
  {
    number: '02',
    title: 'Build',
    description: 'We design and implement a system around your tools, team, and operating reality.',
  },
  {
    number: '03',
    title: 'Run',
    description: 'We test, launch, monitor, and refine until the automation performs reliably.',
  },
];

export default function Process() {
  return (
    <section
      id="process"
      className="w-full scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '80px 24px 110px',
        borderTop: '1px solid var(--color-black)',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between w-full pb-6 gap-3">
          <h2
            style={{
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(38px, 5vw, 56px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-black)',
              margin: 0,
            }}
          >
            How it works
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              fontWeight: 500,
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
            }}
          >
            FROM FIRST CONVERSATION TO A SYSTEM YOUR TEAM CAN RELY ON.
          </span>
        </div>

        {/* Divider below header */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-black)',
            width: '100%',
          }}
        />

        {/* 3-column grid with vertical dividers between columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {STEPS.map((step, index) => {
            const isFirst = index === 0;
            const isLast = index === STEPS.length - 1;

            return (
              <div
                key={step.number}
                className={`flex flex-col justify-start ${
                  !isLast ? 'md:border-r md:border-black' : ''
                } ${!isLast ? 'border-b md:border-b-0 border-black' : ''}`}
                style={{
                  paddingTop: '36px',
                  paddingBottom: '36px',
                  paddingLeft: isFirst ? '0px' : '36px',
                  paddingRight: isLast ? '0px' : '36px',
                }}
              >
                {/* Large Number */}
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '40px',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: 'var(--color-black)',
                  }}
                >
                  {step.number}
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    lineHeight: 1.2,
                    color: 'var(--color-black)',
                    marginTop: '44px',
                    marginBottom: '12px',
                  }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontWeight: 400,
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: '#222222',
                    margin: 0,
                    maxWidth: '320px',
                  }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
