import * as THREE from 'three'
import { useMemo } from 'react'

/** Champagne / light-brown metal used for collar, actuator and cap. */
export function useMetalMaterials() {
  return useMemo(
    () => ({
      metal: new THREE.MeshPhysicalMaterial({
        color: '#D6B78F',
        metalness: 1,
        roughness: 0.24,
        clearcoat: 0.35,
        clearcoatRoughness: 0.22,
        envMapIntensity: 1.25,
      }),
      groove: new THREE.MeshStandardMaterial({ color: '#5B4430', metalness: 1, roughness: 0.45 }),
      hole: new THREE.MeshBasicMaterial({ color: '#0B0907' }),
    }),
    [],
  )
}

/** Shared transmission settings for the thick glass body, tuned per quality tier. */
export const GLASS_PROPS = {
  thickness: 0.55,
  roughness: 0.05,
  ior: 1.5,
  chromaticAberration: 0.03,
  anisotropicBlur: 0.05,
  distortion: 0.04,
  distortionScale: 0.35,
  clearcoat: 1,
  clearcoatRoughness: 0.09,
  envMapIntensity: 1.3,
  attenuationDistance: 2.5,
  color: '#FFFFFF',
  attenuationColor: '#F4FAFF',
} as const
