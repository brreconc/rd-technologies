# Endurecimiento de formularios (Fase 4 — implementado)

Implementación del formulario de contacto y de la newsletter (§9.2). Defensa en
profundidad: varias capas independientes, ninguna es la única barrera.

## Arquitectura

```
Cliente (RHF + Zod)                       Servidor (Route Handler, runtime Node)
─────────────────────                     ───────────────────────────────────────
ContactForm / NewsletterForm              POST /api/contact · /api/newsletter
  · valida con el MISMO esquema Zod         1. isSameOrigin  (CSRF)
  · honeypot + time-trap (anti-bot)         2. Content-Type application/json
  · POST JSON same-origin           ──▶     3. rate limit por IP (ventana deslizante)
  · pinta errores accesibles                4. límite de tamaño + parseo JSON
  · mailto de respaldo (sin JS)             5. anti-bot (honeypot + time-trap)
                                            6. validación Zod (mismo esquema)
                                            7. sanitización
                                            8. capa de servicios (log local)
```

Orden **barato → caro**: se rechaza cuanto antes (origen/content-type antes que
parsear el cuerpo o validar).

## Controles y dónde viven

| Control                              | Implementación                                                                                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Validación doble** (mismo esquema) | `src/lib/utils/validators` (`contact`, `newsletter`) — fuente única de verdad usada por RHF (`zodResolver`) y por los handlers.                                                                         |
| **Sanitización**                     | `src/lib/security/sanitize.ts` — quita controles (incluye CR/LF: anti-inyección de cabeceras), normaliza Unicode, recorta longitud. Se aplica **tras** validar.                                         |
| **Honeypot**                         | Campo oculto `company_url` (`src/components/forms/anti-bot.tsx`); si llega con contenido → descarte.                                                                                                    |
| **Time-trap**                        | `elapsed_ms` medido en cliente (montaje→envío vía `event.timeStamp`); por debajo de `MIN_FILL_MS` (1,5 s) → descarte.                                                                                   |
| **Rate limiting por IP**             | `src/lib/security/rate-limit.ts` (en memoria, ventana deslizante) aplicado en los handlers. 5 req/60 s por IP y ruta. Ver [ADR-007](../01-architecture/decisions/ADR-007-rate-limit-route-handlers.md). |
| **CSRF / origen**                    | `isSameOrigin` (`src/lib/security/request.ts`): `Origin` debe coincidir con el host; sin `Origin` → rechazo. `form-action 'self'` en la CSP.                                                            |
| **Límite de tamaño**                 | 16 KB por cuerpo, antes de parsear (`src/lib/api/form-guards.ts`).                                                                                                                                      |
| **Sin fugas de motivo**              | Origen/content-type/anti-bot devuelven un 400 genérico (no revelan qué barrera saltó).                                                                                                                  |
| **Feedback accesible**               | `aria-invalid` + `aria-describedby`, `role="alert"`, foco al primer error, región `aria-live` de estado.                                                                                                |
| **PII en logs**                      | El canal de log **enmascara** el correo (`an*@example.com`); no vuelca el mensaje en claro (solo su longitud).                                                                                          |

## Capa de servicios

El envío se delega en `src/lib/services/contact.service.ts` tras la interfaz
`ContactChannel`. En local, el canal `log` registra el envío en el servidor
(sin correo ni BD). A futuro se añade un canal Resend/BD y se selecciona en
`getContactChannel()` **sin tocar la UI ni los handlers**. El módulo usa
`server-only` para no acabar nunca en el bundle del cliente.

## Contrato de respuesta (JSON)

| Situación                         | HTTP | Cuerpo                                               |
| --------------------------------- | ---- | ---------------------------------------------------- |
| Éxito                             | 200  | `{ ok: true, id }`                                   |
| Validación                        | 422  | `{ ok: false, error: "validation", fieldErrors }`    |
| Rate limit                        | 429  | `{ ok: false, error: "rate_limit" }` + `Retry-After` |
| Origen/content-type/anti-bot/JSON | 400  | `{ ok: false, error: "bad_request" }`                |
| Error interno                     | 500  | `{ ok: false, error: "server" }`                     |

## Verificación (smoke tests locales)

Verificado sobre `pnpm start` con `curl` (variando `X-Forwarded-For` para aislar
buckets de rate limit):

| Caso                         | Resultado                |
| ---------------------------- | ------------------------ |
| Envío válido                 | 200 `ok:true` ✅         |
| Sin `Origin` (CSRF)          | 400 ✅                   |
| `Content-Type` erróneo       | 400 ✅                   |
| Honeypot relleno             | 400 ✅                   |
| Time-trap (`elapsed_ms`=100) | 400 ✅                   |
| Datos inválidos              | 422 + `fieldErrors` ✅   |
| 6 envíos rápidos misma IP    | 5×200 + 429 ✅           |
| `GET /api/contact`           | 405 ✅                   |
| Correo en el log             | enmascarado (`an*@…`) ✅ |

## Pendiente (fases posteriores)

- **Captcha** (Turnstile/hCaptcha) — decisión pendiente §19.7; `env` ya preparado.
- **Rate limit distribuido** (Redis/Upstash) para producción multi-instancia — misma interfaz.
- **Envío real** (Resend) tras `[DECISIÓN PENDIENTE]` §19.5.
- **Pruebas automatizadas** (Vitest para validadores/sanitize/rate-limit; Playwright E2E) — Fase 6.
