import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { CAMERA } from '../config/scene'
import { control } from './controls/controlState'
import { sceneRefs } from './reveal'

/** Dollies the camera toward the bottle as the user zooms. */
export function CameraRig() {
  const base = useMemo(() => new THREE.Vector3(...CAMERA.position), [])
  const baseLook = useMemo(() => new THREE.Vector3(...CAMERA.lookAt), [])
  const look = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    const t = 1 - 1 / control.zoom
    camera.position.lerpVectors(base, sceneRefs.focus, t * 0.9)
    // Keep the camera looking a little above the focus so the cap stays in frame.
    look.lerpVectors(baseLook, sceneRefs.focus, t)
    camera.lookAt(look)
  }, -1)

  return null
}
