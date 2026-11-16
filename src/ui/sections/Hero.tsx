import { BRAND } from '../../data/brand'
import { cssVars } from '../../lib/css'
import { useActiveVariant, useAppStore } from '../../state/store'
import { IconArrowDown } from '../components/Icons'
import { SprayButton } from '../components/SprayButton'
import { StageControls } from '../components/StageControls'
import { VariantSwitcher } from '../components/VariantSwitcher'
import { WebGLNotice } from '../components/WebGLFallback'

export function Hero() {
  const variant = useActiveVariant()
  const exploring = useAppStore((s) => s.exploring)
  const webglFailed = useAppStore((s) => s.webglFailed)

  return (
    <section
      id="top"
      data-section="hero"
      className={`hero${exploring ? ' is-exploring' : ''}`}
      aria-labelledby="hero-title"
    >
      <div className="hero__copy" aria-hidden={exploring || undefined} inert={exploring || undefined}>
        <p className="eyebrow intro-item" style={cssVars({ '--i': 0 })}>
          {BRAND.collection}
        </p>
        <h1 id="hero-title" className="hero__title intro-item" style={cssVars({ '--i': 1 })}>
          <span className="hero__brand">Aira</span>
          <span className="hero__variant" key={variant.id}>
            {variant.name.replace(/^Aira\s+/, '')}
          </span>
        </h1>
        <p className="hero__family intro-item" style={cssVars({ '--i': 2 })}>
          Eau de Parfum · {variant.family}
        </p>
        <p className="hero__tagline intro-item" style={cssVars({ '--i': 3 })} key={`t-${variant.id}`}>
          {variant.tagline}
        </p>
        <div className="hero__actions intro-item" style={cssVars({ '--i': 4 })}>
          <a href="#aroma" className="btn btn--solid">
            Jelajahi Aroma
          </a>
          <SprayButton />
        </div>
        <div className="hero__variants intro-item" style={cssVars({ '--i': 5 })}>
          <p className="hero__variants-label" aria-hidden="true">
            Pilih aroma
          </p>
          <VariantSwitcher label="Pilih varian aroma" />
        </div>
        {webglFailed && <WebGLNotice />}
      </div>

      <StageControls />

      <a href="#aroma" className="scroll-cue" aria-label="Gulir ke profil aroma">
        <span>Gulir</span>
        <IconArrowDown size={16} />
      </a>
    </section>
  )
}
