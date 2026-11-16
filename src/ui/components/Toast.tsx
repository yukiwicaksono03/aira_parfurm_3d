import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { IconCheck } from './Icons'

interface ToastState {
  message: string | null
  id: number
  show: (message: string) => void
}

export const useToast = create<ToastState>()((set) => ({
  message: null,
  id: 0,
  show: (message) => set((s) => ({ message, id: s.id + 1 })),
}))

/** Small confirmation pill (e.g. after "Beli Sekarang"). Announced politely. */
export function Toast() {
  const { message, id } = useToast()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3600)
    return () => clearTimeout(t)
  }, [message, id])

  return (
    <div className={`toast${visible ? ' is-visible' : ''}`} role="status" aria-live="polite">
      {visible && message && (
        <>
          <IconCheck size={18} />
          <span>{message}</span>
        </>
      )}
    </div>
  )
}
