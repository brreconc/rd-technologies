import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("escapa '<' como \\u003c para evitar romper </script> (anti-inyección)", () => {
    const { container } = render(<JsonLd data={{ evil: "</script><img src=x>" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const html = script?.innerHTML ?? "";
    expect(html).not.toContain("</script>");
    expect(html).toContain("\\u003c");
  });

  it("serializa datos válidos como JSON parseable (tras des-escapar)", () => {
    const { container } = render(<JsonLd data={{ "@type": "Organization", name: "R&D" }} />);
    const html = container.querySelector("script")?.innerHTML ?? "";
    const parsed = JSON.parse(html.replace(/\\u003c/g, "<"));
    expect(parsed).toMatchObject({ "@type": "Organization", name: "R&D" });
  });
});
