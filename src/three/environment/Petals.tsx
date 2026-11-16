import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ambientSpeed, useAppStore } from '../../state/store'
import { QUALITY_SETTINGS } from '../../lib/device'
import { createPetalGeometry } from '../bottle/geometry'
import { livePalette } from '../theme'
import { getReveal } from '../reveal'

const TOP = 4.6
const BOTTOM = -1.6

/**
 * A handful of petals drifting down and tumbling, kept mostly behind and to
 * the sides of the bottle so they frame it rather than cover it.
 */
export function Petals() {
  const quality = useAppStore((s) => s.quality)
  const count = QUALITY_SETTINGS[quality].petals
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const time = useRef(0)
  const geometry = useMemo(createPetalGeometry, [])
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        roughness: 0.55,
        metalness: 0,
        transparent: true,
        opacity: 0,
      }),
    [],
  )
  useEffect(
    () => () => {
      geometry.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  const petals = useMemo(
    () =>
      Array.from({ length: count }, () => {
        // Bias x away from the centre column where the bottle usually stands.
        const side = Math.random() < 0.5 ? -1 : 1
        return {
          x: side * (1.2 + Math.random() * 4.5),
          z: -4.5 + Math.random() * 5,
          y: BOTTOM + Math.random() * (TOP - BOTTOM),
          fall: 0.12 + Math.random() * 0.16,
          sway: 0.3 + Math.random() * 0.5,
          spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.6),
          phase: Math.random() * Math.PI * 2,
          scale: 0.7 + Math.random() * 0.8,
        }
      }),
    [count],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    time.current += delta * ambientSpeed(useAppStore.getState().motion)
    const t = time.current
    material.color.copy(livePalette.petal)
    material.emissive.copy(livePalette.petal).multiplyScalar(0.12)
    material.opacity = 0.85 * getReveal()

    const range = TOP - BOTTOM
    petals.forEach((p, i) => {
      const y = TOP - ((TOP - p.y + t * p.fall) % range)
      dummy.position.set(p.x + Math.sin(t * p.sway + p.phase) * 0.45, y, p.z + Math.cos(t * p.sway * 0.7 + p.phase) * 0.3)
      dummy.rotation.set(p.phase + t * p.spin.x, t * p.spin.y, p.phase * 0.5 + t * p.spin.z)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  if (count === 0) return null
  return <instancedMesh key={count} ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
}
