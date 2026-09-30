'use client';

import React, { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle, Color } from "ogl";
import Link from "next/link";
import "./SpecularButton.css";

const PAD = 20;

const applyColor = (colorObj: Color, val: string | number[] | undefined, defaultHex = '#ffffff') => {
    if (!val) {
        colorObj.set(defaultHex);
        return;
    }
    if (Array.isArray(val)) {
        colorObj.r = val[0] ?? 0;
        colorObj.g = val[1] ?? 0;
        colorObj.b = val[2] ?? 0;
        return;
    }
    let str = String(val).trim();
    if (str.startsWith('#')) {
        if (str.length === 9) {
            str = str.slice(0, 7); // Strip alpha: #RRGGBBAA -> #RRGGBB
        } else if (str.length === 5) {
            str = str.slice(0, 4); // Strip alpha: #RGBA -> #RGB
        }
    } else if (str.startsWith('rgba(')) {
        const parts = str.slice(5, -1).split(',').map((s) => parseFloat(s.trim()));
        colorObj.r = (parts[0] || 0) / 255;
        colorObj.g = (parts[1] || 0) / 255;
        colorObj.b = (parts[2] || 0) / 255;
        return;
    } else if (str.startsWith('rgb(')) {
        const parts = str.slice(4, -1).split(',').map((s) => parseFloat(s.trim()));
        colorObj.r = (parts[0] || 0) / 255;
        colorObj.g = (parts[1] || 0) / 255;
        colorObj.b = (parts[2] || 0) / 255;
        return;
    }
    try {
        colorObj.set(str);
    } catch {
        colorObj.set(defaultHex);
    }
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Dark base stroke hugging the edge for a sense of thickness
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  // Symmetric specular: the edges facing toward/away from the light both
  // catch a streak. The angular window (size + fade) is measured with an
  // elliptical normal so it varies continuously along straight edges.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

export interface SpecularButtonProps {
    children?: React.ReactNode;
    size?: "sm" | "md" | "lg";
    radius?: number;
    tint?: string;
    tintOpacity?: number;
    blur?: number;
    textColor?: string;
    lineColor?: string;
    baseColor?: string;
    intensity?: number;
    shineSize?: number;
    shineFade?: number;
    thickness?: number;
    speed?: number;
    followMouse?: boolean;
    proximity?: number;
    autoAnimate?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    className?: string;
    type?: "button" | "submit" | "reset";
    href?: string;
    style?: React.CSSProperties;
    ariaLabel?: string;
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
    children = "Get Started",
    size = "lg",
    radius = 18,
    tint = "#ffffff",
    tintOpacity = 0,
    blur = 0,
    textColor = "#f5f5f5",
    lineColor = "#ffffff",
    baseColor = "#525252",
    intensity = 1,
    shineSize = 10,
    shineFade = 40,
    thickness = 1,
    speed = 0.35,
    followMouse = true,
    proximity = 250,
    autoAnimate = false,
    disabled = false,
    onClick,
    className = "",
    type = "button",
    href,
    style,
    ariaLabel,
}) => {
    const btnRef = useRef<HTMLElement | null>(null);
    const fxRef = useRef<HTMLSpanElement | null>(null);
    const propsRef = useRef({
        radius,
        lineColor,
        baseColor,
        intensity,
        shineSize,
        shineFade,
        thickness,
        speed,
        followMouse,
        proximity,
        autoAnimate,
    });

    useEffect(() => {
        propsRef.current = {
            radius,
            lineColor,
            baseColor,
            intensity,
            shineSize,
            shineFade,
            thickness,
            speed,
            followMouse,
            proximity,
            autoAnimate,
        };
    }, [
        radius,
        lineColor,
        baseColor,
        intensity,
        shineSize,
        shineFade,
        thickness,
        speed,
        followMouse,
        proximity,
        autoAnimate,
    ]);

    useEffect(() => {
        const btn = btnRef.current;
        const fx = fxRef.current;
        if (!btn || !fx) return;

        const dpr = window.devicePixelRatio || 1;
        let renderer: Renderer;
        try {
            renderer = new Renderer({
                alpha: true,
                premultipliedAlpha: true,
                antialias: true,
                dpr,
            });
        } catch (e) {
            console.warn("[SpecularButton] WebGL initialization failed", e);
            return;
        }

        const gl = renderer.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        const geometry = new Triangle(gl);
        if ((geometry.attributes as any).uv) delete (geometry.attributes as any).uv;

        const program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uCenter: { value: [0, 0] },
                uHalfSize: { value: [1, 1] },
                uRadius: { value: 0 },
                uAngle: { value: 2.4 },
                uPx: { value: dpr },
                uLineColor: { value: [1, 1, 1] },
                uBaseColor: { value: [0.32, 0.32, 0.32] },
                uIntensity: { value: 1 },
                uShineSize: { value: 0.17 },
                uShineFade: { value: 0.7 },
                uThickness: { value: 1 },
                uBaseWidth: { value: dpr },
            },
        });

        const mesh = new Mesh(gl, { geometry, program });
        fx.appendChild(gl.canvas);

        const sizeRef = { w: 1, h: 1 };
        const resize = () => {
            const rect = btn.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            if (w === 0 || h === 0) return;
            sizeRef.w = w;
            sizeRef.h = h;
            renderer.setSize(w + PAD * 2, h + PAD * 2);
            program.uniforms.uCenter.value = [
                (PAD + w / 2) * dpr,
                (PAD + h / 2) * dpr,
            ];
            program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
        };
        const ro = new ResizeObserver(resize);
        ro.observe(btn);
        resize();

        let pointerAngle: number | null = null;
        let proximityT = 0;
        const onPointerMove = (e: PointerEvent) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = Math.max(
                rect.left - e.clientX,
                0,
                e.clientX - rect.right,
            );
            const dy = Math.max(
                rect.top - e.clientY,
                0,
                e.clientY - rect.bottom,
            );
            const dist = Math.hypot(dx, dy);
            if (dist === 0) {
                const nx = (e.clientX - cx) / (rect.width / 2 || 1);
                const ny = (cy - e.clientY) / (rect.height / 2 || 1);
                pointerAngle =
                    Math.atan2(2 / (rect.height || 1), -2 / (rect.width || 1)) +
                    nx * 0.3 +
                    ny * 0.15;
            } else {
                pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
            }
            const t = Math.max(
                0,
                1 - dist / Math.max(propsRef.current.proximity, 1),
            );
            proximityT = t * t * (3 - 2 * t);
        };
        window.addEventListener("pointermove", onPointerMove);

        let angle = 2.4;
        let idleAngle = 2.4;
        let bright = 0;
        let last = performance.now();
        let raf = 0;

        const lineC = new Color();
        const baseC = new Color();

        const update = (now: number) => {
            raf = requestAnimationFrame(update);
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const p = propsRef.current;

            idleAngle += p.speed * dt;
            const steer =
                p.followMouse &&
                pointerAngle != null &&
                (!p.autoAnimate || proximityT > 0);
            const target = (steer && pointerAngle != null) ? pointerAngle : idleAngle;
            const diff =
                ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
            angle += diff * (1 - Math.exp(-dt * 7));

            const brightTarget = p.autoAnimate ? 1 : proximityT;
            bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

            applyColor(lineC, p.lineColor, '#ffffff');
            applyColor(baseC, p.baseColor, '#525252');
            program.uniforms.uAngle.value = angle;
            program.uniforms.uRadius.value =
                Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
            program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
            program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
            program.uniforms.uIntensity.value = p.intensity * bright;
            program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
            program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
            program.uniforms.uThickness.value = p.thickness * dpr;
            renderer.render({ scene: mesh });
        };
        raf = requestAnimationFrame(update);

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            window.removeEventListener("pointermove", onPointerMove);
            if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        };
    }, []);

    const buttonProps = {
        ref: btnRef as any,
        onClick,
        className: `specular-button specular-button--${size}${className ? ` ${className}` : ""}`,
        style: {
            "--sb-radius": `${radius}px`,
            "--sb-tint": tint,
            "--sb-tint-opacity": tintOpacity,
            "--sb-blur": `${blur}px`,
            "--sb-text-color": textColor,
            ...style,
        } as React.CSSProperties,
        "aria-label": ariaLabel,
    };

    const innerContent = (
        <>
            <span
                ref={fxRef}
                className="specular-button__fx"
                aria-hidden="true"
            />
            <span className="specular-button__label">{children}</span>
        </>
    );

    if (href) {
        return (
            <Link href={href} {...buttonProps}>
                {innerContent}
            </Link>
        );
    }

    return (
        <button
            type={type}
            disabled={disabled}
            {...buttonProps}
        >
            {innerContent}
        </button>
    );
};

export default SpecularButton;
