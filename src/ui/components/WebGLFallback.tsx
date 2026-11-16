import { useActiveVariant } from '../../state/store'

/**
 * Static stand-in when WebGL is unavailable or crashes: a CSS-drawn bottle in
 * the active variant's colours over the same backdrop gradient. All page
 * content and variant switching keep working.
 */
export function WebGLFallback() {
  const variant = useActiveVariant()
  return (
    <div className="fallback-stage" aria-hidden="true">
      <div className="fallback-bottle" key={variant.id}>
        <div className="fallback-bottle__cap" />
        <div className="fallback-bottle__collar" />
        <div className="fallback-bottle__glass">
          <div className="fallback-bottle__liquid" />
          <div className="fallback-bottle__label">
            <span>AIRA</span>
            <small>{variant.name.replace(/^Aira\s+/, '')}</small>
          </div>
        </div>
        <div className="fallback-bottle__plinth" />
      </div>
    </div>
  )
}

export function WebGLNotice() {
  return (
    <p className="webgl-notice" role="note">
      Tampilan 3D tidak tersedia di perangkat atau browser ini — Anda melihat versi statis.
    </p>
  )
}
