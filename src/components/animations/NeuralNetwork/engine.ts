/**
 * Motor de la escena "malla neuronal segura" del hero (Fase 9, ADR-011).
 *
 * Módulo SIN dependencias del DOM a propósito: aquí viven solo las matemáticas
 * y las estructuras de datos de la simulación (nodos, aristas, rutas de las
 * intrusiones y curvas de la secuencia de arranque). El pintado en `<canvas>`
 * vive en `index.tsx`. Separarlos permite probar la lógica con Vitest sin
 * necesitar un canvas real y mantiene el componente legible.
 *
 * La escena cuenta una historia en dos capas (el mensaje de la marca):
 *  - CREACIÓN DE SOFTWARE → la red se "compila" sola: los nodos se encienden en
 *    una onda desde el centro y las aristas se dibujan progresivamente.
 *  - CIBERSEGURIDAD → por la red viajan paquetes de datos y, de vez en cuando,
 *    una intrusión (roja) que los nodos "escudo" interceptan y disuelven.
 */

export type NodeKind = "data" | "core" | "shield";

export interface SceneNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: NodeKind;
  radius: number;
  /** Retardo de encendido (ms): produce la onda de ignición desde el centro. */
  ignitionDelay: number;
  /** Instante de la escena (ms) del último destello; `-1` si nunca destelló. */
  flashedAt: number;
}

export interface SceneEdge {
  a: number;
  b: number;
  /** Retardo de dibujado (ms), también en onda desde el centro. */
  delay: number;
}

/**
 * Línea temporal del arranque, en ms desde el primer fotograma. Ajustada para
 * que la secuencia complete en ~2s: lo bastante lenta para verse deliberada y
 * lo bastante rápida para no hacer esperar a nadie.
 */
export const BOOT = {
  /** Barrido de escaneo que recorre el hero de arriba abajo. */
  scanDuration: 1100,
  /** Primer nodo que se enciende. */
  nodesStart: 140,
  /** Cuánto tarda CADA nodo en encenderse. */
  nodeDuration: 420,
  /** Amplitud de la onda: retardo del nodo más alejado del centro. */
  nodeWave: 620,
  /** Primera arista que se dibuja. */
  edgesStart: 520,
  /** Cuánto tarda CADA arista en dibujarse. */
  edgeDuration: 460,
  /** Amplitud de la onda de aristas. */
  edgeWave: 900,
  /** A partir de aquí circulan paquetes de datos. */
  flowStart: 1350,
  /** A partir de aquí puede aparecer la primera intrusión. */
  threatStart: 3000,
  /** Pasado este punto la escena se considera en régimen estable. */
  settled: 3600,
} as const;

export function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

export function clamp01(value: number): number {
  return clamp(value, 0, 1);
}

export function easeOutCubic(t: number): number {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

/** Sobrepasa ligeramente el destino: da un "pop" al encender cada nodo. */
export function easeOutBack(t: number): number {
  const x = clamp01(t);
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * clamp01(t)) - 1) / 2;
}

/**
 * Progreso 0→1 de un tramo de la línea temporal. Devuelve 0 antes de empezar y
 * 1 una vez terminado (equivale a `animation-fill-mode: both`).
 */
export function progress(elapsed: number, start: number, duration: number): number {
  if (duration <= 0) return elapsed >= start ? 1 : 0;
  return clamp01((elapsed - start) / duration);
}

/**
 * Nº de nodos en función del área disponible. Acotado por arriba para que un
 * monitor 4K no dispare el coste por fotograma, y por abajo para que un móvil
 * siga viéndose como una red (§11).
 */
export function nodeCountFor(width: number, height: number): number {
  const area = Math.max(0, width) * Math.max(0, height);
  const byArea = Math.round(area / 19000);
  const ceiling = width < 640 ? 26 : 54;
  return clamp(byArea, 16, ceiling);
}

/**
 * Distancia máxima de conexión, derivada de la densidad real de nodos: así la
 * malla se ve igual de "tejida" en un móvil que en un ultrawide.
 */
export function connectDistanceFor(width: number, height: number, count: number): number {
  if (count <= 0) return 0;
  const spacing = Math.sqrt((Math.max(0, width) * Math.max(0, height)) / count);
  return clamp(spacing * 1.95, 110, 210);
}

