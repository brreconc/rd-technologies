import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./index";

describe("Button", () => {
  it("renderiza como <button> por defecto", () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });

  it("con `asChild` renderiza el hijo (p. ej. un enlace) conservando estilos", () => {
    render(
      <Button asChild>
        <a href="#contacto">Contactar</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Contactar" });
    expect(link).toHaveAttribute("href", "#contacto");
    // La clase de variante primaria se aplica al elemento hijo.
    expect(link.className).toContain("bg-accent-cyan");
  });

  it("propaga el estado disabled", () => {
    render(<Button disabled>Deshabilitado</Button>);
    expect(screen.getByRole("button", { name: "Deshabilitado" })).toBeDisabled();
  });
});
