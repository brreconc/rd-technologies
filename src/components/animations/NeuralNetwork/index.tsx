"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

/**
 * Fondo de RED NEURONAL animada (Fase 8.1). Nodos que derivan lentamente, se
 * conectan cuando están próximos y "pulsos de datos" que viajan por las
 * conexiones — evoca datos moviéndose por una red neuronal (mensaje: tecnología
 * de vanguardia + seguridad).
 *
 * Implementación propia en `<canvas>` (sin librerías → cero peso extra de bundle,
 * compatible con la CSP estricta: no hay scripts externos). Cuidados:
 *  - `prefers-reduced-motion` → pinta UN fotograma estático (sin bucle rAF).
 *  - Se pausa cuando el hero sale del viewport o la pestaña queda oculta
 *    (IntersectionObserver + visibilitychange) → nada de CPU/batería en balde.
 *  - DPR limitado a 2 y nº de nodos acotado por área → estable en portátiles.
 *  - `aria-hidden`: es decoración pura; sin JS el canvas queda vacío y el hero
 *    conserva su degradado de fondo.
 */
export function NeuralNetwork({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const CONNECT = 160; // distancia máx. de conexión (px)
    const CYAN = "0,245,255";
    const PURPLE = "139,92,246";

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    interface Pulse {
      i: number;
      j: number;
      t: number;
      speed: number;
      color: string;
    }

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let edges: Array<[number, number]> = [];
    let pulses: Pulse[] = [];
    let raf = 0;
    let frame = 0;
    let running = false;

    const isDark = () =>
      document.documentElement.classList.contains("dark") ||
      !document.documentElement.classList.contains("light");

    const computeEdges = () => {
      edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          if (dx * dx + dy * dy < CONNECT * CONNECT) edges.push([i, j]);
        }
      }
    };

    const build = () => {
      const count = Math.max(16, Math.min(58, Math.floor((width * height) / 17000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }));
      pulses = [];
      computeEdges();
    };

    const resize = () => {
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const spawnPulse = () => {
      if (edges.length === 0 || pulses.length > 16) return;
      const [i, j] = edges[(Math.random() * edges.length) | 0];
      pulses.push({
        i,
        j,
        t: 0,
        speed: 0.005 + Math.random() * 0.009,
        color: Math.random() > 0.5 ? CYAN : PURPLE,
      });
    };

    const render = (animate: boolean) => {
      const dark = isDark();
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
        if (frame % 24 === 0) computeEdges();
      }

      // Conexiones (más brillantes cuanto más cerca).
      const lineRGB = dark ? "150,170,190" : "70,90,120";
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = nodes[i];
        const b = nodes[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const alpha = (1 - dist / CONNECT) * (dark ? 0.16 : 0.13);
        ctx.strokeStyle = `rgba(${lineRGB},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Nodos.
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},${dark ? 0.55 : 0.4})`;
        ctx.fill();
      }

      // Pulsos de datos.
      if (animate) {
        if (frame % 10 === 0) spawnPulse();
        for (let k = pulses.length - 1; k >= 0; k--) {
          const p = pulses[k];
          p.t += p.speed;
          const a = nodes[p.i];
          const b = nodes[p.j];
          if (p.t >= 1 || !a || !b) {
            pulses.splice(k, 1);
            continue;
          }
          const x = a.x + (b.x - a.x) * p.t;
          const y = a.y + (b.y - a.y) * p.t;
          const halo = ctx.createRadialGradient(x, y, 0, x, y, 7);
          halo.addColorStop(0, `rgba(${p.color},0.9)`);
          halo.addColorStop(1, `rgba(${p.color},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${dark ? 0.9 : 0.75})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      frame++;
      render(true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduce) {
      render(false); // un fotograma estático, sin bucle
    } else {
      start();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) render(false);
    });
    ro.observe(parent);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(parent);

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduce]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 h-full w-full", className)}
    />
  );
}
