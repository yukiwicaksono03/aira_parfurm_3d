import { create } from 'zustand'
import { DEFAULT_VARIANT_ID, VARIANTS } from '../data/products'
import { SPRAY_TIMELINE } from '../config/scene'
import { detectQualityTier, type QualityTier } from '../lib/device'
import { readStorage, writeStorage } from '../lib/storage'

export type MotionMode = 'full' | 'reduced' | 'paused'
export type SectionId = 'hero' | 'aroma' | 'cerita' | 'varian' | 'produk' | 'footer'

const MOTION_KEY = 'aira:motion'

function systemPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

function initialMotion(): { motion: MotionMode; motionSource: 'system' | 'user' } {
  const stored = readStorage(MOTION_KEY)
  if (stored === 'full' || stored === 'reduced' || stored === 'paused') {
    return { motion: stored, motionSource: 'user' }
  }
  return { motion: systemPrefersReducedMotion() ? 'reduced' : 'full', motionSource: 'system' }
}

interface AppState {
  variantId: string
  setVariant: (id: string) => void

  motion: MotionMode
  motionSource: 'system' | 'user'
  setMotion: (mode: MotionMode, source?: 'system' | 'user') => void

  section: SectionId
  setSection: (section: SectionId) => void

  /** Focused 3D mode: hero copy hides, bottle centres, touch rotate + pinch zoom unlock. */
  exploring: boolean
  setExploring: (value: boolean) => void

  /** performance.now() timestamp of the last spray, or null. */
  sprayAt: number | null
  spray: () => boolean

  quality: QualityTier
  setQuality: (tier: QualityTier) => void

  /** The lazily-loaded 3D runtime chunk has mounted. */
  runtimeLoaded: boolean
  setRuntimeLoaded: () => void
  sceneReady: boolean
  setSceneReady: () => void
  /** WebGL missing or crashed — the static illustrated fallback is shown instead. */
  webglFailed: boolean
  failWebGL: () => void
  /** performance.now() timestamp at which the intro reveal starts. */
  introStartedAt: number | null
  startIntro: () => void

  /**
   * When motion is paused the canvas only renders on demand. Anything that
   * needs a short burst of frames (variant transition, spray, drag) calls wake().
   */
  wakeUntil: number
  wake: (ms: number) => void

  cartCount: number
  addToCart: () => void

  announcement: string
  announce: (message: string) => void
}

export const useAppStore = create<AppState>()((set, get) => ({
  variantId: DEFAULT_VARIANT_ID,
  setVariant: (id) => {
    if (id === get().variantId) return
    const variant = VARIANTS.find((v) => v.id === id)
    if (!variant) return
    set({ variantId: id, announcement: `Varian ${variant.name} dipilih — ${variant.family}.` })
    get().wake(2200)
  },

  ...initialMotion(),
  setMotion: (mode, source = 'user') => {
    if (source === 'user') writeStorage(MOTION_KEY, mode)
    set({ motion: mode, motionSource: source })
    get().wake(600)
  },

  section: 'hero',
  setSection: (section) => {
    if (section === get().section) return
    set(section === 'hero' ? { section } : { section, exploring: false })
    get().wake(1600)
  },

  exploring: false,
  setExploring: (value) => {
    set({ exploring: value })
    get().wake(1400)
  },

  sprayAt: null,
  spray: () => {
    const now = performance.now()
    const last = get().sprayAt
    if (last !== null && now - last < SPRAY_TIMELINE.total * 1000) return false
    set({ sprayAt: now, announcement: 'Semprotan parfum dilepaskan.' })
    get().wake(SPRAY_TIMELINE.total * 1000 + 200)
    return true
  },

  quality: detectQualityTier(),
  setQuality: (quality) => set({ quality }),

  runtimeLoaded: false,
  setRuntimeLoaded: () => set({ runtimeLoaded: true }),
  sceneReady: false,
  setSceneReady: () => set({ sceneReady: true }),
  webglFailed: false,
  failWebGL: () => set({ webglFailed: true }),
  introStartedAt: null,
  startIntro: () => {
    if (get().introStartedAt !== null) return
    set({ introStartedAt: performance.now() })
    get().wake(4000)
  },

  wakeUntil: 0,
  wake: (ms) => {
    const until = performance.now() + ms
    if (until > get().wakeUntil) set({ wakeUntil: until })
  },

  cartCount: 0,
  addToCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),

  announcement: '',
  announce: (message) => set({ announcement: message }),
}))

/** Convenience selector for the active variant object. */
export const useActiveVariant = () => {
  const id = useAppStore((s) => s.variantId)
  return VARIANTS.find((v) => v.id === id) ?? VARIANTS[0]
}

/** Ambient animation speed multiplier for the current motion mode. */
export function ambientSpeed(mode: MotionMode): number {
  return mode === 'full' ? 1 : mode === 'reduced' ? 0.18 : 0
}
