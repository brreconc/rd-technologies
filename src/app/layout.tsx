import { Inter, Space_Grotesk, Fraunces, JetBrains_Mono } from "next/font/google";
import { baseMetadata } from "@/config/metadata";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // next-themes ajusta la clase del tema en cliente → evita mismatch de hidratación.
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <Providers>
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
