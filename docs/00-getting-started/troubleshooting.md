# Resolución de problemas

## `ERR_PNPM_IGNORED_BUILDS` (sharp / unrs-resolver)

pnpm ≥ 11 no ejecuta scripts de build sin aprobación. Están autorizados en
[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml):

```yaml
allowBuilds:
  sharp: true
  unrs-resolver: true
```

Si reaparece el error, ejecuta `pnpm install --force` para forzar la ejecución de esos scripts.

## `pnpm <script>` intenta reinstalar antes de correr

Está desactivado con `verify-deps-before-run=false` en [`.npmrc`](../../.npmrc). Si lo quitas,
pnpm hará un chequeo de dependencias antes de cada script.

## El aviso "middleware is deprecated"

En Next.js 16 la convención `middleware.ts` se renombró a `proxy.ts`. El proyecto ya usa
[`src/proxy.ts`](../../src/proxy.ts). No debería aparecer.

## Las clases de Tailwind con tokens no aplican

Los tokens se definen en el bloque `@theme` de [`src/app/globals.css`](../../src/app/globals.css).
Un token `--color-accent-cyan` genera utilidades como `bg-accent-cyan` / `text-accent-cyan`.
Si añades un token nuevo, reinicia `pnpm dev` para que Tailwind lo recoja.

## Fuentes que no cargan

Se auto-hospedan con `next/font` en [`src/app/layout.tsx`](../../src/app/layout.tsx) y se exponen
como variables CSS (`--font-inter`, etc.) mapeadas en `@theme`. Requieren red en el primer build.
