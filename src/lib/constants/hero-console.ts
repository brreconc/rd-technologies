/**
 * Guion de la CONSOLA DE COMPILACIÓN del hero (Fase 16, ADR-019).
 *
 * Cada escenario es una "toma" de cine que la consola ejecuta sola: teclea código
 * real, compila, aplica medidas de ciberseguridad y entrega la app. El componente
 * `CodeConsole` elige uno AL AZAR por carga de página (una sola animación por
 * sesión; al recargar, otra), así que el contenido vive aquí como datos tipados
 * —no incrustado en el JSX— igual que el resto de la landing (§8, arquitectura).
 *
 * El código de ejemplo es ilustrativo pero verosímil: enseña buenas prácticas de
 * seguridad de cada plataforma, que es justo el mensaje de la marca.
 */

/** Lenguaje del bloque de código (define el coloreado de sintaxis). */
export type ConsoleLang = "tsx" | "kotlin" | "swift" | "csharp";

export interface ConsoleResult {
  /** Rótulo del artefacto entregado. */
  title: string;
  /** Métricas finales (tamaño, puntuación, vulnerabilidades…). */
  metrics: { label: string; value: string }[];
}

export interface ConsoleScenario {
  id: "web" | "android" | "ios" | "windows";
  /** Nombre de la plataforma para el HUD. */
  label: string;
  /** Nombre de la app entregada (título de la demo). */
  appName: string;
  /** Una frase que acompaña la demo de la app. */
  tagline: string;
  /** Acento de la plataforma; tiñe la demo (`--hcd-accent`). Supera AA sobre negro. */
  accent: string;
  /** Comando de arranque que se teclea primero. */
  init: string;
  /** Nombre del archivo que se está escribiendo. */
  filename: string;
  lang: ConsoleLang;
  /** Líneas de código que se teclean, en orden. */
  code: string[];
  /** Comando de compilación. */
  buildCmd: string;
  /** Líneas de log que aparecen durante la compilación. */
  logs: string[];
  /** Medidas de ciberseguridad que se aplican (tics verdes). */
  security: string[];
  result: ConsoleResult;
}

const web: ConsoleScenario = {
  id: "web",
  label: "Desarrollo Web",
  appName: "app-web",
  tagline: "Landing y panel en producción, con SEO técnico y carga en < 1 s.",
  accent: "#00f5ff",
  init: "rdt create web --secure --target=prod",
  filename: "app/checkout/route.ts",
  lang: "tsx",
  code: [
    'import { z } from "zod";',
    'import { rateLimit } from "@/lib/security";',
    "",
    "const Order = z.object({",
    "  sku: z.string().min(1),",
    "  amount: z.number().positive(),",
    "});",
    "",
    "export async function POST(req: Request) {",
    "  await rateLimit(req, { max: 20 });",
    "  const order = Order.parse(await req.json());",
    "  return checkout(order);",
    "}",
  ],
  buildCmd: "rdt build --release",
  logs: [
    "Resolviendo dependencias…",
    "Type-check (strict) ✓",
    "Bundling con Turbopack…",
    "Tree-shaking + minify ✓",
    "Generando SBOM firmado…",
  ],
  security: [
    "CSP con nonce por petición",
    "Validación y sanitización (Zod)",
    "Cabeceras HSTS · X-Frame-Options",
    "Rate limiting por IP",
    "Auditoría de dependencias · 0 CVE",
  ],
  result: {
    title: "app-web · listo para desplegar",
    metrics: [
      { label: "Bundle", value: "98 KB" },
      { label: "Lighthouse", value: "100" },
      { label: "Vulns", value: "0" },
    ],
  },
};

