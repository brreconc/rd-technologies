/**
 * Logos de plataforma para la demo del hero (ADR-019).
 *
 * Muestran los LOGOTIPOS OFICIALES que el proyecto aporta como imágenes en
 * `public/logos/` (Android, Apple/iOS, React/Web y Windows). Se sirven como
 * estáticos desde el mismo origen (compatible con la CSP estricta; sin
 * peticiones externas). Se escalan con las clases del contenedor
 * (`.hcd-logo`, `.hc-bar-logo`, `.hcd-badge`) en CSS. Decorativos (`aria-hidden`):
 * el contenido accesible del hero vive en el `<h1>` y su texto.
 *
 * Nota: son marcas de terceros (Google, Apple, Meta, Microsoft); el uso de estos
 * activos en el sitio es responsabilidad del proyecto (respetar sus guías de marca).
 */

function PlatformLogo({ src }: { src: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" aria-hidden="true" draggable={false} className="pf-logo" />;
}

/** Android → logotipo oficial (robot verde). */
export function RobotEmblem() {
  return <PlatformLogo src="/logos/android.webp" />;
}

/** iOS → logotipo oficial de Apple. */
export function MobileEmblem() {
  return <PlatformLogo src="/logos/apple.webp" />;
}

/** Windows → logotipo oficial. */
export function WindowEmblem() {
  return <PlatformLogo src="/logos/windows.webp" />;
}

/** Desarrollo Web → logotipo de React. */
export function GlobeEmblem() {
  return <PlatformLogo src="/logos/react.webp" />;
}
