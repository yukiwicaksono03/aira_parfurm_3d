import { useEffect, useState } from 'react'
import { useAppStore } from '../../state/store'
import { BRAND } from '../../data/brand'

const MIN_VISIBLE_MS = 900
const FADE_MS = 900

/**
 * Elegant first-load veil. Tracks three real milestones (fonts, 3D runtime,
 * compiled scene) rather than faking a progress bar, then fades into the
 * intro reveal.
 */
export function Loader() {
  const runtimeLoaded = useAppStore((s) => s.runtimeLoaded)
  const sceneReady = useAppStore((s) => s.sceneReady)
  const webglFailed = useAppStore((s) => s.webglFailed)
  const startIntro = useAppStore((s) => s.startIntro)
  const [fontsReady, setFontsReady] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)
  const [phase, setPhase] = useState<'loading' | 'leaving' | 'gone'>('loading')

  useEffect(() => {
    const t = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS)
    const fonts = document.fonts?.ready ?? Promise.resolve()
    // Never let a slow font CDN hold the page hostage.
    const fontTimeout = new Promise((r) => setTimeout(r, 2500))
    Promise.race([fonts, fontTimeout]).then(() => setFontsReady(true))
    return () => clearTimeout(t)
  }, [])

  const steps = [fontsReady, runtimeLoaded || webglFailed, sceneReady || webglFailed]
  const done = steps.filter(Boolean).length
  const complete = done === steps.length && minElapsed

  useEffect(() => {
    if (!complete || phase !== 'loading') return
    setPhase('leaving')
    startIntro()
    const t = setTimeout(() => setPhase('gone'), FADE_MS)
    return () => clearTimeout(t)
  }, [complete, phase, startIntro])

  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', phase === 'loading')
  }, [phase])

  if (phase === 'gone') return null

  const label = !fontsReady ? 'Menyiapkan tipografi' : !steps[1] ? 'Memuat ruang 3D' : 'Meracik cahaya & kaca'

  return (
    <div className={`loader${phase === 'leaving' ? ' is-leaving' : ''}`} role="status" aria-live="polite">
      <div className="loader__inner">
        <p className="loader__brand">
          {BRAND.wordmark}
          <span>{BRAND.suffix}</span>
        </p>
        <div
          className="loader__bar"
          role="progressbar"
          aria-label="Memuat pengalaman"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={done}
        >
          <span style={{ transform: `scaleX(${done / steps.length})` }} />
        </div>
        <p className="loader__label">{phase === 'leaving' ? 'Selamat datang' : `${label}…`}</p>
      </div>
    </div>
  )
}
