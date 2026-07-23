"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import {
  BOOT,
  buildAdjacency,
  clamp01,
  computeEdges,
  connectDistanceFor,
  createNodes,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  kindForIndex,
  nodeCountFor,
  pickThreatPath,
  progress,
  radiusForKind,
  type SceneEdge,
  type SceneNode,
} from "./engine";

const CYAN = "0,245,255";
const PURPLE = "139,92,246";
const RED = "255,107,107";

/** Cada cuántos fotogramas se recalcula la vecindad (las aristas). */
const EDGE_REFRESH = 30;
/** Radio de influencia del puntero (px). */
const POINTER_RADIUS = 190;
/** Periodo del barrido ambiental una vez arrancada la escena (ms). */
const AMBIENT_SCAN_PERIOD = 11_000;
const AMBIENT_SCAN_DURATION = 1800;

interface Packet {
  /** Ruta de nodos que recorre (2 saltos = 3 nodos para las intrusiones). */
  path: number[];
  leg: number;
  t: number;
  /** Progreso por milisegundo. */
  speed: number;
  threat: boolean;
  /** Acento del paquete de datos (cian o violeta). */
  rgb: string;
}

interface Burst {
  x: number;
  y: number;
  start: number;
  rgb: string;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  start: number;
}

/**
 * Sprite de resplandor pre-renderizado. Dibujar un `drawImage` es MUCHO más
 * barato que crear un `createRadialGradient` por partícula y fotograma, que era
 * el principal coste de la versión anterior (§11).
 */
function makeGlowSprite(rgb: string, size = 64): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const sctx = sprite.getContext("2d");
  if (!sctx) return sprite;
  const r = size / 2;
  const gradient = sctx.createRadialGradient(r, r, 0, r, r, r);
  gradient.addColorStop(0, `rgba(${rgb},1)`);
  gradient.addColorStop(0.45, `rgba(${rgb},0.35)`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  sctx.fillStyle = gradient;
  sctx.fillRect(0, 0, size, size);
  return sprite;
}

interface NeuralNetworkProps {
  className?: string;
  /** Se llama cada vez que un escudo neutraliza una intrusión (para el HUD). */
  onThreatBlocked?: () => void;
}

/**
 * Fondo del hero: una MALLA NEURONAL SEGURA que se construye sola y se defiende
 * (Fase 9 — ADR-011). Narra los dos mensajes de la marca en un solo plano:
 *
 *  1. **Creación de software** — al cargar, un barrido de escaneo recorre el
 *     hero, los nodos se encienden en onda desde el centro y las aristas se
 *     "dibujan" solas: la red se compila delante del usuario.
 *  2. **Ciberseguridad** — por la malla circulan paquetes de datos y, cada pocos
 *     segundos, entra una intrusión (roja) desde la periferia que un nodo escudo
 *     intercepta: destello, onda de choque y disolución en partículas.
 *
 * Además reacciona al puntero (los nodos y enlaces cercanos se iluminan) y al
 * clic (emite una onda). Todo en un único `<canvas>` propio, sin librerías → sin
 * coste de bundle y compatible con la CSP estricta (ADR-009).
 *
 * Salvaguardas (§10/§11):
 *  - `prefers-reduced-motion` → un ÚNICO fotograma con la red ya construida.
 *  - Se pausa al salir del viewport o al ocultarse la pestaña.
 *  - DPR limitado a 2 y nº de nodos acotado por área.
 *  - Aristas pintadas por lotes de opacidad (5 `stroke()` por fotograma en vez
 *    de uno por arista) y resplandores con sprites pre-renderizados.
 *  - Degradación automática: si los fotogramas se encarecen, baja la carga.
 *  - `aria-hidden`: decoración pura; sin JS el hero conserva su degradado.
 */
