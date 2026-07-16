import { defineConfig, devices } from "@playwright/test";

/**
 * Config de Playwright (§13). E2E funcional + responsive + accesibilidad.
 *
 * IMPORTANTE: se arranca la app en **producción** (`pnpm start`), no en dev,
 * para probar contra la **CSP estricta con nonce** (ADR-009). Así verificamos
 * que ningún script queda bloqueado por la CSP en el entorno real.
 *
 * Motores: Chromium siempre. Firefox y WebKit se activan con `ALL_BROWSERS=1`
 * (requieren librerías de sistema que no están en todos los entornos de dev;
 * en CI sobre Ubuntu se ejecutan los tres). Ver docs/08-testing.
 */
const allBrowsers = !!process.env.ALL_BROWSERS;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    ...(allBrowsers
      ? [
          { name: "firefox", use: { ...devices["Desktop Firefox"] } },
          { name: "webkit", use: { ...devices["Desktop Safari"] } },
        ]
      : []),
  ],
  webServer: {
    // Requiere un build previo (`pnpm build`). Producción → CSP con nonce activa.
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
