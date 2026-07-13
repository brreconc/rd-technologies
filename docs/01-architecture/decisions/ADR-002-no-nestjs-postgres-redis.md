# ADR-002 — Sin NestJS/PostgreSQL/Redis en esta fase

- **Estado:** Aceptada
- **Fecha:** 2026-07-12
- **Decisores:** Arquitecto Senior, Backend Senior

## Contexto

El borrador previo proponía un backend completo (NestJS + PostgreSQL + Redis) para una landing
page cuya única necesidad de servidor es procesar el formulario de contacto/newsletter. El
proyecto, además, es **local** en esta fase y no se despliega aún.

## Opciones consideradas

1. **NestJS + PostgreSQL + Redis** — potente pero sobredimensionado; añade infraestructura,
   superficie de ataque y coste de mantenimiento innecesarios para el objetivo actual.
2. **Route Handlers / Server Actions de Next.js + capa de servicios** — cubre el caso de uso
   con cero infraestructura extra y queda listo para escalar.

## Decisión

Opción 2. El contacto se implementará (Fase 4) con Route Handlers/Server Actions y una **capa de
servicios** (`src/lib/services`) que abstrae la implementación. En local, los envíos se
mockean/loguean; más adelante se puede enchufar email real (Resend) o una BD **sin reescribir la UI**.

## Consecuencias

- ✅ Menos complejidad, menos superficie de ataque, arranque local trivial.
- ✅ Puerta abierta: si el negocio requiere BD/colas, se añade detrás de la capa de servicios.
- ⚠️ Funciones avanzadas (auth, persistencia compleja) requerirán una revisión de arquitectura
  cuando lleguen; esta ADR se reemplazaría por una nueva.
