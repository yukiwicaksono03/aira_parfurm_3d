import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Procedural bottle geometry. Dimensions are in scene units with the base of
 * the glass at y = 0. Swap for a GLB via src/config/scene.ts when a real
 * model is available.
 */
export const BOTTLE = {
  body: { width: 1.12, height: 1.46, radius: 0.2, depth: 0.46, bevel: 0.13, bevelSize: 0.12 },
  /** Body vertical centre (bottom of glass at 0). */
  bodyCenterY: 0.85,
  liquid: { width: 0.96, height: 1.0, radius: 0.14, depth: 0.3, bevel: 0.04, baseY: 0.24 },
  neck: { radius: 0.17, height: 0.1, y: 1.7 },
  collar: { radius: 0.215, height: 0.11, y: 1.76 },
  actuator: { radius: 0.12, height: 0.12, y: 1.87 },
  cap: { radius: 0.34, height: 0.62, y: 1.8 },
  label: { width: 0.66, height: 0.42, y: 0.84 },
}

function roundedRect(width: number, height: number, radius: number, originBottom = false) {
  const x = -width / 2
  const y = originBottom ? 0 : -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  const s = new THREE.Shape()
  s.moveTo(x + r, y)
  s.lineTo(x + width - r, y)
  s.quadraticCurveTo(x + width, y, x + width, y + r)
  s.lineTo(x + width, y + height - r)
  s.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  s.lineTo(x + r, y + height)
  s.quadraticCurveTo(x, y + height, x, y + height - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/** Extrude a rounded slab and give it smooth normals (glass looks faceted otherwise). */
function smoothSlab(shape: THREE.Shape, depth: number, bevel: number, bevelSize: number, segments: number) {
  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize,
    bevelSegments: segments,
    curveSegments: 20,
  })
  geo.translate(0, 0, -depth / 2)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  geo = mergeVertices(geo, 1e-4)
  geo.computeVertexNormals()
  return geo
}

export function createBodyGeometry() {
  const b = BOTTLE.body
  return smoothSlab(roundedRect(b.width, b.height, b.radius), b.depth, b.bevel, b.bevelSize, 10)
}

export function createLiquidGeometry() {
  const l = BOTTLE.liquid
  return smoothSlab(roundedRect(l.width, l.height, l.radius, true), l.depth, l.bevel, l.bevel, 4)
}

/** Lathe profile for the cap: soft chamfered cylinder with a slight waist. */
export function createCapGeometry() {
  const { radius: r, height: h } = BOTTLE.cap
  const pts = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(r * 0.96, 0),
    new THREE.Vector2(r, 0.02),
    new THREE.Vector2(r, h * 0.12),
    new THREE.Vector2(r * 0.985, h * 0.5),
    new THREE.Vector2(r, h * 0.88),
    new THREE.Vector2(r * 0.99, h - 0.035),
    new THREE.Vector2(r * 0.93, h - 0.004),
    new THREE.Vector2(r * 0.86, h),
    new THREE.Vector2(0, h),
  ]
  return new THREE.LatheGeometry(pts, 96)
}

/** Travertine-style plinth under the bottle. */
export function createPedestalGeometry() {
  const r = 1.18
  const h = 0.16
  const pts = [
    new THREE.Vector2(0, -h),
    new THREE.Vector2(r - 0.02, -h),
    new THREE.Vector2(r, -h + 0.02),
    new THREE.Vector2(r, -0.03),
    new THREE.Vector2(r - 0.03, 0),
    new THREE.Vector2(0, 0),
  ]
  return new THREE.LatheGeometry(pts, 128)
}

/** Slightly cupped petal, origin at its base. */
export function createPetalGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.06, 0.03, 0.085, 0.13, 0, 0.2)
  s.bezierCurveTo(-0.085, 0.13, -0.06, 0.03, 0, 0)
  const geo = new THREE.ShapeGeometry(s, 10)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    pos.setZ(i, x * x * 6 - y * y * 0.6)
  }
  geo.translate(0, -0.1, 0)
  geo.computeVertexNormals()
  return geo
}
