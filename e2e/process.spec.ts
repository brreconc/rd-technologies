import { test, expect, type Page } from "@playwright/test";

/**
 * E2E de la línea de tiempo horizontal del proceso (Fase 13, ADR-016).
 *
 * Lo que se protege no es el aspecto sino los CONTRATOS: el recorrido avanza
 * solo y se puede parar (WCAG 2.2.2), los seis pasos están SIEMPRE en el DOM
 * —nadie tiene que esperar a la animación para poder leerlos—, cero
 * desbordamiento y degradación limpia con `prefers-reduced-motion`.
 */

async function abrirProceso(page: Page) {
  await page.goto("/#proceso");
  await expect(page.getByRole("button", { name: /Paso 1/ })).toBeVisible();
  await page.locator("#proceso").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
}

/** Título del paso que está en pantalla, leído del anuncio para lectores. */
const pasoActivo = (page: Page) =>
  page.locator(".ptl-card[data-on] .ptl-card-t").first().textContent();

test.describe("Línea de tiempo del proceso", () => {
  test("expone seis hitos con uno solo marcado como actual", async ({ page }) => {
    await abrirProceso(page);

    const hitos = page.locator(".ptl-node");
    await expect(hitos).toHaveCount(6);
    await expect(page.locator('.ptl-node[aria-current="step"]')).toHaveCount(1);
  });

  /**
   * El contrato de contenido, y el que de verdad importa: la animación es una
   * capa visual, no la única forma de acceder al texto. Los seis pasos —título y
   * descripción— viven en una lista ordenada y están presentes desde el primer
   * render, así que un lector de pantalla los recibe todos de una vez.
   */
  test("los seis pasos están completos en el DOM desde el principio", async ({ page }) => {
    await abrirProceso(page);

    const lista = page.locator("ol.ptl-cards");
    await expect(lista.locator("li")).toHaveCount(6);

    for (const titulo of [
      "Escuchamos",
      "Diseñamos",
      "Construimos",
      "Probamos",
      "Lanzamos",
      "Acompañamos",
    ]) {
      await expect(lista.getByRole("heading", { name: titulo })).toBeAttached();
    }
    // Y la descripción del último, que sin la lista completa nadie vería hasta
    // que el recorrido diera la vuelta entera.
    await expect(lista).toContainText("soporte continuo");
  });

  test("el recorrido avanza solo y se puede detener (WCAG 2.2.2)", async ({ page }) => {
    // Ventana deliberadamente más baja que la sección: el observador usa
    // `rootMargin` justamente para que eso no lo desactive (lección de ADR-015).
    await page.setViewportSize({ width: 1280, height: 620 });
    await abrirProceso(page);

    const primero = await pasoActivo(page);
    await expect.poll(async () => pasoActivo(page), { timeout: 15_000 }).not.toBe(primero);

    // El control lo detiene, y a partir de ahí ya no cambia solo.
    const detener = page.getByRole("button", { name: /Detener el recorrido del proceso/i });
    await expect(detener).toBeVisible();
    await detener.click();

    const congelado = await pasoActivo(page);
    await page.waitForTimeout(6000);
    expect(await pasoActivo(page)).toBe(congelado);
  });

  test("elegir un hito a mano toma el control y no se lo devuelve", async ({ page }) => {
    await abrirProceso(page);

    await page.getByRole("button", { name: /Paso 5/ }).click();
    await expect(page.locator(".ptl-card[data-on] .ptl-card-t")).toHaveText("Lanzamos");

    // Ya no avanza solo: el usuario ha tomado el control.
    await page.waitForTimeout(6000);
    await expect(page.locator(".ptl-card[data-on] .ptl-card-t")).toHaveText("Lanzamos");
    await expect(
      page.getByRole("button", { name: /Reanudar el recorrido del proceso/i }),
    ).toBeVisible();
  });

  test("los hitos se alcanzan y se activan con el teclado", async ({ page }) => {
    await abrirProceso(page);

    const hito = page.getByRole("button", { name: /Paso 3/ });
    await hito.focus();
    await expect(hito).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".ptl-card[data-on] .ptl-card-t")).toHaveText("Construimos");
  });

  test("ningún paso desborda a 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await abrirProceso(page);

    for (let paso = 1; paso <= 6; paso++) {
      await page.getByRole("button", { name: new RegExp(`Paso ${paso}`) }).click();
      await page.waitForTimeout(200);
      await page.evaluate(() => window.scrollTo(99999, window.scrollY));
      expect(await page.evaluate(() => Math.round(window.scrollX)), `paso ${paso}`).toBe(0);
    }
  });

  /**
   * La sección cambia de paso sola: si al hacerlo moviera algo, sería CLS puro y
   * además molesto para quien esté leyendo. Las seis tarjetas comparten celda de
   * rejilla precisamente para que el alto lo fije la más larga.
   */
  test("cambiar de paso no mueve nada de sitio", async ({ page }) => {
    await abrirProceso(page);

    const caja = page.locator("ol.ptl-cards");
    const antes = await caja.boundingBox();
    await page.getByRole("button", { name: /Paso 4/ }).click();
    await page.waitForTimeout(700);
    const despues = await caja.boundingBox();

    expect(Math.round(despues!.height)).toBe(Math.round(antes!.height));
    expect(Math.round(despues!.y)).toBe(Math.round(antes!.y));
  });
});

test.describe("Proceso con movimiento reducido", () => {
  test("no hay recorrido automático, ni errores, y el contenido está completo", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.emulateMedia({ reducedMotion: "reduce" });
    await abrirProceso(page);

    // Sin movimiento no hay recorrido que parar, así que el control ni se ofrece.
    await expect(page.getByRole("button", { name: /recorrido del proceso/i })).toHaveCount(0);

    const antes = await pasoActivo(page);
    await page.waitForTimeout(6000);
    expect(await pasoActivo(page)).toBe(antes);

    // Y se sigue pudiendo recorrer a mano.
    await page.getByRole("button", { name: /Paso 6/ }).click();
    await expect(page.locator(".ptl-card[data-on] .ptl-card-t")).toHaveText("Acompañamos");

    // Markup idéntico entre servidor y cliente → sin desajustes de hidratación.
    expect(errors.join("\n")).not.toMatch(/hydrat|418|423|425/i);
    expect(errors).toEqual([]);
  });
});
