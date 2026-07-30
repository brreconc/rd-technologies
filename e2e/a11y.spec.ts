import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accesibilidad automatizada (§10, §13). Sin violaciones críticas/serias
 * (axe-core, WCAG 2.0/2.1 A y AA). El sitio tiene un único tema oscuro
 * (ADR-012), así que hay una sola paleta que auditar.
 *
 * Nota: axe cubre ~parte de WCAG; complementa (no sustituye) la revisión manual
 * de teclado/lector de pantalla documentada en docs/06-accessibility.
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/**
 * Lleva la página a un ESTADO ESTABLE antes de auditar: fuerza los reveals a su
 * estado final (opacidad 1) y anula transiciones/animaciones. Así axe mide los
 * colores definitivos y no valores mezclados de una animación en curso (un
 * botón a medio fundido da un contraste "falso" que no existe en la UI real).
 */
async function settle(page: Page) {
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.addStyleTag({
    content: `*,*::before,*::after{animation:none!important;transition:none!important}
      .reveal{opacity:1!important;transform:none!important}`,
  });
  await page.waitForTimeout(200);
}

async function scan(page: Page) {
  return (
    new AxeBuilder({ page })
      .withTags(TAGS)
      // Se excluyen los adornos decorativos marcados `aria-hidden="true"`
      // (números de paso "01"…, resplandores): están fuera del árbol de
      // accesibilidad (un lector de pantalla nunca los encuentra) y son texto
      // decorativo, exento del contraste por WCAG 1.4.3. El contenido real que
      // sí leen las ayudas técnicas se audita al completo. Ver docs/06-accessibility.
      .exclude('[aria-hidden="true"]')
      .analyze()
  );
}

function seriousOrCritical(results: Awaited<ReturnType<typeof scan>>) {
  return results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
}

test("sin violaciones a11y críticas/serias", async ({ page }) => {
  await page.goto("/");
  await settle(page);
  expect(seriousOrCritical(await scan(page))).toEqual([]);
});

test("sin violaciones a11y críticas/serias con el deck en su última plataforma", async ({
  page,
}) => {
  // El deck multiplataforma reescribe su panel al cambiar de destino (y retiñe
  // el acento). Se audita también ese estado, no solo el inicial.
  await page.goto("/");
  const tabs = page.getByRole("tab");
  await tabs.last().click();
  await settle(page);
  expect(seriousOrCritical(await scan(page))).toEqual([]);
});
