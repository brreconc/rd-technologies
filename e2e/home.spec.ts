import { test, expect } from "@playwright/test";

/**
 * E2E funcional de la home (§13). Corre contra producción → valida además que
 * la CSP estricta con nonce NO rompe la ejecución de scripts (animaciones,
 * tema, formularios).
 */

test.describe("Home", () => {
  test("carga sin errores de consola ni violaciones de CSP", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // La CSP se emite y ningún error de consola menciona bloqueos de CSP.
    const csp = (await page.request.get("/")).headers()["content-security-policy"];
    expect(csp).toContain("script-src");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'"); // sin unsafe-inline en scripts
    expect(errors.join("\n")).not.toMatch(/content security policy|refused to (execute|load)/i);
    expect(errors).toEqual([]);
  });

  test("la navegación por anclas lleva a las secciones", async ({ page }) => {
    await page.goto("/");
    // El enlace de contacto de la cabecera/nav lleva al formulario.
    await page.locator('a[href="#contacto"]').first().click();
    await expect(page).toHaveURL(/#contacto$/);
    await expect(page.locator("#contacto")).toBeInViewport();
  });

  test("el toggle de tema alterna claro/oscuro", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    await page
      .getByRole("button", { name: /tema|theme|claro|oscuro/i })
      .first()
      .click();
    await expect(html).toHaveClass(/light/);
  });

  test("el formulario de contacto muestra errores accesibles al enviar vacío", async ({ page }) => {
    await page.goto("/#contacto");
    const form = page.locator("#contacto form");
    await form.locator('button[type="submit"]').click();

    // Al menos un campo queda marcado como inválido (aria-invalid) con alerta.
    await expect(form.locator('[aria-invalid="true"]').first()).toBeVisible();
    await expect(page.getByRole("alert").first()).toBeVisible();
  });
});
