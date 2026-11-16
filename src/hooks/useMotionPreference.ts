import { useEffect } from 'react'
import { useAppStore } from '../state/store'

/**
 * Keeps the motion mode in sync with the OS `prefers-reduced-motion` setting
 * until the visitor picks a mode themselves, and mirrors the mode onto
 * <html data-motion> so CSS animations follow the same switch.
 */
export function useMotionPreference() {
  const motion = useAppStore((s) => s.motion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      const { motionSource, setMotion } = useAppStore.getState()
      if (motionSource === 'system') setMotion(mq.matches ? 'reduced' : 'full', 'system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = motion
  }, [motion])
}
