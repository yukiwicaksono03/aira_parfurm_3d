import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { ambientSpeed, useAppStore } from '../../state/store'
import { livePalette } from '../theme'
import { getReveal, sceneRefs } from '../reveal'

const DEPTH = -10
const projected = new THREE.Vector3()

/**
 * In-scene backdrop (rather than a CSS gradient) so the glass actually
 * refracts it: vertical gradient, a halo that follows the bottle, slow light
 * shafts, vignette and dithering against banding.
 */
export function Backdrop() {
  const meshRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)
  const { camera, viewport, size } = useThree()

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uBottom: { value: new THREE.Color() },
          uGlow: { value: new THREE.Color() },
          uKey: { value: new THREE.Color() },
          uGlowPos: { value: new THREE.Vector2(0.6, 0.5) },
          uAspect: { value: 1 },
          uTime: { value: 0 },
          uReveal: { value: 0 },
        },
        // Screen UV comes from the projected vertex, not gl_FragCoord, so the
        // backdrop looks identical inside the glass's smaller refraction buffer.
        vertexShader: /* glsl */ `
          varying vec2 vScreen;
          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            vScreen = gl_Position.xy / gl_Position.w * 0.5 + 0.5;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop;
          uniform vec3 uBottom;
          uniform vec3 uGlow;
          uniform vec3 uKey;
          uniform vec2 uGlowPos;
          uniform float uAspect;
          uniform float uTime;
          uniform float uReveal;

          varying vec2 vScreen;

          void main() {
            vec2 uv = vScreen;
            float aspect = uAspect;
            vec3 col = mix(uBottom, uTop, smoothstep(0.0, 1.0, uv.y));

            vec2 d = (uv - uGlowPos) * vec2(aspect, 1.0);
            col += uGlow * exp(-dot(d, d) * 2.6) * 0.45;

            // Soft diagonal light shafts drifting from the upper left.
            float s = sin((uv.x * 1.1 + uv.y * 0.7) * 8.0 + uTime * 0.12) * 0.5 + 0.5;
            s = pow(s, 7.0) * smoothstep(0.15, 1.0, uv.y) * smoothstep(1.2, 0.0, uv.x);
            col += uKey * s * 0.045;

            float v = length((uv - 0.5) * vec2(aspect * 0.8, 1.0));
            col *= mix(0.5, 1.0, smoothstep(1.1, 0.2, v));
            col *= uReveal;

            // Dither to break up gradient banding.
            col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const vp = viewport.getCurrentViewport(camera, new THREE.Vector3(0, camera.position.y, DEPTH))
    mesh.position.set(camera.position.x, camera.position.y, DEPTH)
    mesh.scale.set(vp.width * 1.4, vp.height * 1.4, 1)

    const u = material.uniforms
    time.current += delta * ambientSpeed(useAppStore.getState().motion)
    u.uTop.value.copy(livePalette.bgTop)
    u.uBottom.value.copy(livePalette.bgBottom)
    u.uGlow.value.copy(livePalette.glow)
    u.uKey.value.copy(livePalette.keyLight)
    u.uTime.value = time.current
    u.uReveal.value = 0.15 + 0.85 * getReveal()
    u.uAspect.value = size.width / size.height

    projected.copy(sceneRefs.focus).project(camera)
    const gx = projected.x * 0.5 + 0.5
    const gy = projected.y * 0.5 + 0.5
    u.uGlowPos.value.x += (gx - u.uGlowPos.value.x) * 0.08
    u.uGlowPos.value.y += (gy - u.uGlowPos.value.y) * 0.08
  })

  return (
    <mesh ref={meshRef} material={material} renderOrder={-10} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}
