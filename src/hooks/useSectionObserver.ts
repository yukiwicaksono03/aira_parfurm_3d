import { useEffect } from 'react'
import { useAppStore, type SectionId } from '../state/store'

const SECTIONS: SectionId[] = ['hero', 'aroma', 'cerita', 'varian', 'produk', 'footer']

/**
 * Reports which section crosses the middle band of the viewport, which drives
 * the bottle's pose in the fixed 3D layer.
 */
export function useSectionObserver() {
  const setSection = useAppStore((s) => s.setSection)

  useEffect(() => {
    const elements = SECTIONS.map((id) => document.querySelector<HTMLElement>(`[data-section="${id}"]`)).filter(
      (el): el is HTMLElement => el !== null,
    )
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setSection(entry.target.getAttribute('data-section') as SectionId)
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [setSection])
}
