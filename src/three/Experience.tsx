import { Component, Suspense, useEffect, useRef, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useAppStore } from '../state/store'
import { CAMERA } from '../config/scene'
import { QUALITY_SETTINGS } from '../lib/device'
import { useCanvasInput } from './controls/useCanvasInput'
import { Scene } from './Scene'

/**
 * Fixed, full-viewport WebGL layer that sits behind the page content.
 * Lazy-loaded by App so the 3D runtime never blocks first paint. Runtime
 * failures (context loss, shader errors) flip the store to the static fallback.
 */
export default function Experience() {
  const failWebGL = useAppStore((s) => s.failWebGL)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const quality = useAppStore((s) => s.quality)
  const motion = useAppStore((s) => s.motion)
  const exploring = useAppStore((s) => s.exploring)
  useCanvasInput(wrapperRef)
  useEffect(() => useAppStore.getState().setRuntimeLoaded(), [])

  return (
    <div
      ref={wrapperRef}
      className="stage-canvas"
      data-exploring={exploring || undefined}
      style={{ touchAction: exploring ? 'none' : 'pan-y' }}
      aria-hidden="true"
    >
      <CanvasErrorBoundary onError={() => failWebGL()}>
        <Canvas
          flat
          dpr={QUALITY_SETTINGS[quality].dpr}
          frameloop={motion === 'paused' ? 'demand' : 'always'}
          camera={{ fov: CAMERA.fov, position: [...CAMERA.position], near: 0.1, far: 60 }}
          gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#03101A')
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault()
              failWebGL()
            })
          }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  )
}

class CanvasErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: unknown) {
    console.error('[AiraParfum] 3D scene failed, showing static fallback.', error)
    this.props.onError()
  }
  render() {
    return this.state.hasError ? null : this.props.children
  }
}
