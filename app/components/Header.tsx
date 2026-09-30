'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import SpecularButton from './SpecularButton';
import { useLenis } from './SmoothScroll';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<any[]>([]);
  const activeTweenRefs = useRef<any[]>([]);

  const { lenis, scrollTo } = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (lenis) {
      const onLenisScroll = (e: any) => {
        const currentScroll = e?.scroll ?? window.scrollY;
        setScrolled(currentScroll > 50);
      };
      lenis.on('scroll', onLenisScroll);
      return () => {
        window.removeEventListener('scroll', onScroll);
        lenis.off('scroll', onLenisScroll);
      };
    }

    return () => window.removeEventListener('scroll', onScroll);
  }, [lenis]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // GSAP hover-circle-fill animation for nav links
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        if (w === 0 || h === 0) return;

        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease: 'power3.easeOut', overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.35,
      ease: 'power3.easeOut',
      overwrite: 'auto',
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.25,
      ease: 'power3.easeOut',
      overwrite: 'auto',
    });
  };

  return (
    <>
      <header
        id="site-header"
        className={`fixed top-0 left-0 right-0 flex justify-center ${menuOpen ? 'z-[70]' : 'z-50'}`}
        style={{
          padding: scrolled ? '8px 16px' : '16px 16px',
          transition: 'padding 0.3s ease',
        }}
      >
        {/* Ambient shadow halo above/behind the header */}
        <div
          className="header-halo pointer-events-none"
          aria-hidden="true"
          style={{
            opacity: menuOpen ? 0 : 1,
          }}
        />

        <nav
          className={`flex items-center justify-between w-full relative z-10`}
          style={{
            maxWidth: '1200px',
            borderRadius: '9999px',
            backgroundColor: menuOpen ? 'transparent' : 'rgba(227, 218, 204, 0.78)',
            backdropFilter: menuOpen ? 'none' : 'blur(26px) saturate(140%)',
            WebkitBackdropFilter: menuOpen ? 'none' : 'blur(26px) saturate(140%)',
            border: menuOpen ? '1px solid transparent' : '1px solid var(--color-black)',
            padding: scrolled ? '6px 8px 6px 18px' : '10px 10px 10px 22px',
            transition: 'padding 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease, -webkit-backdrop-filter 0.3s ease',
          }}
        >
          {/* Left: "HEGXAI" wordmark in a solid black pill */}
          <Link
            href="/"
            className="flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
            style={{
              border: menuOpen ? '1px solid var(--color-white)' : '1px solid #000000',
              borderRadius: '9999px',
              padding: '6px 16px',
              backgroundColor: '#000000',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              letterSpacing: '0.04em',
              color: '#E3DACC',
              textDecoration: 'none',
              transition: 'color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
            }}
            aria-label="HEGXAI Home"
          >
            HEGXAI
          </Link>

          {/* Middle: Services / Pricing / About with hover-circle-fill animation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className="pill-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(link.href, { offset: -110, duration: 1.2 });
                }}
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={() => handleLeave(i)}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 18px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.02em',
                }}
              >
                <span
                  className="hover-circle"
                  aria-hidden="true"
                  ref={(el) => {
                    circleRefs.current[i] = el;
                  }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 0,
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-black)',
                    zIndex: 1,
                    display: 'block',
                    pointerEvents: 'none',
                    willChange: 'transform',
                  }}
                />
                <span
                  className="label-stack"
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                    lineHeight: 1,
                    zIndex: 2,
                  }}
                >
                  <span
                    className="pill-label"
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'inline-block',
                      lineHeight: 1,
                      color: 'var(--color-black)',
                      willChange: 'transform',
                    }}
                  >
                    {link.label}
                  </span>
                  <span
                    className="pill-label-hover"
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      color: 'var(--color-white)',
                      zIndex: 3,
                      display: 'inline-block',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {link.label}
                  </span>
                </span>
              </a>
            ))}
          </div>

          {/* Right: "Connect" button + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Connect Button (desktop) with Specular rim-shine */}
            <div className="hidden md:inline-flex">
              <SpecularButton
                href="#connect"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo('#connect', { offset: -110, duration: 1.2 });
                }}
                size="sm"
                radius={9999}
                baseColor="#E3DACC"
                lineColor="#ffffff"
                textColor="#E3DACC"
                tintOpacity={0}
                blur={0}
                intensity={0.9}
                shineSize={12}
                shineFade={35}
                followMouse={true}
                proximity={200}
                autoAnimate={false}
                className="bg-black text-[#E3DACC] no-underline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2"
                style={{
                  borderRadius: '9999px',
                  padding: '10px 24px',
                  backgroundColor: 'var(--color-black)',
                  color: '#E3DACC',
                  fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                Connect
              </SpecularButton>
            </div>

            {/* Hamburger (mobile) */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden flex items-center justify-center bg-black"
              style={{
                border: 'none',
                borderRadius: '9999px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                position: 'relative',
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <div
                style={{
                  width: '18px',
                  height: '14px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: '1px',
                    transition: 'transform 0.3s ease, opacity 0.2s ease',
                    transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: '1px',
                    transition: 'opacity 0.2s ease',
                    opacity: menuOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--color-white)',
                    borderRadius: '1px',
                    transition: 'transform 0.3s ease, opacity 0.2s ease',
                    transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                  }}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Full-screen Menu */}
      <div
        id="mobile-menu"
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center md:hidden"
        style={{
          backgroundColor: 'var(--color-black)',
          width: '100vw',
          height: '100dvh',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="flex flex-col items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                closeMenu();
                scrollTo(link.href, { offset: -110, duration: 1.2 });
              }}
              className="text-white no-underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
              style={{
                fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '32px',
                transition: 'opacity 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#connect"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              scrollTo('#connect', { offset: -110, duration: 1.2 });
            }}
            className="text-black no-underline bg-white flex items-center justify-center focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
            style={{
              borderRadius: '9999px',
              padding: '14px 40px',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
              fontWeight: 600,
              fontSize: '18px',
              marginTop: '16px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Connect
          </a>
        </nav>
      </div>
    </>
  );
}
