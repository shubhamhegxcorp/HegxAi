import React from 'react';

const ITEMS = [
  'CRM SYNC',
  'LEAD ROUTING',
  'AI AGENTS',
  'INVOICE PIPELINES',
  'DATA ENRICHMENT',
  'CUSTOM INTEGRATIONS',
];

export default function TickerStrip() {
  return (
    <div
      className="w-full overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--color-black)',
        borderTop: '1px solid #1a1a1a',
        borderBottom: '1px solid #1a1a1a',
        padding: '12px 0',
      }}
      aria-label="Automations overview ticker"
    >
      <div className="ticker-track flex items-center">
        {/* Set 1 */}
        <div className="flex items-center shrink-0">
          {ITEMS.map((item, index) => (
            <span
              key={`item-1-${index}`}
              className="inline-flex items-center text-white"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <span className="mx-6 text-neutral-500 font-light" aria-hidden="true">/</span>
              {item}
            </span>
          ))}
          <span className="mx-6 text-neutral-500 font-light" aria-hidden="true">/</span>
        </div>

        {/* Set 2 (duplicate for seamless loop) */}
        <div className="flex items-center shrink-0" aria-hidden="true">
          {ITEMS.map((item, index) => (
            <span
              key={`item-2-${index}`}
              className="inline-flex items-center text-white"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '12px',
                fontWeight: 400,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              <span className="mx-6 text-neutral-500 font-light" aria-hidden="true">/</span>
              {item}
            </span>
          ))}
          <span className="mx-6 text-neutral-500 font-light" aria-hidden="true">/</span>
        </div>
      </div>
    </div>
  );
}
