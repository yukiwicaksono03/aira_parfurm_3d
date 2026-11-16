import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ambientSpeed, useAppStore } from '../../state/store'
import { QUALITY_SETTINGS } from '../../lib/device'
import { livePalette } from '../theme'
import { getReveal } from '../reveal'

const BOUNDS = { x: 7, yMin: -1.5, yMax: 4.5, zMin: -6, zMax: 2.5 }

/**
 * Floating pollen / dust motes. Motion is computed entirely on the GPU from a
 * time uniform, so the CPU cost is constant regardless of count.
 */
export function Particles() {
  const quality = useAppStore((s) => s.quality)
  const count = QUALITY_SETTINGS[quality].particles
  const dpr = useThree((s) => s.viewport.dpr)
  const time = useRef(0)

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count * 4)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * BOUNDS.x * 2
      pos[i * 3 + 1] = BOUNDS.yMin + Math.random() * (BOUNDS.yMax - BOUNDS.yMin)
      pos[i * 3 + 2] = BOUNDS.zMin + Math.random() * (BOUNDS.zMax - BOUNDS.zMin)
      seed[i * 4] = Math.random()
      seed[i * 4 + 1] = Math.random()
      seed[i * 4 + 2] = Math.random()
      seed[i * 4 + 3] = 0.4 + Math.random() * 0.9
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
    return g
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color() },
          uOpacity: { value: 0 },
          uPixelRatio: { value: 1 },
          uYMin: { value: BOUNDS.yMin },
          uYRange: { value: BOUNDS.yMax - BOUNDS.yMin },
        },
        vertexShader: /* glsl */ `
          attribute vec4 aSeed;
          uniform float uTime;
          uniform float uPixelRatio;
          uniform float uYMin;
          uniform float uYRange;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            float t = uTime * (0.25 + aSeed.y * 0.5);
            p.y = uYMin + mod(p.y - uYMin + t * 0.18, uYRange);
            p.x += sin(t * 0.7 + aSeed.x * 6.283) * 0.35;
            p.z += cos(t * 0.5 + aSeed.z * 6.283) * 0.25;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSeed.w * 26.0 * uPixelRatio / -mv.z;
            float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed.x) + aSeed.z * 20.0);
            float edge = smoothstep(0.0, 0.12, (p.y - uYMin) / uYRange) * smoothstep(1.0, 0.85, (p.y - uYMin) / uYRange);
            vAlpha = twinkle * edge * smoothstep(-14.0, -3.0, mv.z) ;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(uColor * a, a * vAlpha * uOpacity);
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    time.current += delta * ambientSpeed(useAppStore.getState().motion)
    const u = material.uniforms
    u.uTime.value = time.current
    u.uColor.value.copy(livePalette.particle)
    u.uOpacity.value = 0.55 * getReveal()
    u.uPixelRatio.value = dpr
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
