import { test, expect, type Page } from "@playwright/test";

/**
 * E2E del manifiesto de la propuesta de valor (Fase 14, ADR-017).
 *
 * Lo que se protege son los CONTRATOS de la sección, no su aspecto: el texto
 * está completo desde el primer render (sin JavaScript de por medio), el copy
 * sigue siendo corto, los estratos son una lista ordenada de verdad, no hay
 * desbordamiento a ningún ancho y con `prefers-reduced-motion` se ve todo
 * quieto y entero.
 */

async function abrirManifiesto(page: Page) {
  await page.goto("/#propuesta-de-valor");
  await expect(page.locator("#value-title")).toBeVisible();
  await page.locator("#propuesta-de-valor").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
}

test.describe("Propuesta de valor", () => {
  /**
   * El título viaja partido en un nodo por palabra para poder animarlo. Este
   * test comprueba que, pese al troceado, sigue siendo UNA frase para quien lo
   * lee con un lector de pantalla o busca en la página.
   */
  test("el titular es una sola frase legible y da nombre a la sección", async ({ page }) => {
    await abrirManifiesto(page);

    const titulo = page.locator("#value-title");
    await expect(titulo).toHaveText("Software a medida que nace seguro y escala contigo");
    await expect(page.locator("#propuesta-de-valor")).toHaveAttribute(
      "aria-labelledby",
      "value-title",
    );
  });

  test("los tres estratos son una lista ordenada completa desde el primer render", async ({
    page,
  }) => {
    await abrirManifiesto(page);

    const lista = page.locator("ol.vpx-strata");
    await expect(lista.locator("li")).toHaveCount(3);

    for (const titulo of [
      "A medida, no de plantilla",
      "Seguro desde el diseño",
      "Preparado para crecer",
    ]) {
      await expect(lista.getByRole("heading", { name: titulo })).toBeAttached();
    }
  });

  /**
   * La lista `<ol>` ya numera. Repetir "01", "02" en voz alta solo estorba, así
   * que los ordinales visibles están fuera del árbol de accesibilidad.
   */
  test("los ordinales visibles no se anuncian dos veces", async ({ page }) => {
    await abrirManifiesto(page);

    const ordinales = page.locator(".vpx-ord");
    await expect(ordinales).toHaveCount(3);
    // Cada ordinal vive dentro de una línea marcada como decorativa.
    for (let i = 0; i < 3; i += 1) {
      await expect(ordinales.nth(i).locator("xpath=..")).toHaveAttribute("aria-hidden", "true");
    }
    // Y la espina y los nodos tampoco existen para un lector de pantalla.
    await expect(page.locator("#propuesta-de-valor .vpx-rail:not([aria-hidden])")).toHaveCount(0);
  });

  /**
   * El motivo de rehacer la sección: antes eran 73 palabras en un párrafo. Si
   * el copy vuelve a crecer, esto se entera.
   */
  test("el copy sigue siendo compacto", async ({ page }) => {
    await abrirManifiesto(page);

    const palabras = await page
      .locator("#propuesta-de-valor .vpx-lede p")
      .last()
      .evaluate((el) => el.textContent!.trim().split(/\s+/).length);
    expect(palabras).toBeLessThanOrEqual(40);
  });

  test("el enlace lleva al recorrido del proceso", async ({ page }) => {
    await abrirManifiesto(page);

    const enlace = page.getByRole("link", { name: /Así trabajamos/ });
    await expect(enlace).toHaveAttribute("href", "#proceso");
    await enlace.click();
    await expect(page.locator("#proceso")).toBeInViewport({ timeout: 5000 });
  });

  /** §5.3.4: ni un píxel de scroll horizontal, del móvil pequeño al 4K. */
  for (const width of [320, 375, 768, 1024, 1440, 2560]) {
    test(`no desborda a ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 820 });
      await abrirManifiesto(page);

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      // Y el panel tampoco: su contenido cabe sin barra propia.
      const panel = await page
        .locator(".vpx-strata")
        .evaluate((el) => el.scrollWidth - el.clientWidth);
      expect(panel).toBeLessThanOrEqual(0);
    });
  }

  test("con prefers-reduced-motion se ve todo, quieto y sin errores", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const errores: string[] = [];
    page.on("console", (msg) => msg.type() === "error" && errores.push(msg.text()));
    page.on("pageerror", (error) => errores.push(error.message));

    await abrirManifiesto(page);

    await expect(page.locator("#value-title")).toBeVisible();
    const filas = page.locator("ol.vpx-strata li");
    await expect(filas).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await expect(filas.nth(i)).toBeVisible();
      // Nada se ha quedado a medio entrar: opacidad plena y sin desplazamiento.
      const estado = await filas.nth(i).evaluate((el) => {
        const s = getComputedStyle(el);
        return { opacity: s.opacity, transform: s.transform };
      });
      expect(Number(estado.opacity)).toBe(1);
      expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(estado.transform);
    }

    expect(errores).toEqual([]);
    await context.close();
  });
});
