import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei'
import { ambientSpeed, useAppStore } from '../../state/store'
import { BOTTLE_MODEL_SCALE } from '../../config/scene'
import { getSprayPhase } from '../../animation/spray'
import { QUALITY_SETTINGS } from '../../lib/device'
import { livePalette, transition } from '../theme'
import { getReveal, sceneRefs } from '../reveal'
import { createLiquidMaterial } from './LiquidMaterial'
import { GLASS_PROPS, useMetalMaterials } from './materials'
import { useTransmissionGuard } from './useTransmissionGuard'

/**
 * Drop-in replacement for the procedural bottle using a GLB/GLTF file.
 * Meshes are matched by name — see public/models/README.md.
 */
export function GLTFBottle({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const quality = QUALITY_SETTINGS[useAppStore((s) => s.quality)]
  const { metal } = useMetalMaterials()
  const time = useRef(0)
  useTransmissionGuard()

  const parts = useMemo(() => {
    const root = scene.clone(true)
    const glass: THREE.Mesh[] = []
    let liquid: THREE.Mesh | null = null
    let cap: THREE.Object3D | null = null
    let nozzle: THREE.Object3D | null = null

    root.traverse((obj) => {
      const name = obj.name.toLowerCase()
      if (name.includes('cap') && !cap) cap = obj
      if (name.includes('nozzle')) nozzle = obj
      if (!(obj as THREE.Mesh).isMesh) return
      const mesh = obj as THREE.Mesh
      if (name.includes('glass')) {
        glass.push(mesh)
        // Hidden here; re-rendered below with the transmission material.
        mesh.visible = false
      }
      else if (name.includes('liquid')) liquid = mesh
      else if (name.includes('cap') || name.includes('metal') || name.includes('collar')) mesh.material = metal
    })

    // Liquid shader needs the mesh's own height for its gradient.
    let liquidMat: THREE.ShaderMaterial | null = null
    if (liquid) {
      const l = liquid as THREE.Mesh
      l.geometry.computeBoundingBox()
      const box = l.geometry.boundingBox!
      l.geometry.translate(0, -box.min.y, 0)
      l.position.y += box.min.y
      liquidMat = createLiquidMaterial(box.max.y - box.min.y)
      l.material = liquidMat
    }

    // No nozzle in the file? Put a marker at the top of the model.
    if (!nozzle) {
      const box = new THREE.Box3().setFromObject(root)
      nozzle = new THREE.Object3D()
      nozzle.position.set(0, box.max.y * 0.82, (box.max.z - box.min.z) * 0.2)
      root.add(nozzle)
    }

    return { root, glass, liquidMat, cap: cap as THREE.Object3D | null, capBase: (cap as THREE.Object3D | null)?.position.clone(), nozzle }
  }, [scene, metal])

  useEffect(() => {
    sceneRefs.nozzle = parts.nozzle
    return () => {
      sceneRefs.nozzle = null
    }
  }, [parts])

  useFrame((_, delta) => {
    const { motion, sprayAt } = useAppStore.getState()
    time.current += delta * ambientSpeed(motion)
    if (parts.liquidMat) {
      const u = parts.liquidMat.uniforms
      u.uColor.value.copy(livePalette.liquid)
      u.uDeep.value.copy(livePalette.liquidDeep)
      u.uRim.value.copy(livePalette.rimLight)
      u.uTime.value = time.current
      u.uReveal.value = getReveal()
      u.uFlare.value = transition.pulse
    }
    if (parts.cap && parts.capBase) {
      const a = getSprayPhase(sprayAt).capOff
      parts.cap.position.set(parts.capBase.x - 0.42 * a, parts.capBase.y + 0.5 * a, parts.capBase.z - 0.12 * a)
      parts.cap.rotation.z = 0.55 * a
    }
  })

  return (
    <group scale={BOTTLE_MODEL_SCALE}>
      <primitive object={parts.root} />
      {parts.glass.map((mesh) => (
        <mesh
          key={mesh.uuid}
          geometry={mesh.geometry}
          position={mesh.getWorldPosition(new THREE.Vector3())}
          quaternion={mesh.getWorldQuaternion(new THREE.Quaternion())}
          scale={mesh.getWorldScale(new THREE.Vector3())}
        >
          <MeshTransmissionMaterial
            {...GLASS_PROPS}
            samples={quality.transmissionSamples}
              backside={quality.backside}
          />
        </mesh>
      ))}
    </group>
  )
}
