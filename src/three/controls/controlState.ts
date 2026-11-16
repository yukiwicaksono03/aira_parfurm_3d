import { ZOOM } from '../../config/scene'
import { useAppStore } from '../../state/store'

/**
 * Mutable interaction state shared between DOM input handlers (pointer, wheel,
 * keyboard, on-screen buttons) and the render loop. Kept outside React so that
 * dragging never triggers re-renders.
 */
export const control = {
  /** Smoothed values the scene renders with. */
  yaw: 0,
  pitch: 0,
  zoom: 1,
  /** Targets written by input. */
  yawTarget: 0,
  pitchTarget: 0,
  zoomTarget: 1,
  /** Inertia carried after a drag is released (rad/s). */
  yawVelocity: 0,
  pitchVelocity: 0,
  dragging: false,
  /** performance.now() of the last user input — used to pause idle auto-rotation. */
  lastInput: 0,
}

export const PITCH_LIMIT = 0.45

const clampPitch = (v: number) => Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, v))

function touch() {
  control.lastInput = performance.now()
  useAppStore.getState().wake(1500)
}

export function rotateBy(dYaw: number, dPitch = 0) {
  control.yawTarget += dYaw
  control.pitchTarget = clampPitch(control.pitchTarget + dPitch)
  touch()
}

export function setInertia(yawVelocity: number, pitchVelocity: number) {
  control.yawVelocity = yawVelocity
  control.pitchVelocity = pitchVelocity
}

export function zoomBy(factor: number) {
  control.zoomTarget = Math.max(ZOOM.min, Math.min(ZOOM.max, control.zoomTarget * factor))
  touch()
}

export function isAtMinZoom() {
  return control.zoomTarget <= ZOOM.min + 1e-3
}

export function resetView() {
  // Return to the nearest "front" orientation instead of unwinding full turns.
  control.yawTarget = Math.round(control.yawTarget / (Math.PI * 2)) * Math.PI * 2
  control.pitchTarget = 0
  control.zoomTarget = 1
  control.yawVelocity = 0
  control.pitchVelocity = 0
  touch()
}

export { clampPitch }
