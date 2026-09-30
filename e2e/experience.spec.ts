import { test, expect } from "@playwright/test";

/**
 * E2E de la "escenografía" de Fase 9 (ADR-011). Verifica que el salto visual no
 * rompe ninguno de los contratos no negociables: el contenido sigue estando ahí,
 * la navegación sigue siendo precisa y todo degrada bien sin JavaScript o con
 * `prefers-reduced-motion`.
 */

test.describe("Experiencia", () => {
  test("el hero monta la consola de compilación y teclea contenido", async ({ page }) => {
    await page.goto("/");
    const consola = page.locator('section[aria-labelledby="hero-title"] .hc');
    await expect(consola).toHaveCount(1);

    const box = await consola.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThan(200);

    // La consola se ejecuta sola: aparece el prompt de arranque que teclea.
    await expect(consola.locator(".hc-prompt").first()).toBeVisible({ timeout: 5000 });
  });

  test("los títulos revelados palabra a palabra conservan su texto", async ({ page }) => {
    await page.goto("/");
    // El reparto en <span> por palabra no debe alterar el texto accesible.
    await expect(page.locator("#services-title")).toHaveText(
      "Tres pilares para tu producto digital",
    );
    await expect(page.locator("#process-title")).toHaveText(
      "De la idea al producto final, con total transparencia",
    );
  });

  test("el proceso es una lista ordenada de 6 pasos", async ({ page }) => {
    await page.goto("/#proceso");
    await expect(page.locator("#proceso ol > li")).toHaveCount(6);
  });

  test("el nav marca la sección activa tras navegar a ella", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Principal" });
    const proceso = nav.getByRole("link", { name: "Proceso" });
    await proceso.click();

    await expect(page.locator("#proceso")).toBeInViewport();
    await expect(proceso).toHaveAttribute("aria-current", "true");
  });
});

test.describe("Experiencia sin JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("las palabras enmascaradas se neutralizan (mejora progresiva)", async ({ page }) => {
    await page.goto("/");

    // Sin JS, el <noscript> del layout anula el desplazamiento inicial que
    // Framer serializa; si no, las palabras quedarían ocultas bajo su máscara.
    const word = page.locator("#services-title .reveal").first();
    expect(await word.evaluate((el) => getComputedStyle(el).transform)).toBe("none");
    expect(await word.evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  });
});

test.describe("Experiencia con movimiento reducido", () => {
  test("el contenido se muestra sin animaciones ni errores de hidratación", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#services-title")).toBeVisible();
    await expect(page.locator("#proceso ol > li").first()).toBeVisible();

    // Las palabras del título quedan fijadas por CSS, sin desplazamiento.
    const word = page.locator("#services-title .reveal").first();
    expect(await word.evaluate((el) => getComputedStyle(el).transform)).toBe("none");

    // El markup NO cambia según el hook → sin desajustes de hidratación (#418).
    expect(errors.join("\n")).not.toMatch(/hydrat|418|423|425/i);
    expect(errors).toEqual([]);
  });
});
