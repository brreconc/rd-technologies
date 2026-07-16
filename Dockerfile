# syntax=docker/dockerfile:1
# ============================================================================
# R&D Technologies — Imagen de producción (Next.js 16, salida standalone)
# ============================================================================
# Multi-stage: se instala y compila con todas las dependencias, pero la imagen
# final solo contiene el servidor mínimo (`.next/standalone`) → imagen pequeña
# y con menor superficie de ataque.
#
# ⚠️ VARIABLES `NEXT_PUBLIC_*`: Next las "hornea" en el bundle y en las páginas
# estáticas DURANTE `next build`. Por eso se pasan como BUILD ARGS (no valen en
# runtime para el cliente). Los SECRETOS de servidor (RESEND_API_KEY, …) se
# pasan en RUNTIME. Ver docs/10-deployment/future-deployment.md.
# ----------------------------------------------------------------------------

# Debian slim (glibc): compatible con las dependencias nativas (sharp,
# unrs-resolver) sin las sorpresas de musl/alpine. Node 22 LTS (cumple >=20.9).
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1
# Corepack fija la versión de pnpm declarada en package.json ("packageManager").
RUN corepack enable

# ---- Dependencias (cacheable) ----------------------------------------------
FROM base AS deps
WORKDIR /app
# Solo los manifiestos → mejor cacheo de capas (no se reinstalan si no cambian).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---- Build ------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables públicas (se inlinean en build). El despliegue las fija con
# `--build-arg`. Por defecto: URL de ejemplo y NO indexable (seguro).
ARG NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ARG NEXT_PUBLIC_SITE_INDEXABLE="false"
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_SITE_INDEXABLE=${NEXT_PUBLIC_SITE_INDEXABLE} \
    NODE_ENV=production

RUN pnpm build

# ---- Runner (imagen final) --------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Usuario sin privilegios (no ejecutar como root).
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# Salida standalone: server.js + node_modules mínimos con los permisos correctos.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Assets que el standalone NO copia por sí solo (se sirven por el server.js):
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Sonda de salud con la ruta /api/health (sin curl/wget: se usa el fetch de Node 22).
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

# server.js lo genera la salida standalone de Next.
CMD ["node", "server.js"]
