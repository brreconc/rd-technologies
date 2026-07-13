# Modelo de amenazas (básico)

Referencia: **OWASP Top 10**. Se ampliará en la Fase 6.

## Superficie de ataque (fase actual)

- Sitio estático + (a futuro) rutas `/api` de formulario. Sin BD ni auth (ver
  [ADR-002](../01-architecture/decisions/ADR-002-no-nestjs-postgres-redis.md)).

## Amenazas y mitigaciones

| Amenaza (OWASP)             | Mitigación                                                                         |
| --------------------------- | ---------------------------------------------------------------------------------- |
| Inyección / XSS             | CSP restrictiva, React (escapado por defecto), validación/sanitización de entrada. |
| Clickjacking                | `X-Frame-Options: DENY` + `frame-ancestors 'none'`.                                |
| Spam / abuso de formularios | Honeypot + time-trap + rate limiting por IP (Fase 4).                              |
| CSRF                        | Protección en mutaciones (Fase 4).                                                 |
| Fuga de información         | `Referrer-Policy`, sin `X-Powered-By`, secretos fuera del repo.                    |
| Dependencias vulnerables    | `pnpm audit` limpio como criterio de entrega; builds aprobados explícitamente.     |
| MITM                        | HSTS + `upgrade-insecure-requests` en producción (HTTPS).                          |

_(Pendiente: diagrama de flujo de datos con puntos de confianza y CSP con nonces — Fase 6.)_
