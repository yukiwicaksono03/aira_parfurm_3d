import { VARIANTS } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { cssVars } from '../../lib/css'
import { useAppStore } from '../../state/store'
import { IconCheck } from '../components/Icons'
import { Reveal } from '../components/Reveal'

export function Variants() {
  const variantId = useAppStore((s) => s.variantId)
  const setVariant = useAppStore((s) => s.setVariant)

  return (
    <section id="varian" data-section="varian" className="section section--right" aria-labelledby="varian-title">
      <div className="variants-column">
        <Reveal className="panel panel--compact">
          <p className="eyebrow">Pilihan Varian</p>
          <h2 id="varian-title" className="section-title">
            Tiga aroma, <em>tiga tempat</em>
          </h2>
          <p className="lede">Pilih satu — botol, cahaya, dan suasana di sekitarnya berubah mengikutinya.</p>
        </Reveal>

        <ul className="variant-cards">
          {VARIANTS.map((v, i) => {
            const selected = v.id === variantId
            const highlights = [v.notes.top[0], v.notes.heart[0], v.notes.base[0]]
            return (
              <Reveal
                as="li"
                key={v.id}
                delay={i * 110}
                className={`variant-card${selected ? ' is-selected' : ''}`}
                style={cssVars({ '--card-a': v.palette.liquid, '--card-b': v.palette.liquidDeep, '--card-accent': v.palette.accent })}
              >
                <div className="variant-card__orb" aria-hidden="true" />
                <p className="variant-card__family">{v.family}</p>
                <h3 className="variant-card__name">{v.name}</h3>
                <p className="variant-card__desc">{v.shortDescription}</p>
                <p className="variant-card__notes">
                  <span className="sr-only">Nada utama: </span>
                  {highlights.map((n) => n.name).join(' · ')}
                </p>
                <div className="variant-card__footer">
                  <p className="variant-card__price">
                    <span>Mulai</span> {formatPrice(v.product.sizes[0].price)}
                  </p>
                  <button
                    type="button"
                    className={`btn ${selected ? 'btn--solid' : 'btn--ghost'} btn--small`}
                    aria-pressed={selected}
                    onClick={() => setVariant(v.id)}
                  >
                    {selected ? (
                      <>
                        <IconCheck size={16} /> Dipilih
                      </>
                    ) : (
                      <>
                        Pilih <span className="sr-only">{v.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
