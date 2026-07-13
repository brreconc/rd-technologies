# Flujo de datos

## Contenido estático (Fases 2–3)

El copy y los datos (servicios, proceso, FAQ, testimonios) viven **tipados** en
`src/lib/constants` y se consumen desde Server Components. Ventaja: editar contenido sin tocar
JSX y habilitar i18n en el futuro.

```
lib/constants/*  →  components/sections/*  →  render en servidor  →  HTML
```

## Formulario de contacto (Fase 4)

```
ContactForm (cliente, RHF+Zod)
   → validación en cliente
   → POST /api/contact (Route Handler)
       → validación en servidor (mismo esquema Zod)
       → honeypot + time-trap + rate limit (lib/security)
       → lib/services/contact.service (mock/log en local → email real a futuro)
   → respuesta (éxito/error) → feedback accesible en UI
```

La **capa de servicios** desacopla la UI de la implementación de envío (ver
[ADR-002](./decisions/ADR-002-no-nestjs-postgres-redis.md)).

_(Se ampliará con diagramas concretos al implementar la Fase 4.)_
