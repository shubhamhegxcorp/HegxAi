'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const header = section.querySelector<HTMLElement>('[data-process-header]');
      const columns = Array.from(section.querySelectorAll<HTMLElement>('[data-process-column]'));
      const numbers = columns.map((column) => column.querySelector<HTMLElement>('[data-process-number]'));

      if (!header || numbers.some((number) => !number)) {
        return;
      }

      gsap.set(header, { autoAlpha: 0, y: 20 });
      gsap.set(columns, { autoAlpha: 0, y: 30 });
      gsap.set(numbers, { scale: 0.9, transformOrigin: 'center center' });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(header, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0)
        .to(columns, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.35)
        .to(numbers, { scale: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' }, 0.35);

      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        once: true,
        onEnter: () => timeline.play(),
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      className="w-full"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '80px 24px 110px',
        borderTop: '1px solid var(--color-black)',
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
        {/* Header row */}
        <div data-process-header className="process-reveal flex flex-col sm:flex-row sm:items-baseline justify-between w-full pb-6 gap-3">
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
            02 / FROM FIRST CONVERSATION TO A SYSTEM YOUR TEAM CAN RELY ON.
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
                data-process-column
                className={`process-reveal flex flex-col justify-start ${
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
                  data-process-number
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
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: 1.5,
                    color: 'rgba(0, 0, 0, 0.8)',
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
