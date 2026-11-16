import { useAppStore } from '../../state/store'

/** Screen-reader announcements for variant changes, spray and cart actions. */
export function LiveRegion() {
  const message = useAppStore((s) => s.announcement)
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
}
