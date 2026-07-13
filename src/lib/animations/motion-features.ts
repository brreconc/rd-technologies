// Se importa de forma diferida por `LazyMotion` (ver providers.tsx) para que el
// motor de animación de Framer (domAnimation) quede en un chunk aparte y NO
// pese en el JS inicial (§11). Las animaciones se activan al cargar este chunk.
import { domAnimation } from "framer-motion";

export default domAnimation;
