import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit, __resetRateLimit } from "./rate-limit";

describe("checkRateLimit (ventana deslizante)", () => {
  beforeEach(() => __resetRateLimit());
  afterEach(() => vi.useRealTimers());

  it("permite hasta el límite y bloquea el siguiente", () => {
    const opts = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimit("ip-a", opts).allowed).toBe(true);
    expect(checkRateLimit("ip-a", opts).allowed).toBe(true);
    const third = checkRateLimit("ip-a", opts);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = checkRateLimit("ip-a", opts);
    expect(fourth.allowed).toBe(false);
    expect(fourth.retryAfterMs).toBeGreaterThan(0);
  });

  it("aísla las claves (IPs) entre sí", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("ip-x", opts).allowed).toBe(true);
    expect(checkRateLimit("ip-x", opts).allowed).toBe(false);
    // Otra IP no se ve afectada.
    expect(checkRateLimit("ip-y", opts).allowed).toBe(true);
  });

  it("libera el hueco al salir la marca de la ventana", () => {
    vi.useFakeTimers();
    const opts = { limit: 1, windowMs: 1_000 };
    expect(checkRateLimit("ip-t", opts).allowed).toBe(true);
    expect(checkRateLimit("ip-t", opts).allowed).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(checkRateLimit("ip-t", opts).allowed).toBe(true);
  });
});