/** Tipo de nodo por índice — determinista (mismo reparto en cada arranque). */
export function kindForIndex(index: number): NodeKind {
  if (index % 8 === 0) return "shield";
  if (index % 3 === 0) return "core";
  return "data";
}

export function radiusForKind(kind: NodeKind): number {
  if (kind === "shield") return 3.6;
  if (kind === "core") return 2.5;
  return 1.5;
}

/**
 * Distribuye los nodos. `random` es inyectable para poder probar la función de
 * forma determinista.
 */
export function createNodes(
  width: number,
  height: number,
  count: number,
  random: () => number = Math.random,
): SceneNode[] {
  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.hypot(cx, cy) || 1;

  return Array.from({ length: count }, (_, i) => {
    const x = random() * width;
    const y = random() * height;
    const kind = kindForIndex(i);
    return {
      x,
      y,
      vx: (random() - 0.5) * 0.18,
      vy: (random() - 0.5) * 0.18,
      kind,
      radius: radiusForKind(kind),
      ignitionDelay: (Math.hypot(x - cx, y - cy) / maxDist) * BOOT.nodeWave,
      flashedAt: -1,
    };
  });
}

/**
 * Aristas por proximidad. El retardo de cada una se calcula con el punto medio
 * respecto al centro, de modo que la malla se teje hacia fuera igual que la
 * onda de ignición de los nodos.
 */
export function computeEdges(
  nodes: readonly SceneNode[],
  maxDist: number,
  width: number,
  height: number,
): SceneEdge[] {
  const edges: SceneEdge[] = [];
  const maxSq = maxDist * maxDist;
  const cx = width / 2;
  const cy = height / 2;
  const norm = Math.hypot(cx, cy) || 1;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      if (dx * dx + dy * dy >= maxSq) continue;
      const mx = (nodes[i].x + nodes[j].x) / 2;
      const my = (nodes[i].y + nodes[j].y) / 2;
      edges.push({ a: i, b: j, delay: (Math.hypot(mx - cx, my - cy) / norm) * BOOT.edgeWave });
    }
  }
  return edges;
}

/** Lista de adyacencia (índices de vecinos por nodo). */
export function buildAdjacency(nodeCount: number, edges: readonly SceneEdge[]): number[][] {
  const adjacency: number[][] = Array.from({ length: nodeCount }, () => []);
  for (const edge of edges) {
    if (adjacency[edge.a] && adjacency[edge.b]) {
      adjacency[edge.a].push(edge.b);
      adjacency[edge.b].push(edge.a);
    }
  }
  return adjacency;
}

/**
 * Traza el camino de una intrusión: entra por la periferia y avanza hacia el
 * interior hasta chocar con un nodo escudo, que es donde se neutraliza.
 *
 * Devuelve los índices `[origen, …, escudo]` (2 o 3 saltos) o `null` si la malla
 * está demasiado dispersa como para trazar un camino creíble.
 */
export function pickThreatPath(
  nodes: readonly SceneNode[],
  adjacency: readonly number[][],
  width: number,
  height: number,
  random: () => number = Math.random,
): number[] | null {
  const shields: number[] = [];
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].kind === "shield" && adjacency[i]?.length) shields.push(i);
  }
  if (shields.length === 0) return null;

  const cx = width / 2;
  const cy = height / 2;
  const distToCenter = (i: number) => Math.hypot(nodes[i].x - cx, nodes[i].y - cy);

  const shield = shields[Math.floor(random() * shields.length) % shields.length];
  const neighbours = adjacency[shield];
  const mid = neighbours[Math.floor(random() * neighbours.length) % neighbours.length];

  // Se prefiere un tercer salto MÁS externo que el intermedio: la intrusión
  // debe leerse como algo que viene de fuera hacia dentro.
  const outer = (adjacency[mid] ?? []).filter(
    (n) => n !== shield && n !== mid && distToCenter(n) > distToCenter(mid),
  );
  if (outer.length > 0) {
    const start = outer[Math.floor(random() * outer.length) % outer.length];
    return [start, mid, shield];
  }
  return [mid, shield];
}
