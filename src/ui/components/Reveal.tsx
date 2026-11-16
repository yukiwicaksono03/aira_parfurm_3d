import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fades content up when it scrolls into view. CSS disables the motion for
 * reduced / paused modes (see html[data-motion] rules), so content is never
 * hidden from those visitors.
 */
export function Reveal({
  as: Tag = 'div',
  className = '',
  delay = 0,
  style,
  children,
  ...rest
}: {
  as?: ElementType
  className?: string
  delay?: number
  style?: CSSProperties
  children: ReactNode
  [key: string]: unknown
}) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}
