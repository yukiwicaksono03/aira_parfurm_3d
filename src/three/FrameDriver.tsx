import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useAppStore } from '../state/store'

/**
 * When motion is paused the canvas runs with frameloop="demand". This keeps
 * rendering for short bursts (wake windows) so user-initiated changes — a
 * drag, a variant switch, the spray — still animate to completion.
 */
export function FrameDriver() {
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    let raf = 0
    const tick = () => {
      const { motion, wakeUntil } = useAppStore.getState()
      if (motion !== 'paused') {
        raf = 0
        return
      }
      invalidate()
      raf = performance.now() < wakeUntil ? requestAnimationFrame(tick) : 0
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    start()
    const unsub = useAppStore.subscribe(start)
    return () => {
      unsub()
      cancelAnimationFrame(raf)
    }
  }, [invalidate])

  return null
}
