# ADR-007 — Rate limiting en Route Handlers (runtime Node), no en el proxy

- **Estado:** Aceptada
- **Fecha:** 2026-07-13
- **Decisores:** AppSec, Arquitecto Senior, Backend Senior

## Contexto

§9.2 exige **rate limiting por IP** en las rutas de formulario. La estructura
inicial (§7) y el ADR-005 anticiparon `proxy.ts` como punto de extensión. Al
implementarlo (Fase 4) surge una tensión: el proxy de Next corre en **runtime
edge**, donde un limitador **en memoria** no es fiable (estado efímero, por
aislamiento de instancias) y el ecosistema empuja a un store externo (Redis).

El proyecto está en **fase local sin despliegue** y sin infraestructura externa.

## Decisión

1. El rate limiting se aplica **dentro de los Route Handlers**
   (`/api/contact`, `/api/newsletter`), que corren en **runtime Node**
   (`export const runtime = "nodejs"`). Ahí el estado en memoria del limitador
   es estable dentro del proceso y coincide con el **límite real de la mutación**.
2. Implementación en `src/lib/security/rate-limit.ts`: **ventana deslizante en
   memoria**, tras una interfaz (`checkRateLimit`) pensada para sustituirse por
   Redis/Upstash **sin tocar los handlers**.
3. El `proxy.ts` queda para refuerzo de cabeceras (ADR-005); ya **no** se usa
   para rate limiting.
4. La clave combina ruta + IP (`getClientIp`, derivada de `x-forwarded-for`).

## Consecuencias

- ✅ Rate limiting funcional y verificado en local (5 req/60 s → 429 en el 6º).
- ✅ Sin dependencias de infraestructura en la fase local.
- ⚠️ **No distribuido:** no sobrevive a reinicios ni se comparte entre
  instancias. Aceptable en local; en producción se conecta un store compartido
  detrás de la misma interfaz.
- ⚠️ En despliegue, `x-forwarded-for` debe fijarlo un **proxy de confianza**; de
  lo contrario la IP es spoofeable. Documentado en `lib/security/request.ts`.
- 🔁 Complementado con honeypot + time-trap + verificación de origen (defensa en
  profundidad): ninguna capa es la única barrera.
