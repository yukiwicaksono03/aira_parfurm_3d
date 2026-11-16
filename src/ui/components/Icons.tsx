import type { ReactNode, SVGProps } from 'react'
import type { NoteIconKey } from '../../data/products'
import type { SocialKey } from '../../data/brand'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

/** Hairline botanical / material icons for fragrance notes. */
const NOTE_PATHS: Record<NoteIconKey, ReactNode> = {
  citrus: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="5.2" />
      <path d="M12 6.8v10.4M6.8 12h10.4M8.3 8.3l7.4 7.4M15.7 8.3l-7.4 7.4" />
    </>
  ),
  wave: (
    <>
      <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </>
  ),
  salt: (
    <>
      <path d="M12 3l6 4v10l-6 4-6-4V7z" />
      <path d="M12 3v18M6 7l12 10M18 7L6 17" opacity="0.6" />
    </>
  ),
  spice: (
    <>
      <circle cx="9" cy="14" r="2.2" />
      <circle cx="15" cy="15.5" r="1.8" />
      <circle cx="13" cy="9.5" r="2" />
      <path d="M13 7.5c0-2 1-3.5 3-4.5" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8C10 6 10.5 3.5 12 3c1.5.5 2 3 0 6.8zM14.2 12c3.8-2 6.3-1.5 6.8 0-.5 1.5-3 2-6.8 0zM12 14.2c2 3.8 1.5 6.3 0 6.8-1.5-.5-2-3 0-6.8zM9.8 12C6 14 3.5 13.5 3 12c.5-1.5 3-2 6.8 0z" />
    </>
  ),
  lily: (
    <>
      <path d="M12 20c-4 0-7-3-8-7 3 0 5.5 1.5 8 4 2.5-2.5 5-4 8-4-1 4-4 7-8 7z" />
      <path d="M12 17c-2-3-2-7 0-11 2 4 2 8 0 11z" />
    </>
  ),
  rose: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15c-3.5 0-6-2.5-6-6 0-2 1-3.5 2.5-4.5C9 6 10.5 7 12 7s3-1 3.5-2.5C17 5.5 18 7 18 9c0 3.5-2.5 6-6 6z" />
      <path d="M9.5 9.5c1 1.5 4 1.5 5 0M12 7v3" />
      <path d="M12 18.5c-1.5-1-3-1-4-.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15z" />
      <path d="M5 19L14 10" />
    </>
  ),
  tea: (
    <>
      <path d="M4 10h13v3a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" />
      <path d="M17 11h1.5a2 2 0 0 1 0 4H17" />
      <path d="M8 3c-1 1.5 1 2 0 4M12 3c-1 1.5 1 2 0 4" />
    </>
  ),
  fig: (
    <>
      <path d="M12 6c4 3 6 6 6 9a6 6 0 0 1-12 0c0-3 2-6 6-9z" />
      <path d="M12 6V3.5M12 4.5c1-1 2.5-1.2 3.5-.8" />
      <path d="M10 15h.01M13.5 13.5h.01M12.5 17h.01" strokeWidth={2} />
    </>
  ),
  wood: (
    <>
      <ellipse cx="12" cy="12" rx="8" ry="8" />
      <ellipse cx="12" cy="12" rx="5" ry="5.4" />
      <ellipse cx="12" cy="12" rx="2" ry="2.4" />
    </>
  ),
  musk: (
    <>
      <path d="M7 17a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 8.5 4.3 4.3 0 0 1 17.5 17z" />
      <path d="M9 13.5c1.5 1 4.5 1 6 0" opacity="0.6" />
    </>
  ),
  amber: (
    <>
      <path d="M12 3l7 6-7 12L5 9z" />
      <path d="M5 9h14M9 9l3 12 3-12M9 9l3-6 3 6" opacity="0.6" />
    </>
  ),
  vanilla: (
    <>
      <path d="M6 20c3-5 7-11 13-16" />
      <path d="M8 20c2.5-4.5 6.5-10 12-14.5" />
      <path d="M17 5.5c1.5-1 2.5-1.2 3-1" />
      <circle cx="6" cy="8" r="2.2" />
      <path d="M6 5.8V4" />
    </>
  ),
}

export function NoteIcon({ icon, ...props }: IconProps & { icon: NoteIconKey }) {
  return <Svg {...props}>{NOTE_PATHS[icon]}</Svg>
}

const SOCIAL_PATHS: Record<SocialKey, ReactNode> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.8" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </>
  ),
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M11 8.5c3-1 5.5.5 5 3.3-.4 2.3-2.4 3.3-3.8 2.5M11.5 10l-2.5 11" />
    </>
  ),
}

export function SocialIcon({ name, ...props }: IconProps & { name: SocialKey }) {
  return <Svg {...props}>{SOCIAL_PATHS[name]}</Svg>
}

/* ── UI icons ─────────────────────────────────────────────────────── */

export const IconRotateLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.3-5.6" />
    <path d="M4 4v4h4" />
  </Svg>
)
export const IconRotateRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" />
    <path d="M20 4v4h-4" />
  </Svg>
)
export const IconZoomIn = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.4-4.4M11 8v6M8 11h6" />
  </Svg>
)
export const IconZoomOut = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.4-4.4M8 11h6" />
  </Svg>
)
export const IconReset = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
  </Svg>
)
export const IconSpray = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="10" width="9" height="11" rx="2.5" />
    <path d="M7 10V7h3v3M10 7.5h2" />
    <path d="M15 6.5h.01M17.5 5h.01M17.5 8h.01M20 3.5h.01M20 6.5h.01M20 9.5h.01" strokeWidth={2.2} />
  </Svg>
)
export const IconExpand = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Svg>
)
export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
)
export const IconMenu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h16M4 16h16" />
  </Svg>
)
export const IconBag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Svg>
)
export const IconArrowDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </Svg>
)
export const IconArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
)
export const IconMotion = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 12c2.5-5 5.5-5 9 0s6.5 5 9 0" />
  </Svg>
)
export const IconPause = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6v12M15 6v12" />
  </Svg>
)
export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
)
