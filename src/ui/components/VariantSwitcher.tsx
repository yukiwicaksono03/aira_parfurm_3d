import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { VARIANTS } from '../../data/products'
import { useAppStore } from '../../state/store'

/**
 * Compact scent selector (radio group semantics with roving focus: arrow keys
 * move between scents, Tab leaves the group).
 */
export function VariantSwitcher({ label = 'Pilih varian aroma' }: { label?: string }) {
  const variantId = useAppStore((s) => s.variantId)
  const setVariant = useAppStore((s) => s.setVariant)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (index + dir + VARIANTS.length) % VARIANTS.length
    setVariant(VARIANTS[next].id)
    refs.current[next]?.focus()
  }

  return (
    <div className="variant-switcher" role="radiogroup" aria-label={label}>
      {VARIANTS.map((v, i) => {
        const checked = v.id === variantId
        return (
          <button
            key={v.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className="variant-chip"
            onClick={() => setVariant(v.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            style={{ '--chip-a': v.palette.liquid, '--chip-b': v.palette.liquidDeep } as CSSProperties}
          >
            <span className="variant-chip__swatch" aria-hidden="true" />
            <span className="variant-chip__name">{v.name.replace(/^Aira\s+/, '')}</span>
          </button>
        )
      })}
    </div>
  )
}
