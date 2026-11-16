import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useAppStore } from '../state/store'
import { ThemeDriver } from './theme'
import { CameraRig } from './CameraRig'
import { FrameDriver } from './FrameDriver'
import { ProductRig } from './ProductRig'
import { Backdrop } from './environment/Backdrop'
import { Lighting } from './environment/Lighting'
import { Particles } from './environment/Particles'
import { Petals } from './environment/Petals'
import { SprayMist } from './effects/SprayMist'
import { PostFX } from './effects/PostFX'

const DOWNGRADE = { high: 'medium', medium: 'low', low: 'low' } as const

export function Scene() {
  const setQuality = useAppStore((s) => s.setQuality)

  return (
    <>
      <ThemeDriver />
      <FrameDriver />
      <CameraRig />
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => setQuality(DOWNGRADE[useAppStore.getState().quality])}
      />
      <Backdrop />
      <Lighting />
      <Particles />
      <Petals />
      <ProductRig />
      <SprayMist />
      <PostFX />
      <ReadySignal />
      {import.meta.env.DEV && <DevHandle />}
    </>
  )
}

/**
 * Flags the scene as ready once shaders are compiled and a couple of frames
 * have been presented, so the loader never fades onto a half-built frame.
 */
function ReadySignal() {
  const { gl, scene, camera } = useThree()
  const setSceneReady = useAppStore((s) => s.setSceneReady)

  useEffect(() => {
    let cancelled = false
    const finish = () => {
      let frames = 0
      const wait = () => {
        if (cancelled) return
        if (++frames < 3) requestAnimationFrame(wait)
        else setSceneReady()
      }
      requestAnimationFrame(wait)
    }
    // compileAsync uses KHR_parallel_shader_compile where available.
    gl.compileAsync(scene, camera).then(finish, finish)
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, setSceneReady])

  return null
}

/** Dev-only: exposes the R3F state as window.__aira for debugging in the console. */
function DevHandle() {
  const get = useThree((s) => s.get)
  useEffect(() => {
    ;(window as unknown as { __aira?: unknown }).__aira = get
  }, [get])
  return null
}
