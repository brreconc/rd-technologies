import { describe, expect, it } from "vitest";
import {
  BOOT,
  buildAdjacency,
  clamp,
  clamp01,
  computeEdges,
  connectDistanceFor,
  createNodes,
  easeOutBack,
  easeOutCubic,
  kindForIndex,
  nodeCountFor,
  pickThreatPath,
  progress,
  radiusForKind,
  type SceneNode,
} from "./engine";

/** Generador determinista para que los tests no dependan de `Math.random`. */
function seeded(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

describe("NeuralNetwork/engine — utilidades numéricas", () => {
  it("clamp y clamp01 acotan dentro del rango", () => {
    expect(clamp(5, 0, 3)).toBe(3);
    expect(clamp(-5, 0, 3)).toBe(0);
    expect(clamp(2, 0, 3)).toBe(2);
    expect(clamp01(1.7)).toBe(1);
    expect(clamp01(-0.2)).toBe(0);
  });

  it("las curvas de easing empiezan en 0 y terminan en 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutBack(0)).toBeCloseTo(0, 5);
    expect(easeOutBack(1)).toBeCloseTo(1, 5);
    // `easeOutBack` sobrepasa el destino antes de asentarse (el "pop").
    expect(easeOutBack(0.75)).toBeGreaterThan(1);
  });

  it("progress actúa como animation-fill-mode: both", () => {
    expect(progress(0, 100, 200)).toBe(0); // aún no ha empezado
    expect(progress(200, 100, 200)).toBe(0.5);
    expect(progress(1000, 100, 200)).toBe(1); // ya terminó
    expect(progress(100, 100, 0)).toBe(1); // duración nula → inmediato
  });
});

describe("NeuralNetwork/engine — dimensionado de la escena", () => {
  it("acota el nº de nodos por área y limita más en móvil", () => {
    expect(nodeCountFor(0, 0)).toBe(16); // mínimo, aunque no haya área
    expect(nodeCountFor(360, 640)).toBeLessThanOrEqual(26); // tope móvil
    expect(nodeCountFor(3840, 2160)).toBeLessThanOrEqual(54); // tope 4K
    expect(nodeCountFor(1440, 900)).toBeGreaterThan(nodeCountFor(600, 400));
  });

  it("la distancia de conexión se mantiene en un rango razonable", () => {
    const small = connectDistanceFor(360, 640, nodeCountFor(360, 640));
    const large = connectDistanceFor(3840, 2160, nodeCountFor(3840, 2160));
    for (const distance of [small, large]) {
      expect(distance).toBeGreaterThanOrEqual(110);
      expect(distance).toBeLessThanOrEqual(210);
    }
    expect(connectDistanceFor(1000, 1000, 0)).toBe(0);
  });

  it("reparte los tipos de nodo de forma determinista", () => {
    expect(kindForIndex(0)).toBe("shield");
    expect(kindForIndex(8)).toBe("shield");
    expect(kindForIndex(3)).toBe("core");
    expect(kindForIndex(1)).toBe("data");
    expect(radiusForKind("shield")).toBeGreaterThan(radiusForKind("data"));
  });
});

describe("NeuralNetwork/engine — construcción de la malla", () => {
  it("crea nodos dentro del lienzo y con onda de ignición acotada", () => {
    const nodes = createNodes(800, 600, 12, seeded([0.1, 0.9, 0.5, 0.3, 0.7]));
    expect(nodes).toHaveLength(12);
    for (const node of nodes) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(800);
      expect(node.y).toBeGreaterThanOrEqual(0);
      expect(node.y).toBeLessThanOrEqual(600);
      expect(node.ignitionDelay).toBeGreaterThanOrEqual(0);
      expect(node.ignitionDelay).toBeLessThanOrEqual(BOOT.nodeWave);
      expect(node.flashedAt).toBe(-1);
    }
  });

  it("solo conecta nodos por debajo de la distancia máxima", () => {
    const nodes: SceneNode[] = [
      { x: 0, y: 0, vx: 0, vy: 0, kind: "shield", radius: 3, ignitionDelay: 0, flashedAt: -1 },
      { x: 50, y: 0, vx: 0, vy: 0, kind: "data", radius: 1, ignitionDelay: 0, flashedAt: -1 },
      { x: 500, y: 0, vx: 0, vy: 0, kind: "data", radius: 1, ignitionDelay: 0, flashedAt: -1 },
    ];
    const edges = computeEdges(nodes, 100, 600, 200);
    expect(edges).toHaveLength(1);
    expect(edges[0]).toMatchObject({ a: 0, b: 1 });
    expect(edges[0].delay).toBeGreaterThanOrEqual(0);
  });

  it("la adyacencia es simétrica", () => {
    const nodes = createNodes(600, 400, 10, seeded([0.2, 0.4, 0.6, 0.8]));
    const edges = computeEdges(nodes, 400, 600, 400);
    const adjacency = buildAdjacency(nodes.length, edges);
    for (const edge of edges) {
      expect(adjacency[edge.a]).toContain(edge.b);
      expect(adjacency[edge.b]).toContain(edge.a);
    }
  });
});

describe("NeuralNetwork/engine — rutas de intrusión", () => {
  it("termina siempre en un nodo escudo", () => {
    const nodes = createNodes(900, 600, 24, seeded([0.15, 0.35, 0.55, 0.75, 0.95, 0.05]));
    const edges = computeEdges(nodes, 400, 900, 600);
    const adjacency = buildAdjacency(nodes.length, edges);
    const path = pickThreatPath(nodes, adjacency, 900, 600, seeded([0.3, 0.6, 0.1]));

    expect(path).not.toBeNull();
    expect(path!.length).toBeGreaterThanOrEqual(2);
    expect(nodes[path![path!.length - 1]].kind).toBe("shield");
    // Sin nodos repetidos: la intrusión no rebota sobre sí misma.
    expect(new Set(path!).size).toBe(path!.length);
  });

  it("devuelve null si ningún escudo tiene vecinos", () => {
    const nodes = createNodes(400, 400, 8, seeded([0.5]));
    const adjacency = buildAdjacency(nodes.length, []);
    expect(pickThreatPath(nodes, adjacency, 400, 400, seeded([0.5]))).toBeNull();
  });
});
