/** Brand-level placeholders. Replace with real copy and links. */

export const BRAND = {
  name: 'AiraParfum',
  wordmark: 'Aira',
  suffix: 'Parfum',
  tagline: 'Aroma yang terasa seperti tempat.',
  collection: 'Koleksi Nusantara · 2026',
  about:
    'AiraParfum meracik Eau de Parfum di Jakarta dengan bahan pilihan dari kepulauan Nusantara dan dunia. Setiap botol diisi dan dikemas dengan tangan dalam batch kecil.',
  address: 'Jl. Placeholder No. 12, Jakarta Selatan, Indonesia',
  email: 'halo@airaparfum.example',
  year: 2026,
}

export const NAV_LINKS = [
  { href: '#aroma', label: 'Aroma' },
  { href: '#cerita', label: 'Cerita' },
  { href: '#varian', label: 'Varian' },
  { href: '#produk', label: 'Produk' },
] as const

export type SocialKey = 'instagram' | 'tiktok' | 'youtube' | 'pinterest'

export const SOCIAL_LINKS: { key: SocialKey; label: string; href: string }[] = [
  { key: 'instagram', label: 'Instagram', href: 'https://instagram.com/' },
  { key: 'tiktok', label: 'TikTok', href: 'https://tiktok.com/' },
  { key: 'youtube', label: 'YouTube', href: 'https://youtube.com/' },
  { key: 'pinterest', label: 'Pinterest', href: 'https://pinterest.com/' },
]

export const FOOTER_LINKS = [
  {
    title: 'Belanja',
    links: [
      { label: 'Semua Parfum', href: '#varian' },
      { label: 'Set Penemuan', href: '#produk' },
      { label: 'Kartu Hadiah', href: '#produk' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Pengiriman', href: '#' },
      { label: 'Pengembalian', href: '#' },
      { label: 'Kontak', href: `mailto:${BRAND.email}` },
    ],
  },
]
