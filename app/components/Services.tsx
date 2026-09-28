'use client';

import React from 'react';

const SERVICES = [
  {
    number: '01',
    title: 'Workflow Automation',
    description: 'Remove repetitive steps and connect the tools your team already uses.',
  },
  {
    number: '02',
    title: 'AI Agents',
    description: 'Deploy reliable agents for research, support, operations, and internal tasks.',
  },
  {
    number: '03',
    title: 'Custom Integrations',
    description: 'Build the missing links between your systems, data, and business logic.',
  },
  {
    number: '04',
    title: 'Process Design',
    description: 'Turn fragile manual processes into clear, measurable operating systems.',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="w-full scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '100px 24px 80px',
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
            WHAT WE BUILD
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

        {/* 4 Service Rows */}
        <div className="w-full flex flex-col">
          {SERVICES.map((service, index) => (
            <div
              key={service.number}
              tabIndex={0}
              role="article"
              aria-label={`${service.number} ${service.title}`}
              className="service-row group w-full flex flex-col md:flex-row items-start md:items-center justify-between outline-none"
              style={{
                padding: '36px 28px',
                borderBottom: '1px solid var(--color-black)',
              }}
            >
              {/* Left group: Number & Title */}
              <div className="flex items-baseline gap-6 md:gap-12 w-full md:w-auto">
                <span
                  className="shrink-0 select-none"
                  style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontWeight: 500,
                    fontSize: '14px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {service.number}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(26px, 3.8vw, 42px)',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Right group: Description */}
              <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-start md:justify-end">
                <p
                  className="text-left md:text-right"
                  style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontWeight: 400,
                    fontSize: '13px',
                    lineHeight: 1.6,
                    maxWidth: '300px',
                    margin: 0,
                  }}
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
