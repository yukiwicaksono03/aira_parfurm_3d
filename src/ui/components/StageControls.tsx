import { useEffect, useId, type KeyboardEvent } from 'react'
import { useAppStore } from '../../state/store'
import { resetView, rotateBy, zoomBy } from '../../three/controls/controlState'
import { isCoarsePointer } from '../../lib/device'
import {
  IconClose,
  IconExpand,
  IconReset,
  IconRotateLeft,
  IconRotateRight,
  IconZoomIn,
  IconZoomOut,
} from './Icons'
import { SprayButton } from './SprayButton'

const STEP = Math.PI / 8

/**
 * Keyboard-operable stand-in for the bottle (the canvas itself is
 * aria-hidden) plus an on-screen control dock. Every pointer gesture has a
 * button / key equivalent.
 */
export function StageControls() {
  const exploring = useAppStore((s) => s.exploring)
  const setExploring = useAppStore((s) => s.setExploring)
  const webglFailed = useAppStore((s) => s.webglFailed)
  const descId = useId()

  useEffect(() => {
    if (!exploring) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setExploring(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [exploring, setExploring])

  if (webglFailed) return null

  const onKeyDown = (e: KeyboardEvent) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => rotateBy(-STEP),
      ArrowRight: () => rotateBy(STEP),
      ArrowUp: () => rotateBy(0, -STEP / 2),
      ArrowDown: () => rotateBy(0, STEP / 2),
      '+': () => zoomBy(1.15),
      '=': () => zoomBy(1.15),
      '-': () => zoomBy(1 / 1.15),
      '0': resetView,
      Home: resetView,
    }
    const action = actions[e.key]
    if (action) {
      e.preventDefault()
      action()
    }
  }

  const touch = isCoarsePointer()
  const hint = touch
    ? exploring
      ? 'Geser untuk memutar · cubit untuk zoom'
      : 'Geser ke samping untuk memutar botol'
    : 'Seret untuk memutar · scroll ke atas untuk zoom'

  return (
    <div className={`stage${exploring ? ' is-exploring' : ''}`}>
      <div
        className="stage__focus"
        tabIndex={0}
        role="group"
        aria-roledescription="penampil 3D"
        aria-label="Botol parfum 3D"
        aria-describedby={descId}
        onKeyDown={onKeyDown}
      />
      <p id={descId} className="sr-only">
        Gunakan panah kiri dan kanan untuk memutar botol, panah atas dan bawah untuk memiringkan, plus dan minus
        untuk zoom, dan nol untuk mengatur ulang tampilan.
      </p>

      <div className="stage__dock">
        <p className="stage__hint" aria-hidden="true">
          {hint}
        </p>
        <div className="dock" role="toolbar" aria-label="Kontrol tampilan botol">
          <button type="button" className="icon-btn dock__extra" aria-label="Putar ke kiri" onClick={() => rotateBy(-STEP)}>
            <IconRotateLeft size={20} />
          </button>
          <button type="button" className="icon-btn dock__extra" aria-label="Putar ke kanan" onClick={() => rotateBy(STEP)}>
            <IconRotateRight size={20} />
          </button>
          <button type="button" className="icon-btn dock__extra" aria-label="Perbesar" onClick={() => zoomBy(1.2)}>
            <IconZoomIn size={20} />
          </button>
          <button type="button" className="icon-btn dock__extra" aria-label="Perkecil" onClick={() => zoomBy(1 / 1.2)}>
            <IconZoomOut size={20} />
          </button>
          <button type="button" className="icon-btn dock__extra" aria-label="Atur ulang tampilan" onClick={resetView}>
            <IconReset size={20} />
          </button>
          <span className="dock__divider dock__extra" aria-hidden="true" />
          <button
            type="button"
            className="icon-btn"
            aria-pressed={exploring}
            aria-label={exploring ? 'Keluar dari mode eksplor' : 'Mode eksplor 3D layar penuh'}
            onClick={() => {
              if (exploring) resetView()
              setExploring(!exploring)
            }}
          >
            {exploring ? <IconClose size={20} /> : <IconExpand size={20} />}
          </button>
        </div>
        {exploring && <SprayButton variant="solid" />}
      </div>
    </div>
  )
}
