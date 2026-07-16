import { describe, it, expect } from "vitest";
import { buildHomeJsonLd } from "./json-ld";

describe("buildHomeJsonLd", () => {
  const data = buildHomeJsonLd();
  const graph = (data["@graph"] as Array<Record<string, unknown>>) ?? [];

  it("usa el contexto schema.org y un @graph", () => {
    expect(data["@context"]).toBe("https://schema.org");
    expect(Array.isArray(graph)).toBe(true);
  });

  it("incluye Organization, WebSite y FAQPage", () => {
    const types = graph.map((n) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
    expect(types).toContain("FAQPage");
  });

  it("la FAQPage tiene preguntas con respuesta aceptada", () => {
    const faqPage = graph.find((n) => n["@type"] === "FAQPage");
    const mainEntity = (faqPage?.mainEntity as Array<Record<string, unknown>>) ?? [];
    expect(mainEntity.length).toBeGreaterThan(0);
    expect(mainEntity[0]["@type"]).toBe("Question");
    expect((mainEntity[0].acceptedAnswer as Record<string, unknown>)["@type"]).toBe("Answer");
  });
});
