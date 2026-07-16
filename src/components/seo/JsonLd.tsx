/**
 * Renderiza un bloque de datos estructurados JSON-LD como `<script>` nativo.
 *
 * Se usa `<script>` (no `next/script`): JSON-LD son datos, no código a ejecutar.
 * Seguridad (§9): `JSON.stringify` NO sanea, así que se escapa `<` → `<`
 * para impedir que un `</script>` incrustado en el contenido cierre la etiqueta
 * (XSS). Es un Server Component: el JSON se emite ya en el HTML inicial.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
