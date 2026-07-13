# Documentación — R&D Technologies

Índice maestro de la documentación del proyecto. El objetivo (§15 del prompt maestro):
**cualquier desarrollador debe poder entender y continuar el proyecto leyendo estos documentos.**

## Mapa de la documentación

| Carpeta                                      | Contenido                                                       |
| -------------------------------------------- | --------------------------------------------------------------- |
| [`00-getting-started`](./00-getting-started) | Instalación local, scripts, resolución de problemas.            |
| [`01-architecture`](./01-architecture)       | Visión general, estructura de carpetas y **decisiones (ADRs)**. |
| [`02-design-system`](./02-design-system)     | Colores/tokens, tipografía, spacing, movimiento.                |
| [`03-components`](./03-components)           | Catálogo de componentes y convenciones.                         |
| [`04-responsive`](./04-responsive)           | Estrategia multiplataforma y anti-desbordamiento.               |
| [`05-security`](./05-security)               | Defensa en profundidad, headers, CSP, formularios.              |
| [`06-accessibility`](./06-accessibility)     | Guía WCAG 2.2 AA.                                               |
| [`07-performance`](./07-performance)         | Presupuestos y técnicas.                                        |
| [`08-testing`](./08-testing)                 | Estrategia de QA.                                               |
| [`09-content-seo`](./09-content-seo)         | Contenido/copy y SEO.                                           |
| [`10-deployment`](./10-deployment)           | Guía preparada para el despliegue futuro.                       |

## Convenciones de la documentación

- Cada decisión técnica relevante se registra como **ADR** en [`01-architecture/decisions`](./01-architecture/decisions).
- La documentación se actualiza **en el mismo commit** que el código que describe.
- Los documentos marcados _(pendiente — Fase N)_ se completarán cuando esa parte se construya.

## Estado por fases (§18 del prompt maestro)

- ✅ **Fase 0 — Cimientos:** scaffold, tooling, estructura, tokens de diseño, layout raíz,
  cabeceras de seguridad, accesibilidad base. **Completada.**
- ✅ **Fase 1 — Sistema de diseño y primitivos:** tema claro+oscuro con tokens, primitivos `ui/`
  (Button, Card, Container, Input, Accordion), Header/Footer/Navegación accesibles y ThemeToggle.
  **Completada.**
- ✅ **Fase 2 — Estructura y contenido estático:** las 9 secciones de la landing con el copy
  oficial, responsive y accesibles (contenido en `lib/constants`). **Completada.**
- ⬜ Fase 3 — Capa de motion (animaciones).
- ⬜ Fase 4 — Formularios y backend local.
- ⬜ Fase 5 — SEO, metadata, pulido.
- ⬜ Fase 6 — QA final y hardening.
- ⬜ Fase 7 — Preparación de despliegue.
