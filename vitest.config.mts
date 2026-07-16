import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

/**
 * Config de Vitest (§13). Tests unitarios y de componentes.
 *
 * - `jsdom` para render de componentes con Testing Library.
 * - Alias `@/` = `src/` (igual que tsconfig/Next).
 * - `e2e/` queda EXCLUIDO: esos tests corren con Playwright, no con Vitest.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    css: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
