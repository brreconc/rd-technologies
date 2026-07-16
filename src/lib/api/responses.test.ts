import { describe, it, expect } from "vitest";
import { ok, validationError, rateLimited, badRequest, serverError } from "./responses";

async function parse(res: Response) {
  return { status: res.status, body: await res.json() };
}

describe("responses (contrato JSON tipado)", () => {
  it("ok → 200 con id", async () => {
    const { status, body } = await parse(ok("abc123"));
    expect(status).toBe(200);
    expect(body).toEqual({ ok: true, id: "abc123" });
  });

  it("validationError → 422 con fieldErrors", async () => {
    const { status, body } = await parse(validationError({ email: "inválido" }));
    expect(status).toBe(422);
    expect(body).toMatchObject({
      ok: false,
      error: "validation",
      fieldErrors: { email: "inválido" },
    });
  });

  it("rateLimited → 429 con cabecera Retry-After en segundos", async () => {
    const res = rateLimited(4200);
    expect(res.status).toBe(429);
    expect(res.headers.get("retry-after")).toBe("5"); // ceil(4200/1000)
    expect(await res.json()).toMatchObject({ ok: false, error: "rate_limit" });
  });

  it("badRequest → 400 genérico (no revela el motivo)", async () => {
    const { status, body } = await parse(badRequest());
    expect(status).toBe(400);
    expect(body).toEqual({ ok: false, error: "bad_request" });
  });

  it("serverError → 500", async () => {
    const { status } = await parse(serverError());
    expect(status).toBe(500);
  });
});
