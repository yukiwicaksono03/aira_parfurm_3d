import { useEffect } from 'react'
import { useActiveVariant } from '../state/store'

/**
 * Pushes the active variant's palette into CSS custom properties so the DOM
 * (accents, swatches, gradients) cross-fades in step with the 3D scene.
 * The properties are registered with @property in tokens.css, which lets them
 * transition smoothly.
 */
export function useThemeVariables() {
  const variant = useActiveVariant()

  useEffect(() => {
    const root = document.documentElement.style
    const p = variant.palette
    root.setProperty('--accent', p.accent)
    root.setProperty('--liquid', p.liquid)
    root.setProperty('--liquid-deep', p.liquidDeep)
    root.setProperty('--scene-top', p.bgTop)
    root.setProperty('--scene-bottom', p.bgBottom)
    root.setProperty('--glow', p.glow)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', p.bgBottom)
  }, [variant])
}
