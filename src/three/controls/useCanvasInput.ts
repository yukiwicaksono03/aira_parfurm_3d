import { useEffect, type RefObject } from 'react'
import { useAppStore } from '../../state/store'
import { control, isAtMinZoom, rotateBy, setInertia, zoomBy } from './controlState'

const ROTATE_SPEED = 0.0065
const PITCH_SPEED = 0.0045

/**
 * Natural drag / wheel / pinch handling on the fixed canvas layer.
 *
 * Scroll-trap avoidance rules:
 *  - Mouse wheel only zooms while the hero is in view and the page is at the
 *    top (or explore mode is on). Scrolling "down" at minimum zoom always
 *    falls through to normal page scrolling.
 *  - On touch screens the canvas uses `touch-action: pan-y` so vertical swipes
 *    scroll the page and horizontal swipes spin the bottle. Explore mode
 *    switches to `touch-action: none` to unlock free rotation + pinch zoom.
 */
export function useCanvasInput(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const pointers = new Map<number, { x: number; y: number }>()
    let lastX = 0
    let lastY = 0
    let lastT = 0
    let velYaw = 0
    let velPitch = 0
    let pinchDistance = 0

    const pinchSpan = () => {
      const [a, b] = [...pointers.values()]
      return Math.hypot(a.x - b.x, a.y - b.y)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      el.setPointerCapture?.(e.pointerId)
      if (pointers.size === 1) {
        control.dragging = true
        lastX = e.clientX
        lastY = e.clientY
        lastT = performance.now()
        velYaw = velPitch = 0
        setInertia(0, 0)
      } else if (pointers.size === 2) {
        pinchDistance = pinchSpan()
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      const { exploring } = useAppStore.getState()

      if (pointers.size === 2) {
        if (!exploring) return
        const span = pinchSpan()
        if (pinchDistance > 0) zoomBy(span / pinchDistance)
        pinchDistance = span
        return
      }

      const now = performance.now()
      const dt = Math.max(1, now - lastT) / 1000
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      lastT = now

      // Touch outside explore mode only spins horizontally (vertical belongs to page scroll).
      const allowPitch = e.pointerType === 'mouse' || e.pointerType === 'pen' || exploring
      const dYaw = dx * ROTATE_SPEED
      const dPitch = allowPitch ? dy * PITCH_SPEED : 0
      rotateBy(dYaw, dPitch)
      // Low-pass the velocity so a jittery last sample doesn't fling the bottle.
      velYaw = velYaw * 0.6 + (dYaw / dt) * 0.4
      velPitch = velPitch * 0.6 + (dPitch / dt) * 0.4
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!pointers.delete(e.pointerId)) return
      el.releasePointerCapture?.(e.pointerId)
      if (pointers.size === 0) {
        control.dragging = false
        // Ignore stale velocity if the pointer rested before release.
        const idle = performance.now() - lastT > 90
        if (!idle && e.type === 'pointerup') setInertia(clampVel(velYaw), clampVel(velPitch))
      } else if (pointers.size === 1) {
        const [p] = [...pointers.values()]
        lastX = p.x
        lastY = p.y
      }
    }

    const onWheel = (e: WheelEvent) => {
      const { section, exploring } = useAppStore.getState()
      if (section !== 'hero') return
      const pageAtTop = window.scrollY < 40
      if (!exploring && !pageAtTop) return
      if (e.deltaY > 0 && isAtMinZoom()) return // let the page scroll on
      e.preventDefault()
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      zoomBy(Math.exp(-delta * 0.0016))
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointercancel', onPointerUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [ref])
}

const clampVel = (v: number) => Math.max(-6, Math.min(6, v))
