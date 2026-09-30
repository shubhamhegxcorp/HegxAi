'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLenis } from './SmoothScroll';

const SERVICES = [
  {
    number: '01',
    title: 'Workflow Automation',
    description: 'Remove repetitive steps and connect the tools your team already uses.',
    tags: ['CRM Sync', 'Lead Routing', 'Invoice Pipelines'],
    expandedDescription:
      'We connect the tools your team already relies on so work moves between them without anyone touching a spreadsheet.',
    icon: (
      <svg
        className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M21 21v-5h-5" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'AI Agents',
    description: 'Deploy reliable agents for research, support, operations, and internal tasks.',
    tags: ['Research Agents', 'Support Agents', 'Internal Ops'],
    expandedDescription:
      'From first response to internal research, we deploy agents that handle the repeatable parts of the job reliably.',
    icon: (
      <svg
        className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3.2" />
        <circle cx="5" cy="6" r="2.2" />
        <circle cx="19" cy="6" r="2.2" />
        <circle cx="12" cy="20" r="2.2" />
        <line x1="7" y1="7.5" x2="9.8" y2="10" />
        <line x1="17" y1="7.5" x2="14.2" y2="10" />
        <line x1="12" y1="15.2" x2="12" y2="17.8" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Custom Integrations',
    description: 'Build the missing links between your systems, data, and business logic.',
    tags: ['API Integrations', 'Data Enrichment', 'Legacy Systems'],
    expandedDescription:
      "When off-the-shelf tools don't talk to each other, we build the bridge — APIs, webhooks, or custom logic.",
    icon: (
      <svg
        className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Process Design',
    description: 'Turn fragile manual processes into clear, measurable operating systems.',
    tags: ['Audits', 'SOPs', 'Measurement'],
    expandedDescription:
      'We turn undocumented, tribal-knowledge workflows into clear systems your team can actually rely on and measure.',
    icon: (
      <svg
        className="w-[18px] h-[18px] md:w-[22px] md:h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="10" y="10" width="5" height="5" rx="1" />
        <rect x="17" y="16" width="5" height="5" rx="1" />
        <path d="M8 5.5h4.5v4.5" />
        <path d="M15 12.5h4.5v3.5" />
      </svg>
    ),
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const { scrollTo } = useLenis();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const toggleRow = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="w-full"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '100px 24px 80px',
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
        <div className="flex items-baseline justify-between w-full pb-6">
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
            Services
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              fontWeight: 500,
              fontSize: '12px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-black)',
            }}
          >
            01 / WHAT WE BUILD
          </span>
        </div>

        {/* Top Divider */}
        <div
          style={{
            height: '1px',
            backgroundColor: 'var(--color-black)',
            width: '100%',
          }}
        />

        {/* 4 Service Accordion Rows */}
        <div className="w-full flex flex-col" role="region" aria-label="Services list">
          {SERVICES.map((service, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={service.number}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleRow(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleRow(index);
                  }
                }}
                className={`service-row group w-full flex flex-col outline-none select-none ${
                  isExpanded ? 'service-row--expanded' : ''
                }`}
                style={{
                  padding: isExpanded ? '52px 28px' : '36px 28px',
                  borderBottom: '1px solid var(--color-black)',
                }}
              >
                {/* Header row inside the accordion item */}
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between">
                  {/* Left group: Number & Icon & Title */}
                  <div className="flex items-center gap-4 sm:gap-6 md:gap-7 w-full md:w-auto">
                    <span
                      className="shrink-0 select-none w-6 sm:w-8"
                      style={{
                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                        fontWeight: 500,
                        fontSize: '14px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {service.number}
                    </span>

                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView ? 'scale(1)' : 'scale(0.8)',
                        transition: `opacity 300ms ease ${index * 80}ms, transform 300ms ease ${index * 80}ms`,
                      }}
                    >
                      {service.icon}
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                        fontWeight: 700,
                        fontSize: 'clamp(24px, 3.8vw, 42px)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        margin: 0,
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Right group: Description (only visible when collapsed) */}
                  <div
                    className="w-full md:w-auto mt-4 md:mt-0 flex justify-start md:justify-end transition-opacity duration-300"
                    style={{
                      opacity: isExpanded ? 0 : 1,
                      visibility: isExpanded ? 'hidden' : 'visible',
                      pointerEvents: isExpanded ? 'none' : 'auto',
                    }}
                  >
                    <p
                      className="text-left md:text-right"
                      style={{
                        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                        fontWeight: 400,
                        fontSize: '15px',
                        lineHeight: 1.5,
                        color: 'inherit',
                        opacity: 0.85,
                        maxWidth: '300px',
                        margin: 0,
                      }}
                    >
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Expanded Content (CSS Grid animated height) */}
                <div
                  className="grid transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className="pl-0 sm:pl-[74px] md:pl-[110px] flex flex-col items-start"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        paddingTop: isExpanded ? '28px' : '0px',
                        transition: 'opacity 300ms ease, padding-top 350ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {/* Pill tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {service.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontFamily: 'var(--font-ibm-plex-mono), monospace',
                              fontSize: '12px',
                              fontWeight: 400,
                              letterSpacing: '0.06em',
                              padding: '5px 14px',
                              borderRadius: '9999px',
                              border: '1px solid rgba(227, 218, 204, 0.4)',
                              color: 'var(--color-cream)',
                              backgroundColor: 'transparent',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expanded description */}
                      <p
                        style={{
                          fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: 1.6,
                          color: 'rgba(227, 218, 204, 0.85)',
                          maxWidth: '540px',
                          margin: '0 0 28px 0',
                        }}
                      >
                        {service.expandedDescription}
                      </p>

                      {/* Discuss project button */}
                      <div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            scrollTo('#contact', { offset: -110, duration: 1.2 });
                          }}
                          className="service-discuss-btn"
                          aria-label={`Discuss project regarding ${service.title}`}
                        >
                          Discuss project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
