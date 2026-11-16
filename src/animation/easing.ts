export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Normalised progress of `t` within [start, end]. */
export const progress = (t: number, start: number, end: number) => clamp01((t - start) / (end - start))

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeOutBack = (t: number) => {
  const c1 = 1.4
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2

/**
 * Frame-rate independent exponential smoothing factor.
 * `lambda` ≈ responsiveness (higher = snappier).
 */
export const dampFactor = (lambda: number, delta: number) => 1 - Math.exp(-lambda * Math.min(delta, 0.1))
