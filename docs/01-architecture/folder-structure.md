# Estructura de carpetas

Qué va en cada sitio y por qué. Alineado con §7 del prompt maestro.

```
src/
├── app/                    # App Router (Next.js)
│   ├── layout.tsx          # Layout raíz: fuentes, <html lang="es">, providers, skip link
│   ├── providers.tsx       # Providers de cliente (tema; a futuro más)
│   ├── page.tsx            # Home (shell Fase 0 → Hero + secciones en Fases 2-3)
│   ├── globals.css         # Tokens de diseño (@theme) + base global
│   └── api/                # Route Handlers (Fase 4)
│
├── components/
│   ├── ui/                 # Primitivos reutilizables (button, card, input…) — Fase 1
│   ├── sections/           # Secciones de la landing (Hero, Services, FAQ…) — Fase 2
│   ├── shared/             # Header, Footer, Navigation, ThemeToggle — Fase 1
│   ├── animations/         # Wrappers de animación (FadeIn, Reveal…) — Fase 3
│   └── forms/              # ContactForm, NewsletterForm — Fase 4
│
├── lib/
│   ├── animations/         # Variantes Framer, config GSAP — Fase 3
│   ├── constants/          # Contenido tipado (nav, servicios, faq, testimonios)
│   ├── hooks/              # Hooks reutilizables (useMediaQuery, useReducedMotion…)
│   ├── services/           # Capa de negocio (contact.service.ts) — Fase 4
│   ├── security/           # headers.ts (CSP + cabeceras), rate-limit, sanitize
│   └── utils/              # cn.ts (merge de clases) y utilidades puras
│
├── config/                 # site.ts (marca/nav/contacto), metadata.ts, env.ts (Zod)
├── styles/                 # CSS adicional si hiciera falta (los tokens están en globals.css)
├── types/                  # Tipos globales/de dominio
└── proxy.ts                # Antes "middleware": cabeceras + punto de extensión (rate limit)
```

## Convención de componentes

Cada componente no trivial vive en su propia carpeta:

```
ComponentName/
├── index.tsx                 # Implementación (export nombrado)
├── ComponentName.types.ts    # Props y tipos
└── ComponentName.stories.tsx # (si se usa Storybook)
```

Componentes triviales pueden ser un único archivo. La regla: **una responsabilidad por
componente**, lógica reutilizable a `hooks/` o `utils/`.

## Por qué `src/`

Aísla el código de la app de la configuración del repo (raíz) y es la convención recomendada
por Next.js. El alias `@/*` apunta a `src/*` (ver [`tsconfig.json`](../../tsconfig.json)).
