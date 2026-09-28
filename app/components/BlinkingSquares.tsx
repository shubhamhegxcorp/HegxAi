'use client';

import React, { useEffect, useRef, useCallback } from 'react';

export interface BlinkingSquaresProps {
  direction?: 'right' | 'left' | 'bottom' | 'top';
  gridSize?: number;
  squareSize?: number;
  fadeStart?: number;
  fadeEnd?: number;
  falloff?: number;
  minBrightness?: number;
  twinkleSpeed?: number;
  twinkleStrength?: number;
  intensity?: number;
  opacity?: number;
  squareColor?: string;
  backgroundColor?: string;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const DEFAULTS: Required<Omit<BlinkingSquaresProps, 'className' | 'style' | 'children'>> = {
  direction: 'right',
  gridSize: 52,
  squareSize: 0.57,
  fadeStart: 0.65,
  fadeEnd: 1.0,
  falloff: 1.25,
  minBrightness: 0.55,
  twinkleSpeed: 1.4,
  twinkleStrength: 0.94,
  intensity: 1.0,
  opacity: 1.0,
  squareColor: '#BB29FF',
  backgroundColor: 'transparent',
  dpr: 1.5,
};

function hex2rgb(h: string): [number, number, number] {
  const c = h.replace('#', '');
  return [
    parseInt(c.slice(0, 2), 16) || 0,
    parseInt(c.slice(2, 4), 16) || 0,
    parseInt(c.slice(4, 6), 16) || 0,
  ];
}

interface SquareItem {
  x: number;
  y: number;
  size: number;
  brightness: number;
  phase: number;
}

interface CanvasWithCss extends HTMLCanvasElement {
  _cssW?: number;
  _cssH?: number;
}

function useBlinkingSquares(
  canvasRef: React.RefObject<CanvasWithCss | null>,
  cfg: Required<Omit<BlinkingSquaresProps, 'className' | 'style' | 'children'>>
) {
  const squaresRef = useRef<SquareItem[]>([]);
  const rafRef = useRef<number | null>(null);
  const cfgRef = useRef(cfg);
  cfgRef.current = cfg;
  const redrawRef = useRef<(() => void) | null>(null);

  const build = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { direction, gridSize, fadeStart, fadeEnd, falloff, minBrightness } = cfgRef.current;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const effectiveGridSize = isMobile ? Math.max(gridSize, 40) : gridSize;

    const W = canvas._cssW || canvas.offsetWidth || 800;
    const H = canvas._cssH || canvas.offsetHeight || 450;
    const cellSize = effectiveGridSize;
    const cols = Math.ceil(W / cellSize) + 1;
    const rows = Math.ceil(H / cellSize) + 1;
    const squares: SquareItem[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = cols > 1 ? c / (cols - 1) : 0;
        const ny = rows > 1 ? r / (rows - 1) : 0;
        const t =
          direction === 'right'
            ? nx
            : direction === 'left'
            ? 1 - nx
            : direction === 'bottom'
            ? ny
            : 1 - ny;
        let d = (t - fadeStart) / Math.max(fadeEnd - fadeStart, 0.001);
        d = Math.pow(Math.max(0, Math.min(1, d)), falloff);
        if (Math.random() > d) continue;
        squares.push({
          x: c * cellSize,
          y: r * cellSize,
          size: cellSize,
          brightness: minBrightness + Math.random() * (1 - minBrightness),
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    squaresRef.current = squares;

    // Trigger static frame draw if loop is idle
    if (redrawRef.current) {
      redrawRef.current();
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function applySize() {
      if (!canvas) return;
      const ratio = Math.min(window.devicePixelRatio || 1, cfgRef.current.dpr);
      const w = canvas.offsetWidth || 800;
      const h = canvas.offsetHeight || 450;
      canvas.width = Math.round(w * ratio);
      canvas.height = Math.round(h * ratio);
      canvas._cssW = w;
      canvas._cssH = h;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      }
      build();
    }

    applySize();
    const ro = new ResizeObserver(applySize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [canvasRef, build]);

  useEffect(() => {
    build();
  }, [
    cfg.direction,
    cfg.gridSize,
    cfg.squareSize,
    cfg.fadeStart,
    cfg.fadeEnd,
    cfg.falloff,
    cfg.minBrightness,
    build,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isVisible = true;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderFrame(ts = 0) {
      if (!canvas || !ctx) return;
      const c = cfgRef.current;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const effectiveGridSize = isMobile ? Math.max(c.gridSize, 40) : c.gridSize;
      const t = ts * 0.001;
      const [sr, sg, sb] = hex2rgb(c.squareColor);
      const W = canvas._cssW || canvas.offsetWidth || 800;
      const H = canvas._cssH || canvas.offsetHeight || 450;

      ctx.clearRect(0, 0, W, H);
      if (c.backgroundColor && c.backgroundColor !== 'transparent') {
        ctx.fillStyle = c.backgroundColor;
        ctx.fillRect(0, 0, W, H);
      }

      const cellSize = effectiveGridSize;
      const sz = cellSize * c.squareSize;
      const offset = (cellSize - sz) / 2;

      for (const s of squaresRef.current) {
        // If reduced motion is preferred, use a static non-twinkling intensity
        const osc = prefersReducedMotion
          ? 0
          : Math.sin(s.phase + t * c.twinkleSpeed * Math.PI * 2);
        const twinkle = prefersReducedMotion
          ? 1
          : 1 - c.twinkleStrength * (0.5 - osc * 0.5);
        const a = Math.min(1, s.brightness * twinkle * c.intensity * c.opacity);
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${a.toFixed(3)})`;
        ctx.fillRect(s.x + offset, s.y + offset, sz, sz);
      }
    }

    redrawRef.current = () => renderFrame(performance.now());

    function draw(ts: number) {
      if (!isVisible) return;
      renderFrame(ts);
      if (!prefersReducedMotion) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    function startLoop() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (prefersReducedMotion) {
        renderFrame(0);
      } else if (isVisible) {
        rafRef.current = requestAnimationFrame(draw);
      }
    }

    function stopLoop() {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    // IntersectionObserver to pause rAF loop when offscreen
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : true;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    startLoop();

    return () => {
      stopLoop();
      io.disconnect();
      redrawRef.current = null;
    };
  }, [canvasRef]);
}

export default function BlinkingSquares({
  direction = DEFAULTS.direction,
  gridSize = DEFAULTS.gridSize,
  squareSize = DEFAULTS.squareSize,
  fadeStart = DEFAULTS.fadeStart,
  fadeEnd = DEFAULTS.fadeEnd,
  falloff = DEFAULTS.falloff,
  minBrightness = DEFAULTS.minBrightness,
  twinkleSpeed = DEFAULTS.twinkleSpeed,
  twinkleStrength = DEFAULTS.twinkleStrength,
  intensity = DEFAULTS.intensity,
  opacity = DEFAULTS.opacity,
  squareColor = DEFAULTS.squareColor,
  backgroundColor = DEFAULTS.backgroundColor,
  dpr = DEFAULTS.dpr,
  className = '',
  style = {},
  children,
}: BlinkingSquaresProps) {
  const canvasRef = useRef<CanvasWithCss | null>(null);

  useBlinkingSquares(canvasRef, {
    direction,
    gridSize,
    squareSize,
    fadeStart,
    fadeEnd,
    falloff,
    minBrightness,
    twinkleSpeed,
    twinkleStrength,
    intensity,
    opacity,
    squareColor,
    backgroundColor,
    dpr,
  });

  const classes = `relative overflow-hidden ${className}`;

  return (
    <div className={classes} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full w-full h-full" />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
