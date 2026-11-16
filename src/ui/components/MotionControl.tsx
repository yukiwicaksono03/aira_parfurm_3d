import { useEffect, useId, useRef, useState } from 'react'
import { useAppStore, type MotionMode } from '../../state/store'
import { IconMotion, IconPause } from './Icons'

const OPTIONS: { value: MotionMode; label: string; hint: string }[] = [
  { value: 'full', label: 'Penuh', hint: 'Semua animasi dan atmosfer aktif' },
  { value: 'reduced', label: 'Dikurangi', hint: 'Gerak lambat, tanpa rotasi otomatis' },
  { value: 'paused', label: 'Hentikan', hint: 'Semua animasi latar dihentikan' },
]

/** Disclosure with a radio group for the animation level. */
export function MotionControl() {
  const motion = useAppStore((s) => s.motion)
  const setMotion = useAppStore((s) => s.setMotion)
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  const current = OPTIONS.find((o) => o.value === motion)!

  return (
    <div className="motion-control" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Pengaturan animasi: ${current.label}`}
        onClick={() => setOpen((v) => !v)}
      >
        {motion === 'paused' ? <IconPause size={20} /> : <IconMotion size={20} />}
      </button>
      {open && (
        <div className="motion-control__panel" id={panelId}>
          <fieldset>
            <legend>Animasi</legend>
            {OPTIONS.map((o) => (
              <label key={o.value} className="motion-control__option">
                <input
                  type="radio"
                  name="motion-mode"
                  value={o.value}
                  checked={motion === o.value}
                  onChange={() => setMotion(o.value)}
                />
                <span>
                  <strong>{o.label}</strong>
                  <small>{o.hint}</small>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      )}
    </div>
  )
}
