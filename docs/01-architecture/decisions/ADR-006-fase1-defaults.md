# ADR-006 — Defaults de Fase 1 (decisiones §19 sin confirmar)

- **Estado:** Aceptada (provisional — sujeta a confirmación del cliente)
- **Fecha:** 2026-07-12
- **Decisores:** Arquitecto Senior, UI/UX

> ⚠️ **Actualización (Fase 10, [ADR-012](./ADR-012-single-dark-theme.md)).** El default de **incluir tema claro** quedó revertido: el sitio pasa a tener tema oscuro único. Era, como decía este ADR, una decisión reversible.

## Contexto

La Fase 1 se inició sin respuesta del cliente a las preguntas abiertas §19. Para no bloquear, se
tomaron defaults sensatos y reversibles, documentados aquí.

## Decisiones

1. **Rutas (§19.4):** landing **one-page** con anclas (`#servicios`, `#proceso`, …). La estructura
   de rutas (grupo `(marketing)`) queda preparada por si se separan páginas después.
2. **Tema (§19.3):** se implementa **tema claro + oscuro con toggle** (oscuro por defecto), acorde
   al brief ("modo oscuro como default con posibilidad de cambiar"). Indirección por variables
   (ver [ADR-004](./ADR-004-tailwind-v4-tokens.md)).
3. **Idioma (§19.2):** solo español; el contenido se gestiona como datos (`config`/`constants`)
   para habilitar i18n más adelante sin reescribir componentes.
4. **Branding (§19.5):** **wordmark tipográfico** "R&D Technologies" (gradiente en "R&D"). Se
   sustituirá por el logo real cuando el cliente lo provea.
5. **Header/Footer** se montan en el **layout raíz** (válido para one-page). Si se añaden rutas no
   comerciales, se refactoriza a un layout del grupo `(marketing)`.

## Consecuencias

- ✅ Fase 1 avanza sin bloqueo; todo reversible con bajo coste.
- ⚠️ Si el cliente pide rutas separadas o solo-oscuro o i18n desde ya, se ajusta (cambios
  acotados). Datos de contacto/redes siguen siendo placeholders (§19.8).
