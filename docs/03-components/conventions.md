# Convenciones de componentes

## Reglas (§14)

- **Server Components por defecto**; `'use client'` solo si hay interactividad (estado, efectos,
  eventos, animación).
- **Una responsabilidad por componente.** Lógica reutilizable → `lib/hooks` o `lib/utils`.
- **Tipado explícito** de props (`ComponentName.types.ts` o inline si es simple).
- **Sin colores/tamaños hardcodeados:** usar tokens (utilidades Tailwind derivadas de `@theme`).
- **Clases condicionales** con `cn()` ([`lib/utils/cn.ts`](../../src/lib/utils/cn.ts)).
- **Accesibilidad**: HTML semántico, foco visible, roles/aria solo cuando el HTML nativo no basta.
- **Nombres:** componentes en `PascalCase`, hooks `useXxx`.

## Estructura de carpeta

```
ComponentName/
├── index.tsx                 # export nombrado
├── ComponentName.types.ts    # props/tipos
└── ComponentName.stories.tsx # opcional (Storybook)
```

## Crear un componente nuevo

1. Elegir carpeta según su rol: `ui/` (primitivo), `sections/`, `shared/`, `animations/`, `forms/`.
2. Server Component salvo que necesite cliente.
3. Documentar props no obvias y añadirlo al [catálogo](./component-catalog.md).
