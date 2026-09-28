'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What does this actually look like for my business?',
    answer:
      'We start with a short audit call, map your current workflow, and show you exactly where automation saves time — before you commit to anything.',
  },
  {
    question: 'Do I need any technical knowledge on my end?',
    answer:
      'No. We handle the build and the maintenance. You just tell us what’s slowing your team down.',
  },
  {
    question: 'Will it work with the tools we already use?',
    answer:
      'Yes — we build around your existing stack (CRM, spreadsheets, WhatsApp, email, whatever you run on) instead of asking you to switch tools.',
  },
  {
    question: 'How long before we see results?',
    answer:
      'Most builds go live in 2-4 weeks, and teams typically see time saved within the first week of running.',
  },
  {
    question: 'What if our process is too messy or manual right now?',
    answer:
      'That’s usually exactly where we start — the audit phase exists specifically to bring structure to a messy process before we automate it.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="w-full scroll-mt-20"
      style={{
        backgroundColor: 'var(--color-cream)',
        padding: '120px 24px 140px',
      }}
    >
      <div
        className="w-full"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (Sticky on desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 flex flex-col items-start">
            {/* Small mono label */}
            <span
              className="flex items-center"
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-black)',
                marginBottom: '16px',
              }}
            >
              <span>04</span>
              <span
                className="mx-3"
                style={{ color: 'rgba(0, 0, 0, 0.45)' }}
                aria-hidden="true"
              >
                /
              </span>
              <span>A FEW GOOD QUESTIONS</span>
            </span>

            {/* Headline */}
            <h2
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(36px, 4.5vw, 48px)',
                lineHeight: 1.12,
                letterSpacing: '-0.02em',
                color: 'var(--color-black)',
                margin: 0,
                maxWidth: '420px',
              }}
            >
              Still wondering how this fits?
            </h2>

            {/* Supporting line */}
            <p
              style={{
                fontFamily: 'var(--font-ibm-plex-mono), monospace',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(0, 0, 0, 0.7)',
                marginTop: '16px',
                maxWidth: '340px',
                margin: '16px 0 0 0',
              }}
            >
              Here&apos;s what working with HEGXAI actually looks like.
            </p>
          </div>

          {/* Right Column: Accordion list */}
          <div className="lg:col-span-7 flex flex-col w-full border-t border-black">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="w-full border-b border-black"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left py-6 group focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4 cursor-pointer bg-transparent border-none"
                    style={{
                      padding: '28px 0',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                        fontWeight: 600,
                        fontSize: 'clamp(18px, 2.2vw, 22px)',
                        lineHeight: 1.35,
                        letterSpacing: '-0.01em',
                        color: 'var(--color-black)',
                        paddingRight: '24px',
                      }}
                    >
                      {item.question}
                    </span>

                    {/* Plus / Multiply Toggle Icon */}
                    <span
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: '28px',
                        height: '28px',
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                      >
                        <path
                          d="M9 1V17M1 9H17"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </button>

                  {/* Accordion Content with smooth height & opacity transition */}
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="transition-opacity duration-250 ease-out"
                        style={{
                          opacity: isOpen ? 1 : 0,
                          paddingBottom: '28px',
                        }}
                      >
                        <p
                          style={{
                            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                            fontWeight: 400,
                            fontSize: '15px',
                            lineHeight: 1.65,
                            color: 'rgba(0, 0, 0, 0.72)',
                            maxWidth: '560px',
                            margin: 0,
                          }}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
