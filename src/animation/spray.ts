import { SPRAY_TIMELINE as T } from '../config/scene'
import { easeInOutCubic, easeOutCubic, progress } from './easing'

export interface SprayPhase {
  /** Seconds since the spray was triggered (Infinity when idle). */
  elapsed: number
  /** 0 → 1 → 0: cap lifted off the atomiser. */
  capOff: number
  /** 0 → 1 → 0: actuator pressed down. */
  press: number
  /** Seconds since particle emission began (negative before). */
  emitTime: number
  active: boolean
}

export function getSprayPhase(sprayAt: number | null, now = performance.now()): SprayPhase {
  if (sprayAt === null) return { elapsed: Infinity, capOff: 0, press: 0, emitTime: -1, active: false }
  const t = (now - sprayAt) / 1000
  const lift = easeOutCubic(progress(t, 0, T.capLiftEnd))
  const back = easeInOutCubic(progress(t, T.capReturnStart, T.capReturnEnd))
  const pressT = progress(t, T.pressStart, T.pressEnd)
  return {
    elapsed: t,
    capOff: lift * (1 - back),
    press: Math.sin(pressT * Math.PI),
    emitTime: t - T.emitStart,
    active: t < T.total,
  }
}
