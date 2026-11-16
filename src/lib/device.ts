export type QualityTier = 'high' | 'medium' | 'low'

/** Coarse/touch pointer — phones and most tablets. */
export function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
}

/**
 * Initial GPU budget guess. PerformanceMonitor in the scene can still step it
 * down at runtime if the frame rate drops.
 */
export function detectQualityTier(): QualityTier {
  if (typeof window === 'undefined') return 'medium'
  // Manual override for testing / demos: ?quality=high|medium|low
  const forced = new URLSearchParams(window.location.search).get('quality')
  if (forced === 'high' || forced === 'medium' || forced === 'low') return forced
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const narrow = window.innerWidth < 768
  const coarse = isCoarsePointer()
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData

  if (saveData || cores <= 4 || memory <= 2) return 'low'
  if (coarse || narrow) return 'medium'
  return 'high'
}

/**
 * Per-tier rendering budget used throughout the scene.
 * Note: the glass refraction buffer always matches the canvas size — a fixed,
 * smaller buffer leaves dark voids in the glass on tall viewports. GPU cost is
 * controlled through the DPR cap instead.
 */
export const QUALITY_SETTINGS = {
  high: {
    dpr: [1, 2] as [number, number],
    transmissionSamples: 8,
    backside: true,
    dof: true,
    multisampling: 4,
    particles: 520,
    petals: 22,
    sprayParticles: 1400,
  },
  medium: {
    dpr: [1, 1.5] as [number, number],
    transmissionSamples: 5,
    backside: false,
    dof: false,
    multisampling: 0,
    particles: 280,
    petals: 12,
    sprayParticles: 800,
  },
  low: {
    dpr: [1, 1.25] as [number, number],
    transmissionSamples: 3,
    backside: false,
    dof: false,
    multisampling: 0,
    particles: 140,
    petals: 6,
    sprayParticles: 450,
  },
} satisfies Record<QualityTier, unknown>
