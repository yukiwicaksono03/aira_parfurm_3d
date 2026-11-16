import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAppStore } from '../../state/store'
import { SPRAY_TIMELINE } from '../../config/scene'
import { QUALITY_SETTINGS } from '../../lib/device'
import { getSprayPhase } from '../../animation/spray'
import { livePalette } from '../theme'
import { sceneRefs } from '../reveal'

const LOCAL_FORWARD = new THREE.Vector3(0, 0.14, 1).normalize()

/**
 * Atomiser burst. Each particle's path is an analytic function of age
 * (drag-damped launch + buoyancy + curl-ish wobble), evaluated in the vertex
 * shader — the CPU only sets the origin, direction and clock.
 *
 * Origin and direction are captured in world space at the moment of emission,
 * so the cloud hangs in the air even if the bottle is rotated afterwards.
 */
export function SprayMist() {
  const quality = useAppStore((s) => s.quality)
  const motion = useAppStore((s) => s.motion)
  const baseCount = QUALITY_SETTINGS[quality].sprayParticles
  const count = motion === 'full' ? baseCount : Math.round(baseCount * 0.5)
  const dpr = useThree((s) => s.viewport.dpr)
  const captured = useRef<number | null>(null)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const rand = new Float32Array(count * 4)
    const extra = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      rand[i * 4] = Math.random()
      rand[i * 4 + 1] = Math.random()
      rand[i * 4 + 2] = Math.random()
      rand[i * 4 + 3] = Math.random()
      // speed, size — a minority of fast fine droplets, the rest soft mist.
      const droplet = Math.random() < 0.22
      extra[i * 2] = droplet ? 0.75 + Math.random() * 0.25 : Math.random() * 0.7
      extra[i * 2 + 1] = droplet ? 0.25 + Math.random() * 0.3 : 0.7 + Math.random() * 0.9
    }
    // Positions are computed in the shader; this attribute only sets the draw count.
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 4))
    g.setAttribute('aExtra', new THREE.BufferAttribute(extra, 2))
    return g
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: -1 },
          uOrigin: { value: new THREE.Vector3() },
          uDir: { value: new THREE.Vector3(1, 0, 0) },
          uColor: { value: new THREE.Color() },
          uLife: { value: SPRAY_TIMELINE.particleLife },
          uEmit: { value: SPRAY_TIMELINE.emitDuration },
          uStrength: { value: 1 },
          uPixelRatio: { value: 1 },
        },
        vertexShader: /* glsl */ `
          attribute vec4 aRand;
          attribute vec2 aExtra;
          uniform float uTime;
          uniform vec3 uOrigin;
          uniform vec3 uDir;
          uniform float uLife;
          uniform float uEmit;
          uniform float uStrength;
          uniform float uPixelRatio;
          varying float vAlpha;
          varying float vDroplet;

          void main() {
            float age = uTime - aRand.w * uEmit;
            float life = uLife * (0.65 + aRand.z * 0.35);
            if (age <= 0.0 || age >= life) {
              gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
              gl_PointSize = 0.0;
              vAlpha = 0.0;
              return;
            }

            // Cone around the nozzle direction.
            vec3 jitter = (aRand.xyz - 0.5) * vec3(0.55, 0.4, 0.55);
            vec3 dir = normalize(uDir + jitter);
            float speed = mix(1.1, 4.2, aExtra.x) * uStrength;
            float drag = mix(2.2, 1.3, aExtra.x);
            vec3 p = uOrigin + dir * speed * (1.0 - exp(-drag * age)) / drag;

            // Gentle buoyancy and swirl as the mist loses momentum.
            p.y += 0.07 * age * age;
            float w = age * 0.9;
            p += vec3(
              sin(w * 1.7 + aRand.x * 31.0),
              sin(w * 1.3 + aRand.y * 23.0) * 0.6,
              cos(w * 1.1 + aRand.z * 17.0)
            ) * 0.07 * age;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;

            float k = age / life;
            float size = mix(0.5, 3.2, sqrt(k)) * aExtra.y;
            gl_PointSize = size * 34.0 * uPixelRatio / -mv.z;

            vDroplet = step(0.74, aExtra.x);
            vAlpha = smoothstep(0.0, 0.06, age) * (1.0 - smoothstep(0.3, 1.0, k)) * mix(0.32, 0.9, vDroplet);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          varying float vAlpha;
          varying float vDroplet;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float soft = smoothstep(0.5, 0.0, d);
            float a = mix(soft * soft, smoothstep(0.5, 0.15, d), vDroplet) * vAlpha;
            vec3 col = mix(uColor, vec3(1.0), 0.35 + vDroplet * 0.5);
            gl_FragColor = vec4(col * a, a);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame(() => {
    const { sprayAt } = useAppStore.getState()
    const phase = getSprayPhase(sprayAt)
    const u = material.uniforms

    // Capture origin/direction from the nozzle exactly when emission begins.
    if (sprayAt !== null && phase.emitTime >= 0 && captured.current !== sprayAt && sceneRefs.nozzle) {
      captured.current = sprayAt
      sceneRefs.nozzle.updateWorldMatrix(true, false)
      sceneRefs.nozzle.getWorldPosition(u.uOrigin.value)
      const q = sceneRefs.nozzle.getWorldQuaternion(new THREE.Quaternion())
      u.uDir.value.copy(LOCAL_FORWARD).applyQuaternion(q).normalize()
    }

    u.uTime.value = captured.current === sprayAt ? phase.emitTime : -1
    u.uColor.value.copy(livePalette.mist)
    u.uStrength.value = useAppStore.getState().motion === 'full' ? 1 : 0.6
    u.uPixelRatio.value = dpr
  })

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={5} />
}
