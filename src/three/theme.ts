import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { getVariant, type ScentPalette } from '../data/products'
import { useAppStore } from '../state/store'
import { dampFactor } from '../animation/easing'

type PaletteKey = keyof ScentPalette

/**
 * Live, smoothly-interpolated scene colours. Every 3D component reads from
 * this object inside its own useFrame, so a variant change cross-fades the
 * liquid, lights, backdrop and atmosphere together.
 */
const initial = getVariant(useAppStore.getState().variantId).palette

export const livePalette = Object.fromEntries(
  Object.entries(initial).map(([k, v]) => [k, new THREE.Color(v)]),
) as Record<PaletteKey, THREE.Color>

const target = Object.fromEntries(
  Object.entries(initial).map(([k, v]) => [k, new THREE.Color(v)]),
) as Record<PaletteKey, THREE.Color>

/**
 * 0 → 1 pulse that rises on every variant change and decays afterwards.
 * Components use it for small flourishes (light flare, bottle half-turn).
 */
export const transition = { pulse: 0, startedAt: -Infinity }

let currentId = useAppStore.getState().variantId

/** Mount once inside <Canvas>. Runs before other frame callbacks. */
export function ThemeDriver() {
  useFrame((_, delta) => {
    const { variantId, motion } = useAppStore.getState()
    if (variantId !== currentId) {
      currentId = variantId
      const palette = getVariant(variantId).palette
      for (const key of Object.keys(palette) as PaletteKey[]) target[key].set(palette[key])
      transition.startedAt = performance.now()
    }

    const instant = motion === 'paused' && delta > 0.25
    const k = instant ? 1 : dampFactor(motion === 'full' ? 2.6 : 5, delta)
    for (const key of Object.keys(target) as PaletteKey[]) livePalette[key].lerp(target[key], k)

    const since = (performance.now() - transition.startedAt) / 1000
    transition.pulse = since < 0 ? 0 : Math.max(0, Math.sin(Math.min(1, since / 1.6) * Math.PI))
  }, -2)
  return null
}
