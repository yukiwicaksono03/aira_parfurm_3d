import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { ambientSpeed, useActiveVariant, useAppStore } from '../../state/store'
import { getSprayPhase } from '../../animation/spray'
import { QUALITY_SETTINGS } from '../../lib/device'
import { livePalette, transition } from '../theme'
import { getReveal, sceneRefs } from '../reveal'
import { BOTTLE, createBodyGeometry, createCapGeometry, createLiquidGeometry } from './geometry'
import { createLiquidMaterial } from './LiquidMaterial'
import { createLabelTexture, drawLabel } from './labelTexture'
import { GLASS_PROPS, useMetalMaterials } from './materials'
import { useTransmissionGuard } from './useTransmissionGuard'

const BUBBLE_COUNT = 16

/**
 * Fully procedural perfume bottle: thick transmissive glass slab, gradient
 * liquid, foil label, champagne-metal collar / atomiser / cap.
 */
export function ProceduralBottle() {
  const variant = useActiveVariant()
  const quality = QUALITY_SETTINGS[useAppStore((s) => s.quality)]

  const bodyGeo = useMemo(createBodyGeometry, [])
  const liquidGeo = useMemo(createLiquidGeometry, [])
  const capGeo = useMemo(createCapGeometry, [])
  const liquidMat = useMemo(() => createLiquidMaterial(BOTTLE.liquid.height), [])
  const label = useMemo(createLabelTexture, [])
  const { metal, groove, hole } = useMetalMaterials()

  const capRef = useRef<THREE.Group>(null)
  const actuatorRef = useRef<THREE.Group>(null)
  const nozzleRef = useRef<THREE.Object3D>(null)
  const bubblesRef = useRef<THREE.InstancedMesh>(null)
  const labelRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useTransmissionGuard([labelRef])

  // Redraw the label whenever the variant changes (and once the web fonts are in).
  useEffect(() => {
    drawLabel(label.canvas, label.texture, variant)
    let cancelled = false
    // Canvas text doesn't trigger web-font loading on its own — request the faces explicitly.
    const faces = ['500 100px "Cormorant Garamond"', 'italic 400 100px "Cormorant Garamond"', '600 28px "Manrope Variable"']
    Promise.allSettled(faces.map((f) => document.fonts?.load(f))).then(() => {
      if (!cancelled) {
        drawLabel(label.canvas, label.texture, variant)
        useAppStore.getState().wake(200)
      }
    })
    return () => {
      cancelled = true
    }
  }, [label, variant])

  useEffect(() => {
    sceneRefs.nozzle = nozzleRef.current
    return () => {
      sceneRefs.nozzle = null
    }
  }, [])

  useEffect(
    () => () => {
      for (const d of [bodyGeo, liquidGeo, capGeo, liquidMat, label.texture]) d.dispose()
    },
    [bodyGeo, liquidGeo, capGeo, liquidMat, label],
  )

  const bubbleSeeds = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }, () => ({
        x: (Math.random() - 0.5) * (BOTTLE.liquid.width - 0.2),
        z: (Math.random() - 0.5) * (BOTTLE.liquid.depth - 0.08),
        speed: 0.05 + Math.random() * 0.08,
        offset: Math.random(),
        scale: 0.5 + Math.random() * 0.9,
      })),
    [],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((_, delta) => {
    const { motion, sprayAt } = useAppStore.getState()
    const speed = ambientSpeed(motion)
    time.current += delta * speed
    const reveal = getReveal()

    const u = liquidMat.uniforms
    u.uColor.value.copy(livePalette.liquid)
    u.uDeep.value.copy(livePalette.liquidDeep)
    u.uRim.value.copy(livePalette.rimLight)
    u.uTime.value = time.current
    u.uReveal.value = reveal
    u.uFlare.value = transition.pulse

    const phase = getSprayPhase(sprayAt)
    if (capRef.current) {
      const a = phase.capOff
      capRef.current.position.set(-0.42 * a, BOTTLE.cap.y + 0.5 * a, -0.12 * a)
      capRef.current.rotation.set(0, 0, 0.55 * a)
    }
    if (actuatorRef.current) actuatorRef.current.position.y = BOTTLE.actuator.y - 0.045 * phase.press

    const bubbles = bubblesRef.current
    if (bubbles) {
      const top = BOTTLE.liquid.height - 0.06
      bubbleSeeds.forEach((b, i) => {
        const t = (b.offset + time.current * b.speed) % 1
        dummy.position.set(
          b.x + Math.sin(time.current * 1.3 + i) * 0.01,
          BOTTLE.liquid.baseY + 0.04 + t * top,
          b.z,
        )
        dummy.scale.setScalar(b.scale * Math.min(1, t * 6) * (1 - Math.max(0, t - 0.92) * 12))
        dummy.updateMatrix()
        bubbles.setMatrixAt(i, dummy.matrix)
      })
      bubbles.instanceMatrix.needsUpdate = true
    }
  })

  const { neck, collar, actuator, cap, body, liquid } = BOTTLE
  const frontZ = body.depth / 2 + body.bevel

  return (
    <group>
      {/* Thick glass body */}
      <mesh geometry={bodyGeo} position-y={BOTTLE.bodyCenterY} renderOrder={2}>
        <MeshTransmissionMaterial
          key={`${quality.transmissionSamples}-${quality.backside}`}
          {...GLASS_PROPS}
          samples={quality.transmissionSamples}
          backside={quality.backside}
          backsideThickness={0.3}
          temporalDistortion={0}
        />
      </mesh>

      {/* Liquid */}
      <mesh geometry={liquidGeo} material={liquidMat} position-y={liquid.baseY} />

      <instancedMesh ref={bubblesRef} args={[undefined, undefined, BUBBLE_COUNT]} frustumCulled={false}>
        <sphereGeometry args={[0.012, 8, 6]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} depthWrite={false} />
      </instancedMesh>

      {/* Foil label on the front face */}
      <mesh ref={labelRef} position={[0, BOTTLE.label.y, frontZ + 0.002]} renderOrder={3}>
        <planeGeometry args={[BOTTLE.label.width, BOTTLE.label.height]} />
        <meshStandardMaterial
          map={label.texture}
          transparent
          depthWrite={false}
          metalness={0.75}
          roughness={0.28}
          polygonOffset
          polygonOffsetFactor={-2}
          envMapIntensity={1.4}
        />
      </mesh>

      {/* Glass neck */}
      <mesh position-y={neck.y + neck.height / 2}>
        <cylinderGeometry args={[neck.radius, neck.radius * 1.15, neck.height, 48]} />
        <meshPhysicalMaterial transmission={1} thickness={0.2} roughness={0.05} ior={1.5} color="#FFFFFF" />
      </mesh>

      {/* Collar */}
      <mesh position-y={collar.y + collar.height / 2} material={metal}>
        <cylinderGeometry args={[collar.radius, collar.radius, collar.height, 64]} />
      </mesh>

      {/* Atomiser actuator + nozzle */}
      <group ref={actuatorRef} position-y={actuator.y}>
        <mesh position-y={actuator.height / 2} material={metal}>
          <cylinderGeometry args={[actuator.radius, actuator.radius * 1.04, actuator.height, 48]} />
        </mesh>
        <mesh position={[0, actuator.height * 0.55, actuator.radius + 0.001]} material={hole}>
          <circleGeometry args={[0.02, 24]} />
        </mesh>
        <object3D ref={nozzleRef} position={[0, actuator.height * 0.55, actuator.radius + 0.01]} />
      </group>

      {/* Cap */}
      <group ref={capRef} position-y={cap.y}>
        <mesh geometry={capGeo} material={metal} />
        {[0.1, 0.9].map((f) => (
          <mesh key={f} position-y={cap.height * f} rotation-x={Math.PI / 2} material={groove}>
            <torusGeometry args={[cap.radius + 0.001, 0.0035, 8, 96]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
