# AiraParfum — Interactive 3D Product Showcase

Website showcase parfum premium dengan botol 3D interaktif (React Three Fiber + Three.js).
Palet biru laut · hijau matcha · coklat muda, tipografi editorial, atmosfer kabut/kelopak/partikel,
animasi semprot, dan tiga varian aroma yang mengubah cairan, cahaya, latar, serta konten.

## Menjalankan

Butuh Node.js 20+ (diuji dengan Node 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + build produksi ke dist/
npm run preview    # menyajikan hasil build
```

Parameter URL untuk pengujian performa: `?quality=high|medium|low` memaksa tier grafis.

## Dependensi

| Paket | Fungsi |
| --- | --- |
| `three`, `@react-three/fiber` | Render 3D (React renderer untuk Three.js) |
| `@react-three/drei` | MeshTransmissionMaterial (kaca), Environment/Lightformer, PerformanceMonitor |
| `@react-three/postprocessing`, `postprocessing` | Bloom, depth of field, vignette, grain, tone mapping |
| `zustand` | State global ringan (varian, mode gerak, section aktif, semprot) |
| `@fontsource/cormorant-garamond`, `@fontsource-variable/manrope` | Font self-hosted (tanpa CDN) |
| `vite`, `typescript`, `@vitejs/plugin-react` | Tooling |

Runtime 3D dimuat *lazy* sebagai chunk terpisah, jadi teks halaman langsung tampil.

## Struktur

```
src/
├── App.tsx                    # Komposisi halaman, lazy-load 3D, fallback WebGL
├── config/scene.ts            # ⚙️ URL model GLB, kamera, zoom, durasi intro, timeline semprot
├── data/
│   ├── products.ts            # ⚙️ Varian: palet warna, notes, cerita, harga, bahan
│   └── brand.ts               # ⚙️ Nama brand, navigasi, sosial, alamat (placeholder)
├── state/store.ts             # Zustand: varian, motion mode, section, explore, spray, kualitas
├── animation/
│   ├── poses.ts               # Posisi botol per section (lebar vs. portrait)
│   ├── spray.ts               # Fase animasi semprot (tutup, tekan, emisi)
│   └── easing.ts
├── three/                     # Semua kode 3D
│   ├── Experience.tsx         # <Canvas> fixed di belakang konten + error boundary
│   ├── Scene.tsx              # Susunan scene + sinyal "ready" untuk loader
│   ├── ProductRig.tsx         # Pose per section, rotasi user/inersia, parallax pointer, intro
│   ├── CameraRig.tsx          # Dolly kamera untuk zoom
│   ├── theme.ts               # Interpolasi warna varian untuk seluruh scene
│   ├── reveal.ts              # Progres intro "muncul dari gelap"
│   ├── FrameDriver.tsx        # Render on-demand saat animasi dihentikan
│   ├── controls/              # Drag, wheel, pinch, keyboard → state kontrol
│   ├── bottle/                # Botol prosedural, GLTFBottle, shader cairan, label, material
│   ├── environment/           # Backdrop shader, pencahayaan, partikel, kelopak, kabut
│   └── effects/               # Semprotan partikel (GPU) + post-processing
├── ui/
│   ├── sections/              # Header, Hero, AromaProfile, Story, Variants, ProductDetail, Footer
│   └── components/            # Loader, kontrol stage, switcher varian, ikon, toast, fallback
├── hooks/                     # Observer section, preferensi gerak, variabel CSS tema
└── styles/                    # tokens.css (palet & tipografi), base, layout, components, sections
public/models/README.md        # Panduan mengganti botol dengan file GLB/GLTF
```

## Mengganti placeholder

- **Model 3D** — taruh `aira-bottle.glb` di `public/models/` lalu set
  `BOTTLE_MODEL_URL = '/models/aira-bottle.glb'` di `src/config/scene.ts`.
  Mesh dikenali dari namanya (`glass`, `liquid`, `cap`, `metal`, `nozzle`); lihat `public/models/README.md`.
- **Varian, harga, notes, cerita** — `src/data/products.ts`. Palet tiap varian sekaligus mengatur
  warna cairan, cahaya rim, latar, kabut, partikel, kelopak, dan aksen UI.
- **Brand & tautan** — `src/data/brand.ts`.
- **Checkout** — tombol *Beli Sekarang* saat ini menambah hitungan keranjang dan menampilkan toast;
  sambungkan ke API keranjang di `src/ui/sections/ProductDetail.tsx` (fungsi `buy`).

## Interaksi

| Aksi | Mouse / trackpad | Sentuh | Keyboard |
| --- | --- | --- | --- |
| Putar botol | Seret | Geser horizontal (bebas di mode eksplor) | Fokus area botol → ← → ↑ ↓ |
| Zoom | Scroll ke atas di hero (scroll ke bawah pada zoom minimum tetap menggulir halaman) | Cubit (mode eksplor) | `+` / `-`, `0` reset |
| Mode eksplor | Tombol ⛶ di dock | Tombol ⛶ | `Esc` untuk keluar |
| Semprot | Tombol *Semprotkan* / *Coba semprot* | sama | sama |

Aturan wheel dan `touch-action: pan-y` mencegah halaman "terjebak" di canvas: scroll vertikal
selalu tetap menggulir halaman kecuali pengunjung sengaja masuk mode eksplor.

## Aksesibilitas & gerak

- `prefers-reduced-motion` dihormati otomatis; pengunjung juga bisa memilih **Penuh / Dikurangi /
  Hentikan** di tombol animasi (header). Pilihan disimpan di `localStorage`.
  Mode *Hentikan* membuat canvas render hanya sesuai kebutuhan (`frameloop="demand"`).
- Canvas `aria-hidden`; semua aksi 3D punya tombol berlabel dan pintasan keyboard.
  Perubahan varian dan semprot diumumkan lewat live region.
- Skip link, fokus terlihat, target sentuh ≥ 44px, kontras teks ≥ 4.5:1 di atas panel gelap.
- Tanpa WebGL (atau saat context hilang) ditampilkan botol ilustrasi CSS; konten tetap lengkap.

## Performa

- Tiga tier kualitas (`src/lib/device.ts`) mengatur DPR, sampel transmisi kaca, backside,
  depth of field, MSAA, dan jumlah partikel. `PerformanceMonitor` menurunkan tier bila FPS turun.
- Partikel ambient dan semprotan dihitung di vertex shader (CPU hampir nol).
- Bayangan kontak di-*bake* ke tekstur karena botol selalu berputar bersama podiumnya.
- Catatan teknis: `EffectComposer` mematikan `renderer.autoClear`, sedangkan buffer refraksi
  `MeshTransmissionMaterial` tidak di-clear sendiri. `useTransmissionGuard` mengaktifkan
  auto-clear khusus selama pass tersebut. Tanpa itu, sisa frame intro "tercetak" di kaca.
# aira_parfurm_3d
