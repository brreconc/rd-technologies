# Endurecimiento de formularios (Fase 4)

Plan de implementación del formulario de contacto/newsletter (§9.2).

## Controles

1. **Validación doble** con el **mismo esquema Zod** en cliente (React Hook Form) y servidor
   (Route Handler). Fuente única de verdad en `lib/utils/validators`.
2. **Sanitización** de toda entrada antes de procesarla.
3. **Honeypot** (campo oculto que un bot rellena) + **time-trap** (rechazar envíos < N ms).
4. **Rate limiting por IP** en `/api/contact` y `/api/newsletter` (extensión de `proxy.ts`).
5. **CSRF**: token/origen verificado en mutaciones.
6. **Captcha** opcional (Turnstile/hCaptcha) — decisión pendiente (§19.7); mockeable en local.
7. **Feedback accesible**: mensajes de error asociados por `aria-describedby`, foco al primer error.

## Capa de servicios

El envío se delega a `lib/services/contact.service`. En local: mock/log. A futuro: Resend/BD sin
cambiar la UI.

_(Documento vivo — se concreta al implementar la Fase 4.)_
