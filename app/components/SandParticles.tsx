'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './SandParticles.css';

const DEFAULT_SHADE_COLORS = ['#0A0A0A', '#55524D', '#8E8981', '#BDB7AC'] as const;
const DEFAULT_SHADE_THRESHOLDS = [0.25, 0.50, 0.75] as const;
const DEFAULT_SHADE_PROBS = [1.0, 0.88, 0.62, 0.38] as const;
const DEFAULT_LEVELS_LOW_PERCENTILE = 0.03;
const DEFAULT_LEVELS_HIGH_PERCENTILE = 0.97;
const MAX_GRID_PARTICLES = 45000;

export interface SandParticlesProps {
  imageSrc: string;
  cellPx?: number;
  dotFill?: number;
  dotShape?: 'square' | 'round';
  mouseRadius?: number;
  repulsion?: number;
  returnSpeed?: number;
  friction?: number;
  shadeColors?: readonly [string, string, string, string];
  shadeThresholds?: readonly [number, number, number];
  shadeProbs?: readonly [number, number, number, number];
  levelsLowPercentile?: number;
  levelsHighPercentile?: number;
  className?: string;
}

export const SandParticles: React.FC<SandParticlesProps> = ({
  imageSrc,
  cellPx,
  dotFill = 0.75,
  dotShape = 'square',
  mouseRadius = 0.6,
  repulsion = 0.14,
  returnSpeed = 0.02,
  friction = 0.85,
  shadeColors = DEFAULT_SHADE_COLORS,
  shadeThresholds = DEFAULT_SHADE_THRESHOLDS,
  shadeProbs = DEFAULT_SHADE_PROBS,
  levelsLowPercentile = DEFAULT_LEVELS_LOW_PERCENTILE,
  levelsHighPercentile = DEFAULT_LEVELS_HIGH_PERCENTILE,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    container.dataset.ready = 'false';

    let width = container.clientWidth || 400;
    let height = container.clientHeight || 500;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Clear transparent background, no white box
    container.appendChild(renderer.domElement);

    // 2. Physics & Raycasting references
    const raycaster = new THREE.Raycaster();
    const mouseNorm = new THREE.Vector2(-9999, -9999);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    let isMouseOver = false;
    let isSleeping = false;
    let animFrameId: number;

    let points: THREE.Points | null = null;
    let geometry: THREE.BufferGeometry | null = null;
    let material: THREE.ShaderMaterial | null = null;
    let loadedTexture: THREE.Texture | null = null;

    let homePositions: Float32Array;
    let velocities: Float32Array;
    let currentPositions: Float32Array;
    let normalizedUVs: Float32Array;
    let totalParticleCount = 0;
    let gridCols = 0;
    let gridRows = 0;
    let pointSizePhysicalPx = 0;
    let imgAspect = 1.5;

    // Helper to calculate grid dimensions to fit nicely within camera frustum
    const calculateGridBounds = (cam: THREE.PerspectiveCamera, w: number, h: number) => {
      const vFov = (cam.fov * Math.PI) / 180;
      const viewH = 2 * Math.tan(vFov / 2) * cam.position.z;
      const viewW = viewH * (w / h);

      let gridW = viewW * 0.98;
      let gridH = gridW / imgAspect;
      if (gridH > viewH * 0.98) {
        gridH = viewH * 0.98;
        gridW = gridH * imgAspect;
      }
      return { gridW, gridH };
    };

    const updateHomePositions = (w: number, h: number) => {
      if (!homePositions || totalParticleCount === 0) return;
      const { gridW, gridH } = calculateGridBounds(camera, w, h);

      for (let i = 0; i < totalParticleCount; i++) {
        const u = normalizedUVs[i * 2];
        const v = normalizedUVs[i * 2 + 1];
        const x = (u - 0.5) * gridW;
        const y = (v - 0.5) * gridH;
        homePositions[i * 3] = x;
        homePositions[i * 3 + 1] = y;
        homePositions[i * 3 + 2] = 0;
      }
    };

    const syncParticleGrid = (w: number, h: number) => {
      const { gridW, gridH } = calculateGridBounds(camera, w, h);
      const viewH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const gridWidthInCssPx = gridW * h / viewH;
      const gridHeightInCssPx = gridH * h / viewH;
      let effectiveCellPx = Math.max(1, cellPx ?? (window.innerWidth < 768 ? 5 : 4));
      let cols = Math.max(2, Math.round(gridWidthInCssPx / effectiveCellPx));
      let rows = Math.max(2, Math.round(gridHeightInCssPx / effectiveCellPx));
      while (cols * rows > MAX_GRID_PARTICLES) {
        effectiveCellPx *= Math.sqrt((cols * rows) / MAX_GRID_PARTICLES) * 1.01;
        cols = Math.max(2, Math.round(gridWidthInCssPx / effectiveCellPx));
        rows = Math.max(2, Math.round(gridHeightInCssPx / effectiveCellPx));
      }

      const cellWorldSize = gridW / cols;
      const cellScreenPx = cellWorldSize * h / viewH;
      pointSizePhysicalPx = cellScreenPx * Math.min(0.85, Math.max(0.7, dotFill)) * renderer.getPixelRatio();

      if (geometry && gridCols === cols && gridRows === rows) {
        updateHomePositions(w, h);
      } else {
        const previousGeometry = geometry;
        const totalParticles = cols * rows;
        totalParticleCount = totalParticles;
        gridCols = cols;
        gridRows = rows;
        geometry = new THREE.BufferGeometry();
        homePositions = new Float32Array(totalParticles * 3);
        velocities = new Float32Array(totalParticles * 3);
        currentPositions = new Float32Array(totalParticles * 3);
        normalizedUVs = new Float32Array(totalParticles * 2);

        let idx = 0;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i3 = idx * 3;
            const i2 = idx * 2;
            const u = c / (cols - 1);
            const v = 1 - r / (rows - 1);
            const x = (u - 0.5) * gridW;
            const y = (v - 0.5) * gridH;

            homePositions[i3] = x;
            homePositions[i3 + 1] = y;
            currentPositions[i3] = x;
            currentPositions[i3 + 1] = y;
            normalizedUVs[i2] = u;
            normalizedUVs[i2 + 1] = v;
            idx++;
          }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
        geometry.setAttribute('referenceUV', new THREE.BufferAttribute(normalizedUVs, 2));
        if (points) points.geometry = geometry;
        previousGeometry?.dispose();
      }

      if (material) {
        material.uniforms.uGrid.value.set(cols, rows);
        material.uniforms.uPointSize.value = pointSizePhysicalPx;
      }
    };

    // 3. Load image & construct particle grid
    const loader = new THREE.TextureLoader();
    loader.load(
      imageSrc,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }
        loadedTexture = texture;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const imgWidth = texture.image.naturalWidth || texture.image.width || 800;
        const imgHeight = texture.image.naturalHeight || texture.image.height || 500;
        imgAspect = imgWidth / imgHeight;

        // Measure each hand independently, ignoring the transparent background.
        let low = 0;
        let high = 1;
        const sampleCanvas = document.createElement('canvas');
        sampleCanvas.width = 256;
        sampleCanvas.height = Math.max(1, Math.round(256 * imgHeight / imgWidth));
        const sampleContext = sampleCanvas.getContext('2d', { willReadFrequently: true });
        if (sampleContext) {
          sampleContext.drawImage(texture.image, 0, 0, sampleCanvas.width, sampleCanvas.height);
          const pixels = sampleContext.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;
          const brightnessSamples: number[] = [];
          for (let i = 0; i < pixels.length; i += 4) {
            if (pixels[i + 3] > 127.5) {
              brightnessSamples.push((0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2]) / 255);
            }
          }
          if (brightnessSamples.length > 0) {
            brightnessSamples.sort((a, b) => a - b);
            const last = brightnessSamples.length - 1;
            low = brightnessSamples[Math.floor(last * levelsLowPercentile)];
            high = brightnessSamples[Math.floor(last * levelsHighPercentile)];
          }
        }

        syncParticleGrid(width, height);

        // 4. Custom GLSL Shaders: four shades on an ordered pixel grid
        material = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uShadeColors: { value: shadeColors.map((color) => new THREE.Color(color).convertLinearToSRGB()) },
            uShadeThresholds: { value: shadeThresholds },
            uShadeProbs: { value: shadeProbs },
            uLow: { value: low },
            uHigh: { value: high },
            uGrid: { value: new THREE.Vector2(gridCols, gridRows) },
            uPointSize: { value: pointSizePhysicalPx },
            uRound: { value: dotShape === 'round' ? 1 : 0 },
          },
          vertexShader: `
            attribute vec2 referenceUV;
            varying vec2 vUv;

            uniform float uPointSize;

            void main() {
              vUv = referenceUV;
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = uPointSize;
              gl_Position = projectionMatrix * mvPos;
            }
          `,
          fragmentShader: `
            uniform sampler2D uTexture;
            uniform vec3 uShadeColors[4];
            uniform float uShadeThresholds[3];
            uniform float uShadeProbs[4];
            uniform float uLow;
            uniform float uHigh;
            uniform vec2 uGrid;
            uniform float uRound;

            varying vec2 vUv;

            void main() {
              if (uRound > 0.5) {
                vec2 coord = 2.0 * gl_PointCoord - 1.0;
                if (dot(coord, coord) > 1.0) discard;
              }

              // Sample preprocessed clean image texture
              vec4 texColor = texture2D(uTexture, vUv);

              // Discard any transparent background pixel (true alpha < 0.5)
              if (texColor.a < 0.5) discard;

              // Luminance calculation
              float brightness = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

              // Safety discard for pure white background (> 0.985)
              if (brightness > 0.985) discard;

              float b = clamp((brightness - uLow) / max(uHigh - uLow, 0.001), 0.0, 1.0);

              // Blend color and density across a 0.04-wide region at each band edge.
              float prob = uShadeProbs[0];
              vec3 col = uShadeColors[0];
              for (int i = 0; i < 3; i++) {
                float t = smoothstep(uShadeThresholds[i] - 0.02, uShadeThresholds[i] + 0.02, b);
                prob = mix(prob, uShadeProbs[i + 1], t);
                col = mix(col, uShadeColors[i + 1], t);
              }

              // Bayer 4x4: 0 8 2 10 / 12 4 14 6 / 3 11 1 9 / 15 7 13 5.
              // Reference UV anchors the pattern to home cells during mouse movement.
              vec2 cell = floor(vUv * (uGrid - 1.0) + 0.5);
              vec2 cell4 = mod(cell, 4.0);
              vec2 loBits = mod(cell4, 2.0);
              vec2 hiBits = floor(cell4 * 0.5);
              float lowRank = 2.0 * loBits.x + 3.0 * loBits.y - 4.0 * loBits.x * loBits.y;
              float highRank = 2.0 * hiBits.x + 3.0 * hiBits.y - 4.0 * hiBits.x * hiBits.y;
              float bayer = (4.0 * lowRank + highRank + 0.5) / 16.0;
              if (bayer >= prob) discard;

              // Surviving square or round dots are fully opaque.
              gl_FragColor = vec4(col, 1.0);
            }
          `,
          transparent: true,
          depthWrite: false,
        });

        points = new THREE.Points(geometry as THREE.BufferGeometry, material);
        scene.add(points);

        wakeUp();
      },
      undefined,
      (err) => {
        if (!disposed) console.error('[SandParticles] Failed to load image at:', imageSrc, err);
      }
    );

    // 5. Physics Simulation & Render Loop
    let idleFrames = 0;

    const tick = () => {
      if (disposed || !geometry || !points) return;

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const count = pos.length / 3;

      if (isMouseOver) {
        raycaster.setFromCamera(mouseNorm, camera);
        raycaster.ray.intersectPlane(zPlane, mouseWorld);
      }

      let maxMovement = 0;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const px = pos[i3];
        const py = pos[i3 + 1];
        const pz = pos[i3 + 2];
        const hx = homePositions[i3];
        const hy = homePositions[i3 + 1];
        const hz = homePositions[i3 + 2];

        // Mouse repulsion
        if (isMouseOver) {
          const dx = px - mouseWorld.x;
          const dy = py - mouseWorld.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouseRadius * mouseRadius) {
            const dist = Math.sqrt(distSq);
            const force = (mouseRadius - dist) / mouseRadius;
            if (dist > 0.0001) {
              velocities[i3] += (dx / dist) * force * repulsion;
              velocities[i3 + 1] += (dy / dist) * force * repulsion;
            }
            // Subtle random Z-depth dispersion
            velocities[i3 + 2] += (Math.random() - 0.5) * force * repulsion * 0.8;
          }
        }

        // Return spring force towards home position
        velocities[i3] += (hx - px) * returnSpeed;
        velocities[i3 + 1] += (hy - py) * returnSpeed;
        velocities[i3 + 2] += (hz - pz) * returnSpeed;

        // Friction / damping
        velocities[i3] *= friction;
        velocities[i3 + 1] *= friction;
        velocities[i3 + 2] *= friction;

        // Update positions
        pos[i3] += velocities[i3];
        pos[i3 + 1] += velocities[i3 + 1];
        pos[i3 + 2] += velocities[i3 + 2];

        // Track max movement to decide idle sleep mode
        if (!isMouseOver) {
          const move =
            Math.abs(velocities[i3]) +
            Math.abs(velocities[i3 + 1]) +
            Math.abs(velocities[i3 + 2]);
          if (move > maxMovement) maxMovement = move;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
      if (container.dataset.ready !== 'true') {
        container.dataset.ready = 'true';
      }

      // Auto-sleep when settled
      if (!isMouseOver && maxMovement < 0.0004) {
        idleFrames++;
        if (idleFrames > 8) {
          isSleeping = true;
          return;
        }
      } else {
        idleFrames = 0;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    const wakeUp = () => {
      if (disposed) return;
      if (isSleeping) {
        isSleeping = false;
        idleFrames = 0;
        animFrameId = requestAnimationFrame(tick);
      } else if (!animFrameId) {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    // 6. Pointer Event Listeners
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNorm.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNorm.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      isMouseOver = true;
      wakeUp();
    };

    const handlePointerLeave = () => {
      isMouseOver = false;
      mouseNorm.set(-9999, -9999);
      wakeUp();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          width = newW;
          height = newH;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.setSize(width, height);
          if (loadedTexture) syncParticleGrid(width, height);
          wakeUp();
        }
      }
    });

    resizeObserver.observe(container);

    // 8. Cleanup on unmount
    return () => {
      disposed = true;
      cancelAnimationFrame(animFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      resizeObserver.disconnect();

      if (points) scene.remove(points);
      geometry?.dispose();
      material?.dispose();
      loadedTexture?.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      container.dataset.ready = 'false';
    };
  }, [
    imageSrc,
    cellPx,
    dotFill,
    dotShape,
    mouseRadius,
    repulsion,
    returnSpeed,
    friction,
    shadeColors,
    shadeThresholds,
    shadeProbs,
    levelsLowPercentile,
    levelsHighPercentile,
  ]);

  return (
    <div
      ref={containerRef}
      className={`sand-particles relative w-full h-full overflow-hidden select-none ${className}`}
      data-ready="false"
      style={{ touchAction: 'none' }}
    >
      {/* Reuse the exact PNG that TextureLoader samples, including its alpha. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        crossOrigin="anonymous"
        decoding="async"
        className="sand-particles__placeholder"
      />
    </div>
  );
};

export default SandParticles;
