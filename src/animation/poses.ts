import type { SectionId } from '../state/store'

/**
 * Where the bottle sits for each page section. The bottle lives in a fixed,
 * full-viewport canvas behind the content, and glides between these poses as
 * the visitor scrolls — so text columns never sit on top of it.
 *
 * xFrac is a fraction of the visible width at the bottle's depth, which keeps
 * the composition stable across aspect ratios.
 */
export interface BottlePose {
  xFrac: number
  y: number
  scale: number
  yaw: number
}

type PoseKey = SectionId | 'explore'

const WIDE: Record<PoseKey, BottlePose> = {
  hero: { xFrac: 0.2, y: 0.22, scale: 0.8, yaw: -0.35 },
  explore: { xFrac: 0, y: 0.05, scale: 0.95, yaw: 0 },
  aroma: { xFrac: -0.27, y: 0.12, scale: 0.8, yaw: 0.55 },
  cerita: { xFrac: 0.27, y: 0.1, scale: 0.85, yaw: -0.7 },
  varian: { xFrac: -0.27, y: 0.12, scale: 0.8, yaw: 0.25 },
  produk: { xFrac: 0.26, y: 0.1, scale: 0.88, yaw: -0.3 },
  footer: { xFrac: 0, y: 0.4, scale: 0.6, yaw: 0 },
}

// Portrait: the bottle sits in the top band of the viewport, above the panels.
const NARROW: Record<PoseKey, BottlePose> = {
  hero: { xFrac: 0, y: 1.22, scale: 0.47, yaw: -0.3 },
  explore: { xFrac: 0, y: 0.3, scale: 0.72, yaw: 0 },
  aroma: { xFrac: 0, y: 1.3, scale: 0.44, yaw: 0.5 },
  cerita: { xFrac: 0, y: 1.3, scale: 0.44, yaw: -0.6 },
  varian: { xFrac: 0, y: 1.3, scale: 0.44, yaw: 0.25 },
  produk: { xFrac: 0, y: 1.3, scale: 0.44, yaw: -0.3 },
  footer: { xFrac: 0, y: 1.3, scale: 0.42, yaw: 0 },
}

export function getPose(section: SectionId, exploring: boolean, aspect: number): BottlePose {
  const table = aspect >= 1.05 ? WIDE : NARROW
  return table[exploring && section === 'hero' ? 'explore' : section]
}
