# Flujo de datos

## Contenido estático (Fases 2–3)

El copy y los datos (servicios, proceso, FAQ, testimonios) viven **tipados** en
`src/lib/constants` y se consumen desde Server Components. Ventaja: editar contenido sin tocar
JSX y habilitar i18n en el futuro.

```
lib/constants/*  →  components/sections/*  →  render en servidor  →  HTML
```

## Formularios: contacto y newsletter (Fase 4 — implementado)

```
ContactForm / NewsletterForm (cliente, RHF + zodResolver)
   → validación en cliente con el esquema de lib/utils/validators
   → anti-bot: honeypot + time-trap (components/forms/anti-bot)
   → postForm(): POST JSON same-origin
        → /api/contact | /api/newsletter (Route Handler, runtime Node)
             1. isSameOrigin (CSRF) · 2. Content-Type · 3. rate limit por IP
             4. tamaño + parseo · 5. anti-bot · 6. Zod (MISMO esquema) · 7. sanitización
             8. lib/services/contact.service (canal log en local → Resend/BD a futuro)
        → respuesta JSON tipada (200 | 422 | 429 | 400 | 500)
   → la UI mapea la respuesta: errores por campo o mensaje de estado (accesible)
```

Puntos clave:

- **Un solo esquema Zod** por formulario, compartido cliente/servidor
  (`lib/utils/validators`): la validación nunca se desincroniza.
- La **capa de servicios** (`lib/services/contact.service`) desacopla la UI del
  envío real; hoy registra en log (local) — ver
  [ADR-002](./decisions/ADR-002-no-nestjs-postgres-redis.md).
- El **rate limiting** vive en el handler (runtime Node), no en el proxy — ver
  [ADR-007](./decisions/ADR-007-rate-limit-route-handlers.md).
- Detalle de seguridad en
  [05-security/forms-hardening](../05-security/forms-hardening.md).
- **Mejora progresiva:** el CTA de contacto ofrece un `mailto` visible que
  funciona aunque el JavaScript falle.
