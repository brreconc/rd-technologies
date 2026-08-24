import { test, expect, type Page } from "@playwright/test";

/**
 * E2E del deck multiplataforma (Fase 10, ADR-013).
 *
 * La sección es la pieza más interactiva del sitio, así que lo que se protege
 * aquí no es el aspecto sino los CONTRATOS: patrón de pestañas correcto, teclado
 * operable, avance automático detenible (WCAG 2.2.2), cero desbordamiento y
 * degradación limpia con `prefers-reduced-motion`.
 */

/**
 * Deja el deck a la vista y con la escena asentada.
 *
 * El orden importa: primero se espera a que el rail exista y sea visible —es
 * decir, a que React haya hidratado— y SOLO DESPUÉS se hace scroll. Al revés,
 * `scrollIntoViewIfNeeded` corría contra la hidratación y fallaba de vez en
 * cuando con "Element is not attached to the DOM".
 */
async function abrirDeck(page: Page) {
  await page.goto("/#plataformas");
  await expect(page.getByRole("tab").first()).toBeVisible();
  await page.locator("#plataformas").scrollIntoViewIfNeeded();
  // El observador del recorrido automático necesita un fotograma para resolver.
  await page.waitForTimeout(300);
}

test.describe("Deck multiplataforma", () => {
  test("expone cinco destinos con un único seleccionado", async ({ page }) => {
    await abrirDeck(page);

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(5);
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
    // Ventana deliberadamente MÁS BAJA que el deck. Regresión: el observador
    // pedía que se viera el 30% del elemento, y esa fracción tiene como techo
    // `alturaVentana / alturaDeck`; al crecer el deck se volvió inalcanzable y
    // el recorrido no arrancaba nunca. Ahora la condición es de posición.
    await page.setViewportSize({ width: 1280, height: 640 });
    await abrirDeck(page);

    // Sin tocar nada, el deck pasa al siguiente destino.
    await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true", {
      timeout: 15_000,
    });

    // El control lo detiene, y a partir de ahí el destino ya no cambia solo.
    const detener = page.getByRole("button", { name: /Detener el recorrido de plataformas/i });
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

  test("la cota y el mock-up cambian con el destino", async ({ page }) => {
    await abrirDeck(page);

    // La cota es el ancla de la metáfora: anuncia la resolución del destino y
    // el marco se calcula a partir de ella. Si dejara de cambiar, el
    // instrumento estaría mintiendo.
    const cota = page.locator(".deck-readout");
    await page.getByRole("tab", { name: /^Web/ }).click();
    await expect(cota).toContainText("1440");

    await page.getByRole("tab", { name: /E-commerce/ }).click();
    await expect(cota).toContainText("834");
    await expect(page.locator(".mk-ec")).toBeVisible();

    await page.getByRole("tab", { name: /iOS/ }).click();
    await expect(cota).toContainText("393");
    await expect(page.locator(".mk-ios")).toBeVisible();

    await page.getByRole("tab", { name: /Escritorio/ }).click();
    await expect(cota).toContainText("1920");
    // Un mock-up por destino: nunca dos montados a la vez.
    await expect(page.locator(".mk")).toHaveCount(1);
    await expect(page.locator(".mk-desk")).toBeVisible();
  });

  test("los cinco destinos se ven a la vez en móvil", async ({ page }) => {
    // Regresión: con el rail como tira deslizable, casi todos los destinos
    // quedaban fuera de pantalla sin ninguna pista de que existieran.
    await page.setViewportSize({ width: 375, height: 800 });
    await abrirDeck(page);

    const ancho = page.viewportSize()!.width;
    for (const nombre of [/^Web/, /E-commerce/, /Android/, /iOS/, /Escritorio/]) {
      const caja = await page.getByRole("tab", { name: nombre }).boundingBox();
      expect(caja, `destino ${nombre}`).not.toBeNull();
      expect(caja!.x).toBeGreaterThanOrEqual(0);
      expect(caja!.x + caja!.width, `destino ${nombre}`).toBeLessThanOrEqual(ancho);
    }
  });

  test("el dispositivo no se transforma con el puntero encima", async ({ page }) => {
    // Regresión de la nitidez (ADR-015): una capa con transformación 3D la
    // rasteriza Chromium una vez y la remuestrea, y el texto de 6–10 px del
    // mock-up se volvía una mancha justo al acercarse a mirarlo. La respuesta al
    // puntero vive ahora en el suelo y en la mira; la pantalla no se toca.
    await abrirDeck(page);

    const escenario = page.locator(".deck-stage");
    const caja = await escenario.boundingBox();
    await page.mouse.move(caja!.x + caja!.width * 0.85, caja!.y + caja!.height * 0.2);
    await page.waitForTimeout(600);

    const transform = await page
      .locator(".deck-device")
      .evaluate((el) => getComputedStyle(el).transform);
    expect(transform === "none" || transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);

    // Y la mira sí responde: es lo que sustituyó a la inclinación.
    await expect(page.locator(".deck-cross-read")).not.toBeEmpty();
  });

  test("el nombre de ningún destino se recorta", async ({ page }) => {
    // El rótulo de la pestaña es la palabra que la sección existe para decir.
    // A dos columnas, "E-commerce" no cabía en un teléfono y salía "E-comme…";
    // por eso el rail baja a una sola columna por debajo de `sm`.
    for (const ancho of [320, 375, 768, 1024]) {
      await page.setViewportSize({ width: ancho, height: 900 });
      await abrirDeck(page);
      const recortados = await page.$$eval(".deck-tab-label", (els) =>
        els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent),
      );
      expect(recortados, `a ${ancho}px`).toEqual([]);
    }
  });

  test("ningún destino desborda a 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await abrirDeck(page);

    for (const nombre of [/^Web/, /E-commerce/, /Android/, /iOS/, /Escritorio/]) {
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
    await expect(page.getByRole("button", { name: /recorrido de plataformas/i })).toHaveCount(0);
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
