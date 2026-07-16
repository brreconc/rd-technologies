import { test, expect } from "@playwright/test";

/**
 * Responsive (§5, §13): **cero scroll horizontal** del móvil de 320px al 4K.
 * Requisito no negociable del prompt maestro.
 */
const VIEWPORTS = [
  { name: "móvil-320", width: 320, height: 640 },
  { name: "móvil-375", width: 375, height: 667 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "fhd-1920", width: 1920, height: 1080 },
  { name: "uhd-2560", width: 2560, height: 1440 },
];

for (const vp of VIEWPORTS) {
  test(`sin desbordamiento horizontal en ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // El ancho de scroll del documento no supera el del viewport (+1px de margen).
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
}
