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
 * Next 14). Se declara por esquema de color para que la barra del navegador
 * acompañe al tema claro/oscuro. `--bg` de cada tema en globals.css.
 */
export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce de la CSP (lo fija el proxy). Leer `headers()` fuerza el render
  // dinámico necesario para el nonce por petición (ADR-009). Se pasa a
  // `next-themes` para que su script inline anti-parpadeo lleve el nonce.
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="es"
      // next-themes ajusta la clase del tema en cliente → evita mismatch de hidratación.
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        {/* Sin JS: forzar visibles los elementos con animación de entrada (progressive enhancement). */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: ".reveal{opacity:1!important;transform:none!important;filter:none!important}",
            }}
          />
        </noscript>
        <Providers nonce={nonce}>
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
