import type { Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Space_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import { baseMetadata } from "@/config/metadata";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { ScrollProgress } from "@/components/animations/ScrollProgress";
import { Providers } from "./providers";
import "./globals.css";

// Fuentes auto-hospedadas vía next/font — sin peticiones externas (mejor CSP y CWV).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = baseMetadata;

/**
 * Viewport (§12). `themeColor` va aquí (no en `metadata`, deprecado desde
 * Next 14). El sitio tiene un único tema oscuro (ADR-012), así que se declara
 * un solo color, el mismo `--bg` de globals.css.
 */
export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Leer una cabecera de la petición fuerza el RENDER DINÁMICO, imprescindible
  // para la CSP con nonce (ADR-009): Next extrae el nonce de la cabecera
  // `Content-Security-Policy` que fija el proxy y lo aplica a sus scripts, pero
  // solo puede hacerlo si la página se renderiza por petición — una página
  // estática se genera en build, cuando todavía no existe ningún nonce.
  await headers();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        {/* Luz ambiental de toda la página: se desplaza con el avance del scroll
            mediante CSS puro (`animation-timeline: scroll()`). Decorativa y sin
            JavaScript; ver docs/02-design-system/motion.md. */}
        <div aria-hidden="true" className="aurora" />
        {/* Sin JS: forzar visibles los elementos con animación de entrada (progressive enhancement). */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: ".reveal{opacity:1!important;transform:none!important;filter:none!important}",
            }}
          />
        </noscript>
        <Providers>
          <ScrollProgress />
          {/* Skip link accesible (§10) — visible solo al enfocar con teclado. */}
          <a
            href="#contenido-principal"
            className="bg-surface text-foreground sr-only rounded-md px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
          >
            Saltar al contenido
          </a>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
