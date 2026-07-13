# Instalación y arranque local

## Requisitos

- **Node.js** ≥ 20.9 (recomendado 22 LTS — ver [`.nvmrc`](../../.nvmrc)).
- **pnpm** ≥ 11 (gestor de paquetes del proyecto).
- **git**.

## Pasos

```bash
# Node correcto
nvm use            # o: nvm install 22 && nvm use 22

# Dependencias
pnpm install

# Variables de entorno (opcional en fase local)
cp .env.example .env.local

# Servidor de desarrollo
pnpm dev           # http://localhost:3000
```

## Verificar la build de producción en local

```bash
pnpm build
pnpm start         # sirve el build en http://localhost:3000
```

## Notas de entorno

- **`sharp` / `unrs-resolver`:** requieren aprobación de scripts de build en pnpm ≥ 11.
  Ya están autorizados en [`pnpm-workspace.yaml`](../../pnpm-workspace.yaml) (`allowBuilds`).
- **`.npmrc`** fija `verify-deps-before-run=false` para que `pnpm <script>` no dispare
  una reinstalación innecesaria antes de cada comando.
- **No se indexa el sitio** todavía: la metadata usa `robots: noindex` mientras es local
  (ver [`src/config/metadata.ts`](../../src/config/metadata.ts)).

Más detalles de cada script en [`project-scripts.md`](./project-scripts.md).
Problemas comunes en [`troubleshooting.md`](./troubleshooting.md).
