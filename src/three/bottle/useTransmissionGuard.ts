import { useRef, type RefObject } from 'react'
import type * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Wraps drei's MeshTransmissionMaterial buffer pass (useFrame priority 0):
 *
 * 1. postprocessing's EffectComposer turns `renderer.autoClear` off, and the
 *    transmission material renders its refraction buffer without clearing.
 *    Stale colour/depth from earlier frames (e.g. the dark intro pose) would
 *    then stay "burned into" the glass. We switch autoClear on for that pass.
 * 2. Objects sitting on the glass surface (the label) are hidden during the
 *    pass so they aren't seen a second time, blurred, through the glass.
 *
 * The composer renders the visible frame afterwards at priority 1.
 */
export function useTransmissionGuard(hidden: RefObject<THREE.Object3D | null>[] = []) {
  const previousAutoClear = useRef(true)

  useFrame(({ gl }) => {
    previousAutoClear.current = gl.autoClear
    gl.autoClear = true
    for (const ref of hidden) if (ref.current) ref.current.visible = false
  }, -0.5)

  useFrame(({ gl }) => {
    gl.autoClear = previousAutoClear.current
    for (const ref of hidden) if (ref.current) ref.current.visible = true
  }, 0.5)
}
