import { useEffect, useId, useState } from 'react'
import { formatPrice } from '../../lib/format'
import { useActiveVariant, useAppStore } from '../../state/store'
import { IconBag } from '../components/Icons'
import { Reveal } from '../components/Reveal'
import { SprayButton } from '../components/SprayButton'
import { useToast } from '../components/Toast'

function Meter({ label, value, caption }: { label: string; value: number; caption: string }) {
  return (
    <div className="meter">
      <dt>{label}</dt>
      <dd>
        <span className="meter__track" role="img" aria-label={`${value} dari 5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < value ? 'is-on' : ''} />
          ))}
        </span>
        <span className="meter__caption">{caption}</span>
      </dd>
    </div>
  )
}

export function ProductDetail() {
  const variant = useActiveVariant()
  const addToCart = useAppStore((s) => s.addToCart)
  const showToast = useToast((s) => s.show)
  const { product } = variant
  const [ml, setMl] = useState(50)
  const groupName = useId()

  // Keep the chosen size valid if a variant ever offers different sizes.
  useEffect(() => {
    if (!product.sizes.some((s) => s.ml === ml)) setMl(product.sizes[1]?.ml ?? product.sizes[0].ml)
  }, [product, ml])

  const size = product.sizes.find((s) => s.ml === ml) ?? product.sizes[0]

  const buy = () => {
    addToCart()
    // Placeholder: wire to your checkout / cart API here.
    showToast(`${variant.name} ${size.ml} ml ditambahkan ke keranjang`)
  }

  return (
    <section id="produk" data-section="produk" className="section section--left" aria-labelledby="produk-title">
      <Reveal className="panel panel--product">
        <p className="eyebrow">Detail Produk</p>
        <h2 id="produk-title" className="section-title">
          {variant.name}
        </h2>
        <p className="product__concentration">
          {product.concentration} · <span className="product__sku">{product.sku}</span>
        </p>

        <p className="product__price" aria-live="polite">
          {formatPrice(size.price)}
          <span> / {size.ml} ml</span>
        </p>

        <fieldset className="size-picker">
          <legend>Ukuran</legend>
          <div className="size-picker__options">
            {product.sizes.map((s) => (
              <label key={s.ml} className="size-option">
                <input
                  type="radio"
                  name={groupName}
                  value={s.ml}
                  checked={s.ml === size.ml}
                  onChange={() => setMl(s.ml)}
                />
                <span className="size-option__body">
                  <strong>{s.ml} ml</strong>
                  <small>{formatPrice(s.price)}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <dl className="meters">
          <Meter label="Daya tahan" value={product.longevity} caption={product.longevityLabel} />
          <Meter label="Jejak aroma" value={product.sillage} caption={product.sillageLabel} />
        </dl>

        <div className="ingredients">
          <h3>Bahan utama</h3>
          <ul>
            {product.keyIngredients.map((ing) => (
              <li key={ing.name}>
                <strong>{ing.name}</strong>
                <span className="ingredients__origin">{ing.origin}</span>
                <span className="ingredients__desc">{ing.description}</span>
              </li>
            ))}
          </ul>
          <details className="inci">
            <summary>Komposisi lengkap</summary>
            <p>{product.fullIngredients}</p>
          </details>
        </div>

        <div className="product__actions">
          <button type="button" className="btn btn--solid btn--large" onClick={buy}>
            <IconBag size={18} />
            Beli Sekarang
          </button>
          <SprayButton label="Coba semprot" />
        </div>
        <p className="product__note">Gratis ongkir ke seluruh Indonesia · Sampel 2 ml di setiap pesanan</p>
      </Reveal>
    </section>
  )
}
