import { useEffect, useId, useState } from 'react'
import { BRAND, NAV_LINKS } from '../../data/brand'
import { useAppStore } from '../../state/store'
import { MotionControl } from '../components/MotionControl'
import { IconBag, IconClose, IconMenu } from '../components/Icons'

export function Header() {
  const cartCount = useAppStore((s) => s.cartCount)
  const section = useAppStore((s) => s.section)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
      <a href="#top" className="wordmark" aria-label={`${BRAND.name} — kembali ke atas`}>
        {BRAND.wordmark}
        <span>{BRAND.suffix}</span>
      </a>

      <nav className="site-nav" aria-label="Navigasi utama">
        <ul id={menuId} className="site-nav__list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={section === link.href.slice(1) ? 'true' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="site-header__actions">
        <MotionControl />
        <a href="#produk" className="icon-btn cart-btn" aria-label={`Keranjang, ${cartCount} produk`}>
          <IconBag size={20} />
          {cartCount > 0 && (
            <span className="cart-btn__count" aria-hidden="true">
              {cartCount}
            </span>
          )}
        </a>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <IconClose size={20} /> : <IconMenu size={20} />}
        </button>
      </div>
    </header>
  )
}
