import * as THREE from 'three'
import { INTRO_DURATION } from '../config/scene'
import { clamp01, easeInOutCubic } from '../animation/easing'
import { useAppStore } from '../state/store'

/**
 * Intro reveal 0 → 1: the bottle rises out of darkness as lights, backdrop
 * and atmosphere fade up. Paused motion skips straight to the end state.
 */
export function getReveal(now = performance.now()): number {
  const { introStartedAt, motion } = useAppStore.getState()
  if (introStartedAt === null) return 0
  if (motion === 'paused') return 1
  const duration = motion === 'full' ? INTRO_DURATION.full : INTRO_DURATION.reduced
  return easeInOutCubic(clamp01((now - introStartedAt) / 1000 / duration))
}

/** References to scene objects that other systems need to read (spray origin, DOF focus). */
export const sceneRefs = {
  nozzle: null as THREE.Object3D | null,
  focus: new THREE.Vector3(0, 1.2, 0),
  /** Current world-space x of the product rig (used to aim the spray toward open space). */
  rigX: 0,
  /** Current total yaw of the bottle (pose + user). */
  poseYaw: 0,
}
