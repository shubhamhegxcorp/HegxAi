import React from 'react';

const STATS = [
  {
    value: '40+',
    label: 'HOURS SAVED / WEEK',
  },
  {
    value: '2-4',
    label: 'WEEK DELIVERY',
  },
  {
    value: '100%',
    label: 'CUSTOM BUILT',
  },
];

export default function Results() {
  return (
    <section
      id="results"
      className="w-full scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-black)',
        padding: '110px 24px 130px',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          {STATS.map((stat, index) => {
            const isFirst = index === 0;
            const isLast = index === STATS.length - 1;

            return (
              <div
                key={stat.label}
                className={`flex flex-col justify-start ${
                  !isLast ? 'md:border-r border-neutral-800' : ''
                } ${!isLast ? 'border-b md:border-b-0 border-neutral-800' : ''}`}
                style={{
                  paddingTop: '24px',
                  paddingBottom: '24px',
                  paddingLeft: isFirst ? '0px' : '40px',
                  paddingRight: isLast ? '0px' : '40px',
                }}
              >
                {/* Large Stat Value */}
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                    fontWeight: 700,
                    fontSize: 'clamp(54px, 7vw, 92px)',
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: 'var(--color-white)',
                  }}
                >
                  {stat.value}
                </span>

                {/* Accent Label in Cream */}
                <span
                  style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontWeight: 500,
                    fontSize: '12px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#E3DACC',
                    marginTop: '20px',
                  }}
                >
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