export function NeuralNetwork({ className, onThreatBlocked }: NeuralNetworkProps) {
  const reduce = useReducedMotion();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // El callback se guarda en una ref para que cambiar de identidad no reinicie
  // la escena (el efecto solo depende de `reduce`).
  const onBlockedRef = React.useRef(onThreatBlocked);
  React.useEffect(() => {
    onBlockedRef.current = onThreatBlocked;
  }, [onThreatBlocked]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const glow = {
      cyan: makeGlowSprite(CYAN),
      purple: makeGlowSprite(PURPLE),
      red: makeGlowSprite(RED),
    };

    let width = 0;
    let height = 0;
    let connect = 160;
    let nodes: SceneNode[] = [];
    let edges: SceneEdge[] = [];
    let adjacency: number[][] = [];
    /** Geometría de las aristas del fotograma actual: [x1,y1,x2,y2] por arista. */
    let edgeGeom = new Float32Array(0);
    let edgeBucket = new Uint8Array(0);

    let packets: Packet[] = [];
    let bursts: Burst[] = [];
    let sparks: Spark[] = [];

    let raf = 0;
    let frame = 0;
    let running = false;
    let dark = true;
    // Reloj de la escena: acumula solo el tiempo en que la escena está VISIBLE,
    // de modo que pausar y reanudar no salta la línea temporal del arranque.
    let sceneTime = 0;
    let lastStamp = 0;
    let slowFrames = 0;
    let lowPower = false;

    const pointer = { x: 0, y: 0, strength: 0, target: 0 };

    const readTheme = () => {
      const root = document.documentElement;
      dark = root.classList.contains("dark") || !root.classList.contains("light");
    };

    // ---------------------------------------------------------------- escena
    const refreshEdges = () => {
      edges = computeEdges(nodes, connect, width, height);
      adjacency = buildAdjacency(nodes.length, edges);
      if (edgeGeom.length !== edges.length * 4) {
        edgeGeom = new Float32Array(edges.length * 4);
        edgeBucket = new Uint8Array(edges.length);
      }
    };

    const build = () => {
      const count = nodeCountFor(width, height);
      connect = connectDistanceFor(width, height, count);
      nodes = createNodes(width, height, count);
      packets = [];
      bursts = [];
      sparks = [];
      refreshEdges();
    };

    /**
     * Reajusta la escena a un tamaño nuevo SIN reconstruirla: las posiciones se
     * escalan y solo se añaden/quitan nodos al final. Así un cambio de tamaño
     * (o el colapso de la barra del navegador en móvil) no vuelve a reproducir
     * la secuencia de arranque.
     */
    const rescale = (prevW: number, prevH: number) => {
      const sx = prevW > 0 ? width / prevW : 1;
      const sy = prevH > 0 ? height / prevH : 1;
      for (const node of nodes) {
        node.x *= sx;
        node.y *= sy;
      }
      const count = nodeCountFor(width, height);
      connect = connectDistanceFor(width, height, count);
      if (count < nodes.length) {
        nodes.length = count;
        packets = packets.filter((p) => p.path.every((i) => i < count));
      } else if (count > nodes.length) {
        for (let i = nodes.length; i < count; i++) {
          const kind = kindForIndex(i);
          nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            kind,
            radius: radiusForKind(kind),
            ignitionDelay: 0,
            flashedAt: -1,
          });
        }
      }
      refreshEdges();
    };

    const resize = () => {
      const prevW = width;
      const prevH = height;
      width = host.clientWidth;
      height = host.clientHeight;
      if (width <= 0 || height <= 0) return;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) build();
      else rescale(prevW, prevH);
    };

    // --------------------------------------------------------------- eventos
    const spawnPacket = () => {
      const max = lowPower ? 6 : 14;
      if (edges.length === 0 || packets.length >= max) return;
      const edge = edges[(Math.random() * edges.length) | 0];
      const forward = Math.random() > 0.5;
      packets.push({
        path: forward ? [edge.a, edge.b] : [edge.b, edge.a],
        leg: 0,
        t: 0,
        speed: 0.0008 + Math.random() * 0.0011,
        threat: false,
        rgb: Math.random() > 0.45 ? CYAN : PURPLE,
      });
    };

    const spawnThreat = () => {
      if (packets.some((p) => p.threat)) return; // como mucho una intrusión a la vez
      const path = pickThreatPath(nodes, adjacency, width, height);
      if (!path) return;
      packets.push({
        path,
        leg: 0,
        t: 0,
        speed: 0.0011 + Math.random() * 0.0006,
        threat: true,
        rgb: RED,
      });
    };

    const neutralize = (node: SceneNode) => {
      node.flashedAt = sceneTime;
      bursts.push({ x: node.x, y: node.y, start: sceneTime, rgb: CYAN });
      const count = lowPower ? 5 : 10;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const speed = 0.04 + Math.random() * 0.06;
        sparks.push({
          x: node.x,
          y: node.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          start: sceneTime,
        });
      }
      onBlockedRef.current?.();
    };

    // ---------------------------------------------------------------- pintado
    const drawGlow = (
      x: number,
      y: number,
      radius: number,
      sprite: HTMLCanvasElement,
      a: number,
    ) => {
      if (a <= 0.004 || radius <= 0) return;
      ctx.globalAlpha = a > 1 ? 1 : a;
      ctx.drawImage(sprite, x - radius, y - radius, radius * 2, radius * 2);
      ctx.globalAlpha = 1;
    };

    const strokeHexagon = (x: number, y: number, r: number, rotation: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = rotation + (i * Math.PI) / 3;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const pointerBoost = (x: number, y: number) => {
      if (pointer.strength <= 0.01) return 0;
      const d = Math.hypot(x - pointer.x, y - pointer.y);
      if (d >= POINTER_RADIUS) return 0;
      return (1 - d / POINTER_RADIUS) * pointer.strength;
    };

    /** Barrido de escaneo: el del arranque es intenso; el ambiental, sutil. */
    const drawScan = () => {
      let p = -1;
      let intensity = 1;
      if (sceneTime <= BOOT.scanDuration) {
        p = progress(sceneTime, 0, BOOT.scanDuration);
      } else if (!lowPower && sceneTime > BOOT.settled) {
        const phase = (sceneTime - BOOT.settled) % AMBIENT_SCAN_PERIOD;
        if (phase < AMBIENT_SCAN_DURATION) {
          p = phase / AMBIENT_SCAN_DURATION;
          intensity = 0.32;
        }
      }
      if (p < 0 || p >= 1) return;

      const y = easeInOutSine(p) * height;
      const fade = Math.sin(p * Math.PI);
      const tail = 110;
      const gradient = ctx.createLinearGradient(0, y - tail, 0, y);
      gradient.addColorStop(0, `rgba(${CYAN},0)`);
      gradient.addColorStop(1, `rgba(${CYAN},${0.09 * fade * intensity})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y - tail, width, tail);
      ctx.fillStyle = `rgba(${CYAN},${0.42 * fade * intensity})`;
      ctx.fillRect(0, y, width, 1);
    };

    const drawEdges = () => {
      const maxAlpha = dark ? 0.3 : 0.26;
      const buckets = lowPower ? 3 : 5;
      let visible = 0;

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const p = progress(sceneTime, BOOT.edgesStart + edge.delay, BOOT.edgeDuration);
        if (p <= 0) continue;
        const a = nodes[edge.a];
        const b = nodes[edge.b];
        if (!a || !b) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= connect) continue;

        const mid = pointerBoost(a.x + dx / 2, a.y + dy / 2);
        // Cercanía + boost del puntero → nivel de opacidad (cuantizado a lotes).
        const level = clamp01((1 - dist / connect) * (0.45 + 0.55 * p) + mid * 0.75);
        const bucket = Math.min(buckets - 1, Math.floor(level * buckets));
        const o = visible * 4;
        edgeGeom[o] = a.x;
        edgeGeom[o + 1] = a.y;
        edgeGeom[o + 2] = a.x + dx * p;
        edgeGeom[o + 3] = a.y + dy * p;
        edgeBucket[visible] = bucket;
        visible++;
      }

      const lineRGB = dark ? "150,178,205" : "64,88,124";
      ctx.lineWidth = 1;
      for (let bucket = 0; bucket < buckets; bucket++) {
        ctx.beginPath();
        let used = false;
        for (let i = 0; i < visible; i++) {
          if (edgeBucket[i] !== bucket) continue;
          const o = i * 4;
          ctx.moveTo(edgeGeom[o], edgeGeom[o + 1]);
          ctx.lineTo(edgeGeom[o + 2], edgeGeom[o + 3]);
          used = true;
        }
        if (!used) continue;
        ctx.strokeStyle = `rgba(${lineRGB},${(((bucket + 1) / buckets) * maxAlpha).toFixed(3)})`;
        ctx.stroke();
      }
    };

    const drawNodes = () => {
      const baseAlpha = dark ? 0.34 : 0.28;
      for (const node of nodes) {
        const ignition = progress(
          sceneTime,
          BOOT.nodesStart + node.ignitionDelay,
          BOOT.nodeDuration,
        );
        if (ignition <= 0) continue;

        const pop = easeOutBack(ignition);
        const birth = Math.sin(clamp01(ignition) * Math.PI); // fogonazo al encender
        const flash = node.flashedAt >= 0 ? clamp01(1 - (sceneTime - node.flashedAt) / 800) : 0;
        const boost = pointerBoost(node.x, node.y);
        const r = node.radius * pop;
        const sprite = node.kind === "core" ? glow.purple : glow.cyan;

        drawGlow(
          node.x,
          node.y,
          r * (node.kind === "shield" ? 7 : 5.5),
          sprite,
          (baseAlpha + boost * 0.5 + flash * 0.55 + birth * 0.5) * ignition,
        );

        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle =
          node.kind === "core"
            ? `rgba(${PURPLE},${(0.7 + boost * 0.3) * ignition})`
            : `rgba(${CYAN},${(0.7 + boost * 0.3) * ignition})`;
        ctx.fill();

        // Los escudos llevan un hexágono que gira lentamente y late al bloquear.
        if (node.kind === "shield") {
          ctx.lineWidth = 1 + flash * 1.4;
          ctx.strokeStyle = `rgba(${CYAN},${(0.28 + boost * 0.4 + flash * 0.6) * ignition})`;
          strokeHexagon(node.x, node.y, r * 2.7 + flash * 7, sceneTime * 0.0004);
          ctx.lineWidth = 1;
        }
      }
    };

    const drawPackets = (dt: number) => {
      for (let k = packets.length - 1; k >= 0; k--) {
        const packet = packets[k];
        packet.t += packet.speed * dt;

        while (packet.t >= 1) {
          packet.t -= 1;
          packet.leg++;
          if (packet.leg >= packet.path.length - 1) break;
        }

        if (packet.leg >= packet.path.length - 1) {
          const target = nodes[packet.path[packet.path.length - 1]];
          if (target) {
            if (packet.threat) neutralize(target);
            else target.flashedAt = sceneTime;
          }
          packets.splice(k, 1);
          continue;
        }

        const a = nodes[packet.path[packet.leg]];
        const b = nodes[packet.path[packet.leg + 1]];
        if (!a || !b) {
          packets.splice(k, 1);
          continue;
        }

        const x = a.x + (b.x - a.x) * packet.t;
        const y = a.y + (b.y - a.y) * packet.t;
        const sprite = packet.threat ? glow.red : packet.rgb === PURPLE ? glow.purple : glow.cyan;

        // Estela: dos ecos detrás del paquete (más barato que un gradiente).
        for (let s = 1; s <= 2; s++) {
          const tail = clamp01(packet.t - s * 0.09);
          drawGlow(
            a.x + (b.x - a.x) * tail,
            a.y + (b.y - a.y) * tail,
            7 - s * 1.6,
            sprite,
            0.26 / s,
          );
        }
        drawGlow(x, y, packet.threat ? 12 : 9, sprite, packet.threat ? 0.95 : 0.8);
        ctx.beginPath();
        ctx.arc(x, y, packet.threat ? 2 : 1.6, 0, Math.PI * 2);
        ctx.fillStyle = packet.threat
          ? `rgba(255,235,235,0.95)`
          : `rgba(255,255,255,${dark ? 0.92 : 0.8})`;
        ctx.fill();
      }
    };

    const drawBursts = () => {
      const life = 780;
      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        const p = (sceneTime - burst.start) / life;
        if (p >= 1) {
          bursts.splice(i, 1);
          continue;
        }
        const eased = easeOutCubic(p);
        ctx.lineWidth = 2 * (1 - p) + 0.4;
        ctx.strokeStyle = `rgba(${burst.rgb},${(1 - p) * 0.55})`;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, 6 + eased * 58, 0, Math.PI * 2);
        ctx.stroke();
        // Segundo anillo, retrasado: da sensación de "pulso de defensa".
        if (p > 0.18) {
          const p2 = (p - 0.18) / 0.82;
          ctx.strokeStyle = `rgba(${burst.rgb},${(1 - p2) * 0.3})`;
          ctx.beginPath();
          ctx.arc(burst.x, burst.y, 4 + easeOutCubic(p2) * 40, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }
    };

    const drawSparks = (dt: number) => {
      const life = 620;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        const p = (sceneTime - spark.start) / life;
        if (p >= 1) {
          sparks.splice(i, 1);
          continue;
        }
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        drawGlow(spark.x, spark.y, 5 * (1 - p) + 1, glow.red, (1 - p) * 0.75);
      }
    };

    const render = (dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, width, height);

      if (animate) {
        const step = dt / 16.67; // normalizado a 60 fps
        for (const node of nodes) {
          node.x += node.vx * step;
          node.y += node.vy * step;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
        if (frame % EDGE_REFRESH === 0) refreshEdges();

        pointer.strength += (pointer.target - pointer.strength) * Math.min(1, dt / 220);
      }

      // Linterna suave bajo el cursor: da la sensación de "sistema en vivo".
      if (!lowPower && pointer.strength > 0.02) {
        drawGlow(pointer.x, pointer.y, POINTER_RADIUS * 0.8, glow.cyan, pointer.strength * 0.07);
      }

      drawEdges();
      drawNodes();

      // Partículas y barridos solo en modo animado: con `prefers-reduced-motion`
      // el fotograma único muestra la red construida y nada más.
      if (animate) {
        if (sceneTime > BOOT.flowStart && frame % (lowPower ? 22 : 12) === 0) spawnPacket();
        if (sceneTime > BOOT.threatStart && frame % 150 === 0 && Math.random() > 0.45)
          spawnThreat();
        drawPackets(dt);
        drawSparks(dt);
        drawBursts();
        drawScan();
      }
    };

    const loop = (stamp: number) => {
      const dt = lastStamp === 0 ? 16.67 : Math.min(stamp - lastStamp, 48);
      lastStamp = stamp;
      sceneTime += dt;
      frame++;

      // Degradación automática: si el equipo no da los fotogramas, se recorta
      // la carga (menos partículas, sin linterna, menos lotes de aristas).
      if (!lowPower && frame > 90) {
        if (dt > 32) slowFrames++;
        if (slowFrames > 40) lowPower = true;
      }

      render(dt, true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      lastStamp = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readTheme();
    resize();

    if (reduce) {
      // Un único fotograma con la red YA construida (sin bucle ni partículas).
      sceneTime = BOOT.settled + 1;
      render(0, false);
    } else {
      start();
    }

    // --------------------------------------------------------- observadores
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduce) render(0, false);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduce) render(0, false);
    });
    resizeObserver.observe(host);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(host);

    const onVisibility = () => {
      if (reduce) return;
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ------------------------------------------------------------- puntero
    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.target = 1;
    };
    const onPointerLeave = () => {
      pointer.target = 0;
    };
    const onPointerDown = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      bursts.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        start: sceneTime,
        rgb: PURPLE,
      });
    };

    if (!reduce) {
      host.addEventListener("pointermove", onPointerMove, { passive: true });
      host.addEventListener("pointerleave", onPointerLeave, { passive: true });
      host.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    return () => {
      stop();
      themeObserver.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      host.removeEventListener("pointerdown", onPointerDown);
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
