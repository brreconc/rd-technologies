import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextReveal } from ".";

/**
 * El titular se parte en un nodo por palabra para poder animarlo. Estas pruebas
 * vigilan lo único que ese troceado podría estropear: que el texto siga siendo
 * legible como una frase, y que `highlight` nunca lo rompa.
 */
describe("TextReveal", () => {
  it("mantiene el título como una sola frase accesible", () => {
    render(<TextReveal text="Software a medida que nace seguro" />);
    expect(screen.getByRole("heading", { name: "Software a medida que nace seguro" })).toBeTruthy();
  });

  it("tiñe exactamente las palabras del fragmento resaltado", () => {
    const { container } = render(
      <TextReveal text="Software a medida que nace seguro" highlight="nace seguro" />,
    );
    const painted = [...container.querySelectorAll(".text-gradient-brand")].map(
      (el) => el.textContent,
    );
    expect(painted).toEqual(["nace", "seguro"]);
  });

  it("no resalta nada si el fragmento no está en el título, y no rompe el texto", () => {
    const { container } = render(
      <TextReveal text="Software a medida" highlight="inteligencia artificial" />,
    );
    expect(container.querySelectorAll(".text-gradient-brand")).toHaveLength(0);
    expect(screen.getByRole("heading", { name: "Software a medida" })).toBeTruthy();
  });

  it("case el fragmento aunque la palabra final lleve puntuación", () => {
    const { container } = render(<TextReveal text="Rápido, seguro, tuyo" highlight="seguro" />);
    const painted = [...container.querySelectorAll(".text-gradient-brand")].map(
      (el) => el.textContent,
    );
    expect(painted).toEqual(["seguro,"]);
  });
});
