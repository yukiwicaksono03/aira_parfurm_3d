import type { CSSProperties } from 'react'

/** Typed helper for inline CSS custom properties, e.g. style={cssVars({ '--i': 2 })}. */
export const cssVars = (vars: Record<`--${string}`, string | number>) => vars as CSSProperties
