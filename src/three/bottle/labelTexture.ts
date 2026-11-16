import * as THREE from 'three'
import type { ScentVariant } from '../../data/products'

const W = 1024
const H = 652
const INK = '#EFE1C8'

/**
 * Foil-style front label drawn on a canvas, so it updates per variant without
 * external image assets. Replace with an image texture if a designed label
 * exists.
 */
export function createLabelTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { canvas, texture }
}

export function drawLabel(canvas: HTMLCanvasElement, texture: THREE.CanvasTexture, variant: ScentVariant) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  ctx.strokeStyle = INK
  ctx.fillStyle = INK
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Translucent smoked backing keeps the foil legible over light liquids (e.g. Senja).
  ctx.fillStyle = 'rgba(10, 16, 20, 0.34)'
  ctx.fillRect(14, 14, W - 28, H - 28)
  ctx.fillStyle = INK

  // Double hairline frame.
  ctx.lineWidth = 4
  ctx.strokeRect(14, 14, W - 28, H - 28)
  ctx.lineWidth = 1.5
  ctx.strokeRect(34, 34, W - 68, H - 68)

  const serif = '"Cormorant Garamond", "Times New Roman", serif'
  const sans = '"Manrope Variable", "Helvetica Neue", Arial, sans-serif'

  ctx.font = `500 210px ${serif}`
  drawSpaced(ctx, 'AIRA', W / 2, H * 0.4, 38)

  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(W / 2 - 120, H * 0.6)
  ctx.lineTo(W / 2 + 120, H * 0.6)
  ctx.stroke()

  const sub = variant.name.replace(/^Aira\s+/i, '').toUpperCase()
  ctx.font = `italic 400 70px ${serif}`
  ctx.fillText(sub.charAt(0) + sub.slice(1).toLowerCase(), W / 2, H * 0.71)

  ctx.font = `600 28px ${sans}`
  drawSpaced(ctx, 'EAU DE PARFUM · 50 ML', W / 2, H * 0.85, 7)

  texture.needsUpdate = true
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number, spacing: number) {
  const chars = [...text]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)
  let x = cx - total / 2
  ctx.textAlign = 'left'
  chars.forEach((c, i) => {
    ctx.fillText(c, x, cy)
    x += widths[i] + spacing
  })
  ctx.textAlign = 'center'
}
