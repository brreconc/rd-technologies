import { test, expect, type Page } from "@playwright/test";

/**
 * E2E del deck multiplataforma (Fase 10, ADR-013).
 *
 * La sección es la pieza más interactiva del sitio, así que lo que se protege
 * aquí no es el aspecto sino los CONTRATOS: patrón de pestañas correcto, teclado
 * operable, avance automático detenible (WCAG 2.2.2), cero desbordamiento y
 * degradación limpia con `prefers-reduced-motion`.
 */

/** Deja el deck a la vista y con la escena asentada. */
async function abrirDeck(page: Page) {
  await page.goto("/#plataformas");
  await page.locator("#plataformas").scrollIntoViewIfNeeded();
  await expect(page.getByRole("tab").first()).toBeVisible();
}

test.describe("Deck multiplataforma", () => {
  test("expone cuatro destinos con un único seleccionado", async ({ page }) => {
    await abrirDeck(page);

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.filter({ has: page.locator(':scope[aria-selected="true"]') })).toHaveCount(1);

    // El panel visible es el que declara la pestaña seleccionada.
    const seleccionada = tabs.and(page.locator('[aria-selected="true"]'));
    const panelId = await seleccionada.getAttribute("aria-controls");
    await expect(page.locator(`#${panelId}`)).toBeVisible();
  });

  test("elegir un destino reescribe el panel y cambia el acento", async ({ page }) => {
    await abrirDeck(page);

    const deck = page.locator(".deck");
    const acentoInicial = await deck.evaluate((el) =>
      el.style.getPropertyValue("--platform-accent"),
    );

    await page.getByRole("tab", { name: /Escritorio/ }).click();

    await expect(page.getByRole("tab", { name: /Escritorio/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page.getByRole("heading", { name: /escritorio para empresas/i })).toBeVisible();

    const acentoFinal = await deck.evaluate((el) => el.style.getPropertyValue("--platform-accent"));
    expect(acentoFinal).not.toBe(acentoInicial);
  });

  test("el rail se recorre con el teclado", async ({ page }) => {
    await abrirDeck(page);

    // Se parte del primer destino y se avanza con la flecha derecha.
    const primera = page.getByRole("tab").first();
    await primera.click();
    await primera.focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab").nth(1)).toBeFocused();
    await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");

    // `End` salta al último y `Home` vuelve al primero.
    await page.keyboard.press("End");
    await expect(page.getByRole("tab").last()).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab").first()).toHaveAttribute("aria-selected", "true");
  });

  test("el recorrido automático avanza solo y se puede detener (WCAG 2.2.2)", async ({ page }) => {
    await abrirDeck(page);

    // Sin tocar nada, el deck pasa al siguiente destino.
    await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true", {
      timeout: 15_000,
    });

    // El control lo detiene, y a partir de ahí el destino ya no cambia solo.
    const detener = page.getByRole("button", { name: /Detener el recorrido/i });
    await expect(detener).toBeVisible();
    await detener.click();

    const activaAhora = await page
      .getByRole("tab")
      .and(page.locator('[aria-selected="true"]'))
      .getAttribute("id");
    await page.waitForTimeout(8000);
    const activaDespues = await page
      .getByRole("tab")
      .and(page.locator('[aria-selected="true"]'))
      .getAttribute("id");
    expect(activaDespues).toBe(activaAhora);
  });

  test("ningún destino desborda a 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await abrirDeck(page);

    for (const nombre of [/Web/, /Android/, /iOS/, /Escritorio/]) {
      await page.getByRole("tab", { name: nombre }).click();
      const desbordamiento = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(desbordamiento, `destino ${nombre}`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("Deck con movimiento reducido", () => {
  test("no hay recorrido automático, ni errores, y el contenido está visible", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await abrirDeck(page);

    // El primer destino queda fijo: sin movimiento no hay recorrido que parar,
    // así que el control ni siquiera se ofrece.
    await expect(page.getByRole("button", { name: /recorrido automático/i })).toHaveCount(0);
    const activaAntes = await page
      .getByRole("tab")
      .and(page.locator('[aria-selected="true"]'))
      .getAttribute("id");
    await page.waitForTimeout(8000);
    const activaDespues = await page
      .getByRole("tab")
      .and(page.locator('[aria-selected="true"]'))
      .getAttribute("id");
    expect(activaDespues).toBe(activaAntes);

    // El contenido del panel sigue completo y elegir destino sigue funcionando.
    await page.getByRole("tab", { name: /iOS/ }).click();
    await expect(page.getByRole("heading", { name: /iPhone y iPad/i })).toBeVisible();

    // Markup idéntico entre servidor y cliente → sin desajustes de hidratación.
    expect(errors.join("\n")).not.toMatch(/hydrat|418|423|425/i);
    expect(errors).toEqual([]);
  });
});