const android: ConsoleScenario = {
  id: "android",
  label: "App Android",
  appName: "app-android",
  tagline: "Publicada en Google Play, firmada y con datos cifrados.",
  accent: "#3ddc84",
  init: "rdt create android --secure",
  filename: "LoginViewModel.kt",
  lang: "kotlin",
  code: [
    "class LoginViewModel(",
    "  private val auth: AuthRepository,",
    ") : ViewModel() {",
    "",
    "  fun login(user: String, pass: String) =",
    "    viewModelScope.launch {",
    "      val token = auth.signIn(user, pass)",
    '      secureStore.put("session", token)',
    "    }",
    "}",
  ],
  buildCmd: "gradlew assembleRelease",
  logs: [
    "Compilando Kotlin…",
    "Ofuscando con R8…",
    "Firmando APK…",
    "zipalign ✓",
    "Generando SBOM firmado…",
  ],
  security: [
    "Almacenamiento cifrado (Keystore)",
    "Certificate pinning · TLS 1.3",
    "Ofuscación R8 + anti-tamper",
    "Biometría / MFA",
    "Play Integrity API",
  ],
  result: {
    title: "app-android · AAB firmado",
    metrics: [
      { label: "Tamaño", value: "7.4 MB" },
      { label: "minSDK", value: "26" },
      { label: "Vulns", value: "0" },
    ],
  },
};

const ios: ConsoleScenario = {
  id: "ios",
  label: "App iOS",
  appName: "app-ios",
  tagline: "Lista para la App Store, con Face ID y cifrado en el Keychain.",
  accent: "#4fb3ff",
  init: "rdt create ios --secure",
  filename: "SessionManager.swift",
  lang: "swift",
  code: [
    "import CryptoKit",
    "",
    "struct SessionManager {",
    "  private let keychain = Keychain()",
    "",
    "  func store(_ token: Token) throws {",
    "    let sealed = try AES.GCM.seal(",
    "      token.data, using: key)",
    '    try keychain.set(sealed, for: "session")',
    "  }",
    "}",
  ],
  buildCmd: "xcodebuild -config Release",
  logs: [
    "Compilando Swift…",
    "Enlazando frameworks…",
    "codesign ✓",
    "Generando dSYM…",
    "Generando SBOM firmado…",
  ],
  security: [
    "Keychain + Secure Enclave",
    "App Transport Security · TLS 1.3",
    "Cifrado AES-GCM",
    "Face ID / Touch ID",
    "Detección de jailbreak",
  ],
  result: {
    title: "app-ios · IPA firmado",
    metrics: [
      { label: "Tamaño", value: "9.1 MB" },
      { label: "iOS", value: "16+" },
      { label: "Vulns", value: "0" },
    ],
  },
};

const windows: ConsoleScenario = {
  id: "windows",
  label: "App Windows",
  appName: "app-windows",
  tagline: "Instalador firmado, cifrado en reposo y actualizaciones automáticas.",
  accent: "#2b88ff",
  init: "rdt create windows --secure",
  filename: "VaultService.cs",
  lang: "csharp",
  code: [
    "using System.Security.Cryptography;",
    "",
    "public sealed class VaultService",
    "{",
    "    public byte[] Protect(byte[] data) =>",
    "        ProtectedData.Protect(data, null,",
    "            DataProtectionScope.CurrentUser);",
    "",
    "    public byte[] Sign(byte[] payload) =>",
    "        _rsa.SignData(payload, Sha256);",
    "}",
  ],
  buildCmd: "dotnet publish -c Release",
  logs: [
    "Restaurando paquetes…",
    "Compilando con Roslyn…",
    "Recorte + AOT…",
    "Authenticode ✓",
    "Generando SBOM firmado…",
  ],
  security: [
    "DPAPI · cifrado en reposo",
    "Firma Authenticode",
    "Instalación por política (MSI)",
    "Actualizaciones firmadas",
    "Auditoría de dependencias · 0 CVE",
  ],
  result: {
    title: "app-windows · instalador firmado",
    metrics: [
      { label: "Tamaño", value: "18 MB" },
      { label: ".NET", value: "8" },
      { label: "Vulns", value: "0" },
    ],
  },
};

/** Las cuatro tomas posibles de la consola del hero. */
export const heroScenarios = [web, android, ios, windows] satisfies ConsoleScenario[];

/**
 * Elige un escenario al azar. `random` es inyectable para poder probarlo de
 * forma determinista y para que el componente lo llame en el cliente (así cada
 * recarga muestra una toma distinta sin desajustar la hidratación).
 */
export function pickScenario(random: () => number = Math.random): ConsoleScenario {
  return heroScenarios[Math.floor(random() * heroScenarios.length) % heroScenarios.length];
}
