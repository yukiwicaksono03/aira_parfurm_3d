import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ambientSpeed, useAppStore } from '../../state/store'
import { livePalette } from '../theme'
import { getReveal } from '../reveal'

const CARDS = [
  { x: -1.9, y: 0.15, z: -1.4, s: 3.6, o: 0.22, drift: 0.12 },
  { x: 1.7, y: 0.05, z: -1.0, s: 3.2, o: 0.18, drift: -0.1 },
  { x: 0.2, y: -0.15, z: 0.9, s: 3.0, o: 0.1, drift: 0.08 },
  { x: -0.6, y: 0.5, z: -2.6, s: 4.6, o: 0.16, drift: -0.06 },
  { x: 2.6, y: 0.9, z: -3.2, s: 4.2, o: 0.12, drift: 0.05 },
]

/** Procedural soft "cloud" texture — a few overlapping radial puffs. */
function createMistTexture() {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  for (let i = 0; i < 14; i++) {
    const x = size * (0.25 + Math.random() * 0.5)
    const y = size * (0.35 + Math.random() * 0.3)
    const r = size * (0.15 + Math.random() * 0.25)
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(255,255,255,0.22)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Low-lying haze around the plinth. Moves with the product rig. */
export function Mist() {
  const texture = useMemo(createMistTexture, [])
  const materials = useMemo(
    () =>
      CARDS.map(
        () =>
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
            opacity: 0,
            fog: false,
          }),
      ),
    [texture],
  )
  const refs = useRef<(THREE.Mesh | null)[]>([])
  const time = useRef(0)

  useEffect(
    () => () => {
      texture.dispose()
      materials.forEach((m) => m.dispose())
    },
    [texture, materials],
  )

  useFrame((_, delta) => {
    time.current += delta * ambientSpeed(useAppStore.getState().motion)
    const reveal = getReveal()
    CARDS.forEach((card, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      mesh.position.x = card.x + Math.sin(time.current * card.drift * 2 + i) * 0.4
      mesh.rotation.z = time.current * card.drift * 0.5
      materials[i].color.copy(livePalette.mist)
      materials[i].opacity = card.o * reveal
    })
  })

  return (
    <group>
      {CARDS.map((card, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
          position={[card.x, card.y, card.z]}
          scale={[card.s * 1.6, card.s * 0.7, 1]}
          material={materials[i]}
          renderOrder={1}
        >
          <planeGeometry args={[1, 1]} />
        </mesh>
      ))}
    </group>
  )
}
