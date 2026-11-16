/**
 * Scene-level configuration. Everything a designer or developer is likely to
 * tweak without touching component code lives here.
 */

/**
 * Path to a GLB/GLTF bottle model (e.g. '/models/aira-bottle.glb').
 * Leave as `null` to use the procedural Three.js bottle.
 * See public/models/README.md for the expected mesh naming.
 */
export const BOTTLE_MODEL_URL: string | null = null

/** Uniform scale applied to a loaded GLB so it matches the procedural bottle (~2.4 units tall). */
export const BOTTLE_MODEL_SCALE = 1

/** Camera framing. */
export const CAMERA = {
  fov: 32,
  position: [0, 1.15, 6.4] as const,
  lookAt: [0, 1.05, 0] as const,
}

/** User zoom range (1 = default framing). */
export const ZOOM = { min: 1, max: 1.7 }

/** Intro reveal duration in seconds per motion mode. */
export const INTRO_DURATION = { full: 3.4, reduced: 0.9 }

/** Spray timeline in seconds (relative to the moment the button is pressed). */
export const SPRAY_TIMELINE = {
  capLiftEnd: 0.45,
  pressStart: 0.5,
  pressEnd: 0.68,
  emitStart: 0.55,
  emitDuration: 0.4,
  particleLife: 2.8,
  capReturnStart: 2.0,
  capReturnEnd: 2.6,
  total: 3.4,
}
