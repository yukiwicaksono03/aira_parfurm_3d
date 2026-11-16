import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '../state/store'
import { getPose } from '../animation/poses'
import { dampFactor } from '../animation/easing'
import { BOTTLE_MODEL_URL, CAMERA } from '../config/scene'
import { control } from './controls/controlState'
import { getReveal, sceneRefs } from './reveal'
import { transition } from './theme'
import { ProceduralBottle } from './bottle/ProceduralBottle'
import { GLTFBottle } from './bottle/GLTFBottle'
import { BOTTLE, createPedestalGeometry } from './bottle/geometry'
import { Mist } from './environment/Mist'

const IDLE_ROTATE_DELAY = 4000
const IDLE_ROTATE_SPEED = 0.12
const BOTTLE_CENTER_Y = 1.2

const BOTTLE_FOOTPRINT = BOTTLE.body

const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

/**
 * Hierarchy:
 *   position group (section pose, scale, intro rise)
 *     └ tilt group (pitch + pointer parallax)
 *         └ yaw group (pose yaw + user yaw + transition half-turn) → bottle, pedestal
 */
export function ProductRig() {
  const positionRef = useRef<THREE.Group>(null)
  const tiltRef = useRef<THREE.Group>(null)
  const yawRef = useRef<THREE.Group>(null)
  const pose = useRef({ x: 0, y: 0, scale: 1, yaw: 0 })
  const pointer = useRef(new THREE.Vector2())
  const lastSprayAt = useRef<number | null>(null)
  const { viewport, camera } = useThree()

  const pedestalGeo = useMemo(createPedestalGeometry, [])
  useEffect(() => () => pedestalGeo.dispose(), [pedestalGeo])

  useFrame((state, delta) => {
    const { section, exploring, motion, sprayAt } = useAppStore.getState()
    const now = performance.now()
    const reveal = getReveal(now)
    const instant = motion === 'paused' && delta > 0.25

    // ── Section pose ────────────────────────────────────────────────
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, CAMERA.lookAt[1], 0))
    const target = getPose(section, exploring, vp.aspect)
    const kPose = instant ? 1 : dampFactor(motion === 'full' ? 2.2 : 4, delta)
    const p = pose.current
    p.x += (target.xFrac * vp.width - p.x) * kPose
    p.y += (target.y - p.y) * kPose
    p.scale += (target.scale - p.scale) * kPose
    p.yaw += (target.yaw - p.yaw) * kPose

    // ── Spray: turn the atomiser toward open space before it fires ──
    if (sprayAt !== lastSprayAt.current) {
      lastSprayAt.current = sprayAt
      if (sprayAt !== null) {
        const side = p.x > 0.05 ? -1 : 1
        const desired = Math.atan2(side * 0.85, 0.55)
        const current = target.yaw + control.yawTarget
        control.yawTarget += wrapPi(desired - current)
        control.pitchTarget = 0
        control.yawVelocity = control.pitchVelocity = 0
        control.lastInput = now
      }
    }

    // ── User rotation: inertia, idle auto-rotate, smoothing ─────────
    if (!control.dragging) {
      const decay = Math.exp(-3.2 * delta)
      control.yawTarget += control.yawVelocity * delta
      control.pitchTarget = THREE.MathUtils.clamp(control.pitchTarget + control.pitchVelocity * delta, -0.45, 0.45)
      control.yawVelocity *= decay
      control.pitchVelocity *= decay
      if (motion === 'full' && now - control.lastInput > IDLE_ROTATE_DELAY) {
        control.yawTarget += IDLE_ROTATE_SPEED * delta
        // Ease pitch back to level while idling.
        control.pitchTarget *= 1 - dampFactor(0.6, delta)
      }
    }
    if (section !== 'hero' && control.zoomTarget !== 1) control.zoomTarget = 1
    const kCtl = instant ? 1 : dampFactor(8, delta)
    control.yaw += (control.yawTarget - control.yaw) * kCtl
    control.pitch += (control.pitchTarget - control.pitch) * kCtl
    control.zoom += (control.zoomTarget - control.zoom) * (instant ? 1 : dampFactor(6, delta))

    // ── Pointer parallax (subtle) ───────────────────────────────────
    const parallax = motion === 'paused' ? 0 : motion === 'reduced' ? 0.3 : 1
    pointer.current.lerp(state.pointer, instant ? 1 : dampFactor(2.5, delta))

    // ── Apply ───────────────────────────────────────────────────────
    const rise = (1 - reveal) * -0.55
    positionRef.current?.position.set(p.x, p.y + rise, 0)
    positionRef.current?.scale.setScalar(p.scale * (0.92 + 0.08 * reveal))

    if (tiltRef.current) {
      tiltRef.current.position.y = BOTTLE_CENTER_Y
      tiltRef.current.rotation.x = control.pitch - pointer.current.y * 0.08 * parallax
      tiltRef.current.rotation.z = -pointer.current.x * 0.035 * parallax
    }
    if (yawRef.current) {
      yawRef.current.position.y = -BOTTLE_CENTER_Y
      const introSpin = (1 - reveal) * -1.6
      const swap = motion === 'full' ? transition.pulse * 0.35 : 0
      const total = p.yaw + control.yaw + introSpin + swap + pointer.current.x * 0.12 * parallax
      yawRef.current.rotation.y = total
      sceneRefs.poseYaw = total
    }

    sceneRefs.rigX = p.x
    sceneRefs.focus.set(p.x, p.y + rise + BOTTLE_CENTER_Y * p.scale, 0)
  })

  return (
    <group ref={positionRef}>
      <group ref={tiltRef}>
        <group ref={yawRef}>
          <Suspense fallback={null}>
            {BOTTLE_MODEL_URL ? <GLTFBottle url={BOTTLE_MODEL_URL} /> : <ProceduralBottle />}
          </Suspense>
          <mesh geometry={pedestalGeo} receiveShadow>
            <meshStandardMaterial color="#C9B395" roughness={0.88} metalness={0} envMapIntensity={0.6} />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} position-y={0.0015}>
            <ringGeometry args={[1.02, 1.032, 128]} />
            <meshStandardMaterial color="#B48D62" metalness={1} roughness={0.3} />
          </mesh>
          <BakedShadow />
        </group>
      </group>
      <Mist />
    </group>
  )
}

/**
 * Baked contact shadow. The bottle only ever rotates together with its plinth,
 * so the shadow footprint is constant: a blurred rounded-rect core (the glass
 * base) inside a wider ambient-occlusion halo. Cheaper and steadier than a
 * real-time depth pass, on every quality tier.
 */
function BakedShadow() {
  const texture = useMemo(() => {
    const size = 512
    const c = document.createElement('canvas')
    c.width = c.height = size
    const ctx = c.getContext('2d')!
    const toPx = size / 2 // canvas spans 2 × 2 scene units
    const { width, depth, bevelSize, bevel } = BOTTLE_FOOTPRINT
    const w = (width + bevelSize * 2) * toPx
    const d = (depth + bevel * 2) * toPx

    const halo = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.42)
    halo.addColorStop(0, 'rgba(18,12,8,0.45)')
    halo.addColorStop(1, 'rgba(18,12,8,0)')
    ctx.fillStyle = halo
    ctx.fillRect(0, 0, size, size)

    ctx.filter = 'blur(14px)'
    ctx.fillStyle = 'rgba(12,8,5,0.75)'
    ctx.beginPath()
    ctx.roundRect((size - w) / 2, (size - d) / 2, w, d, 0.2 * toPx)
    ctx.fill()
    ctx.filter = 'none'

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.003} renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}
