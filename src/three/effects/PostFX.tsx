import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, type DepthOfFieldEffect } from 'postprocessing'
import { useAppStore } from '../../state/store'
import { QUALITY_SETTINGS } from '../../lib/device'
import { sceneRefs } from '../reveal'

/**
 * Restrained post-processing: soft mipmap bloom for the liquid / spray
 * highlights, a shallow depth of field on capable GPUs (auto-focused on the
 * bottle), subtle grain + vignette for an editorial, filmic finish.
 */
export function PostFX() {
  const quality = useAppStore((s) => s.quality)
  const settings = QUALITY_SETTINGS[quality]

  return (
    <EffectComposer multisampling={settings.multisampling} key={quality}>
      <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.88} luminanceSmoothing={0.18} radius={0.7} />
      {settings.dof && <FocusedDOF />}
      <Vignette offset={0.28} darkness={0.55} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.32} />
      <ToneMapping mode={ToneMappingMode.AGX} />
    </EffectComposer>
  )
}

function FocusedDOF() {
  const ref = useRef<DepthOfFieldEffect>(null)
  useFrame(() => {
    ref.current?.target?.copy(sceneRefs.focus)
  })
  return <DepthOfField ref={ref} target={[0, 1.2, 0]} worldFocusRange={3.2} bokehScale={2.2} />
}
