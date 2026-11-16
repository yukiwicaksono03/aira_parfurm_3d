import { useEffect, useState } from 'react'
import { useAppStore } from '../../state/store'
import { SPRAY_TIMELINE } from '../../config/scene'
import { IconSpray } from './Icons'

/** Triggers the atomiser animation; disabled (aria-disabled) while one is playing. */
export function SprayButton({ variant = 'ghost', label = 'Semprotkan' }: { variant?: 'ghost' | 'solid'; label?: string }) {
  const spray = useAppStore((s) => s.spray)
  const sprayAt = useAppStore((s) => s.sprayAt)
  const webglFailed = useAppStore((s) => s.webglFailed)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (sprayAt === null) return
    setBusy(true)
    const remaining = SPRAY_TIMELINE.total * 1000 - (performance.now() - sprayAt)
    const t = setTimeout(() => setBusy(false), Math.max(0, remaining))
    return () => clearTimeout(t)
  }, [sprayAt])

  if (webglFailed) return null

  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--spray${busy ? ' is-busy' : ''}`}
      aria-disabled={busy}
      onClick={() => {
        if (!busy) spray()
      }}
    >
      <IconSpray size={18} />
      <span>{busy ? 'Menyemprot…' : label}</span>
    </button>
  )
}
