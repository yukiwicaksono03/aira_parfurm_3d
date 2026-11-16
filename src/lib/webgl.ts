let cached: boolean | null = null

/** True when the browser can create a WebGL2 (preferred) or WebGL1 context. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
    cached = !!gl
    // Release the probe context immediately so it doesn't count against the browser limit.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}
