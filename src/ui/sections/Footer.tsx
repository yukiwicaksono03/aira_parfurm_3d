import { BRAND, FOOTER_LINKS, NAV_LINKS, SOCIAL_LINKS } from '../../data/brand'
import { SocialIcon } from '../components/Icons'

export function Footer() {
  return (
    <footer className="site-footer" data-section="footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <a href="#top" className="wordmark wordmark--large" aria-label={`${BRAND.name} — kembali ke atas`}>
            {BRAND.wordmark}
            <span>{BRAND.suffix}</span>
          </a>
          <p>{BRAND.about}</p>
          <address>
            {BRAND.address}
            <br />
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </address>
        </div>

        <nav aria-label="Navigasi footer" className="site-footer__nav">
          <div>
            <h2>Jelajahi</h2>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h2>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="site-footer__social">
          <h2>Ikuti kami</h2>
          <ul>
            {SOCIAL_LINKS.map((s) => (
              <li key={s.key}>
                <a href={s.href} className="icon-btn" aria-label={`${BRAND.name} di ${s.label}`} target="_blank" rel="noreferrer">
                  <SocialIcon name={s.key} size={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © {BRAND.year} {BRAND.name}. Seluruh hak dilindungi.
        </p>
        <p>Harga, gambar, dan detail produk bersifat placeholder.</p>
      </div>
    </footer>
  )
}
