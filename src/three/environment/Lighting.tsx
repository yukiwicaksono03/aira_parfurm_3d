import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { livePalette, transition } from '../theme'
import { getReveal } from '../reveal'

/**
 * Note on intensities: very glossy glass + punctual lights can produce
 * specular peaks above the half-float range of the composer buffers (Inf →
 * black pixels after bloom). Rim/key values are kept moderate for that reason;
 * the light-formers carry most of the reflections.
 *
 * Dramatic product lighting: one soft key from the upper left, two coloured
 * rim lights behind the bottle (tinted per variant), a low fill to make the
 * liquid glow, plus a studio light-former environment for reflections — all
 * generated in-scene, no HDR download.
 */
export function Lighting() {
  const scene = useThree((s) => s.scene)
  const key = useRef<THREE.SpotLight>(null)
  const rimL = useRef<THREE.PointLight>(null)
  const rimR = useRef<THREE.PointLight>(null)
  const fill = useRef<THREE.PointLight>(null)
  const ambient = useRef<THREE.AmbientLight>(null)

  useFrame(() => {
    const r = getReveal()
    const flare = 1 + transition.pulse * 0.6
    if (key.current) {
      key.current.color.copy(livePalette.keyLight)
      key.current.intensity = 48 * r
    }
    if (rimL.current) {
      rimL.current.color.copy(livePalette.rimLight)
      rimL.current.intensity = 7 * r * flare
    }
    if (rimR.current) {
      rimR.current.color.copy(livePalette.rimLight)
      rimR.current.intensity = 5 * r * flare
    }
    if (fill.current) {
      fill.current.color.copy(livePalette.glow)
      fill.current.intensity = 3 * r
    }
    if (ambient.current) {
      ambient.current.color.copy(livePalette.fog)
      ambient.current.intensity = 0.6 * r
    }
    scene.environmentIntensity = 0.95 * r
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(livePalette.fog)
  })

  return (
    <>
      <fog attach="fog" args={['#061520', 9, 22]} />
      <ambientLight ref={ambient} intensity={0} />
      <spotLight
        ref={key}
        position={[-3.5, 6.5, 4.5]}
        angle={0.42}
        penumbra={1}
        decay={2}
        intensity={0}
      />
      <pointLight ref={rimL} position={[-2.8, 2.6, -2.8]} decay={2} intensity={0} />
      <pointLight ref={rimR} position={[3, 1.6, -2.9]} decay={2} intensity={0} />
      <pointLight ref={fill} position={[0, 0.4, 2.2]} decay={2} intensity={0} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#FFF6EA" position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={3.4} color="#FFFFFF" position={[-4, 1.5, 1]} rotation-y={Math.PI / 2} scale={[1.2, 6, 1]} />
        <Lightformer form="rect" intensity={2.4} color="#DCEBF2" position={[4, 1.5, 0]} rotation-y={-Math.PI / 2} scale={[1, 6, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#F2E2C8" position={[0, 2, -6]} scale={3} />
        <Lightformer form="rect" intensity={0.6} color="#B5D37F" position={[0, -2, 3]} rotation-x={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
    </>
  )
}
