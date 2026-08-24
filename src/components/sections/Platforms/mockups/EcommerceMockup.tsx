import * as React from "react";
import { Glyph, type GlyphName } from "./Glyph";

/** Tres, por la misma razón que en Android: con cuatro el último topa con el marco. */
const CHIPS = ["Novedades", "Mujer", "Hombre"];

type Product = {
  name: string;
  price: string;
  was?: string;
  badge?: string;
  /** Tanto por uno de la barra de existencias. */
  stock: number;
  rating: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Chaqueta técnica",
    price: "129,00 €",
    was: "159,00 €",
    badge: "-20%",
    stock: 0.8,
    rating: "4,8",
  },
  { name: "Mochila 24 L", price: "74,50 €", stock: 0.35, rating: "4,6" },
  { name: "Zapatilla trail", price: "98,00 €", badge: "NUEVO", stock: 0.62, rating: "4,9" },
  { name: "Sudadera térmica", price: "64,90 €", stock: 0.18, rating: "4,7" },
];

const PAY: GlyphName[] = ["card", "shield", "truck"];

/**
 * Mock-up del destino E-commerce: un escaparate en tablet vertical, con la
 * gramática propia del comercio —cabecera con carrito, banner de campaña,
 * filtros, rejilla de producto con precio tachado y existencias, y una barra de
 * pago fija—. Decorativo, como el resto: ver `WebMockup`.
 *
 * Lo que lo distingue del mock-up Web no es el estilo sino QUÉ mide: aquí todo
 * lo que se enseña es dinero y disponibilidad, que es lo que el cliente de una
 * tienda mira. La animación propia (`mk-ec-toast`, `mk-ec-cta`) representa la
 * conversión en curso; se apaga entera con `prefers-reduced-motion`.
 */
export function EcommerceMockup() {
  return (
    <div className="mk mk-ec">
      <div className="mk-status">
        <span>09:41</span>
        <span className="mk-status-r">
          <i className="mk-sig" />
          <i className="mk-batt" />
        </span>
      </div>

      <div className="mk-ec-bar">
        <span className="mk-ec-brand">ATELIER</span>
        <span className="mk-ec-search">
          <Glyph name="search" className="mk-ico" />
          Buscar en la tienda
        </span>
        <span className="mk-ec-acts">
          <Glyph name="heart" className="mk-ico" />
          <span className="mk-ec-cart">
            <Glyph name="cart" className="mk-ico" />
            <i className="mk-ec-badge">3</i>
          </span>
        </span>
      </div>

      <div className="mk-ec-hero">
        <span className="mk-ec-hero-k">Campaña de temporada</span>
        <b className="mk-ec-hero-t">Hasta −30% en abrigo técnico</b>
        <span className="mk-ec-hero-c">Ver colección</span>
        <span className="mk-ec-hero-art" />
      </div>

      <div className="mk-chips">
        {CHIPS.map((chip, index) => (
          <span key={chip} className={index === 0 ? "mk-chip mk-on" : "mk-chip"}>
            {chip}
          </span>
        ))}
        <span className="mk-ec-count">128 artículos</span>
      </div>

      <div className="mk-ec-grid">
        {PRODUCTS.map((product, index) => (
          <div key={product.name} className="mk-ec-card">
            <span className={`mk-ec-shot mk-ec-shot-${index + 1}`}>
              {product.badge ? <i className="mk-ec-badge-t">{product.badge}</i> : null}
            </span>
            <span className="mk-ec-name">{product.name}</span>
            <span className="mk-ec-price">
              <b>{product.price}</b>
              {product.was ? <s>{product.was}</s> : null}
            </span>
            <span className="mk-ec-meta">
              <Glyph name="star" className="mk-ico" />
              {product.rating}
              <i className="mk-ec-stock">
                <i style={{ width: `${product.stock * 100}%` }} />
              </i>
            </span>
          </div>
        ))}

        {/* Aviso de conversión: la única pieza que se mueve sola dentro del
            escaparate, y la que cuenta el argumento de la sección. */}
        <span className="mk-ec-toast">
          <Glyph name="check" className="mk-ico" />
          Añadido al carrito
        </span>
      </div>

      <div className="mk-ec-pay">
        <span className="mk-ec-total">
          <em>Total</em>
          <b>268,40 €</b>
        </span>
        <span className="mk-ec-cta">Pagar</span>
        <span className="mk-ec-trust">
          {PAY.map((icon) => (
            <Glyph key={icon} name={icon} className="mk-ico" />
          ))}
        </span>
      </div>
    </div>
  );
}
