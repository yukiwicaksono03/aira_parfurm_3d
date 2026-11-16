/**
 * Product catalogue for AiraParfum.
 *
 * Every visual and textual difference between scent variants is driven from
 * this file: liquid colour, lighting, backdrop, atmosphere, copy and pricing.
 * Replace the placeholder copy / prices here — no component changes needed.
 */

export type NoteIconKey =
  | 'citrus'
  | 'wave'
  | 'salt'
  | 'spice'
  | 'flower'
  | 'lily'
  | 'rose'
  | 'leaf'
  | 'tea'
  | 'fig'
  | 'wood'
  | 'musk'
  | 'amber'
  | 'vanilla'

export interface Note {
  name: string
  icon: NoteIconKey
  description: string
}

export interface ScentPalette {
  /** Main liquid colour (top of the liquid column). */
  liquid: string
  /** Deeper liquid colour (bottom of the bottle). */
  liquidDeep: string
  /** Backdrop gradient, top and bottom. */
  bgTop: string
  bgBottom: string
  /** Soft halo behind the bottle. */
  glow: string
  /** Scene fog — should sit between bgTop and bgBottom. */
  fog: string
  /** Key light tint and rim light tint. */
  keyLight: string
  rimLight: string
  /** Atmosphere tints. */
  particle: string
  petal: string
  mist: string
  /** UI accent colour (must stay legible on dark backgrounds, ≥ 4.5:1). */
  accent: string
}

export interface SizeOption {
  ml: number
  price: number
}

export interface KeyIngredient {
  name: string
  origin: string
  description: string
}

export interface ScentVariant {
  id: string
  name: string
  family: string
  tagline: string
  shortDescription: string
  mood: string[]
  palette: ScentPalette
  notes: { top: Note[]; heart: Note[]; base: Note[] }
  story: {
    quote: string
    inspiration: string
    character: string
    atmosphere: string
  }
  product: {
    sku: string
    concentration: string
    sizes: SizeOption[]
    keyIngredients: KeyIngredient[]
    /** 1–5 scale for the meters in the product section. */
    longevity: number
    sillage: number
    longevityLabel: string
    sillageLabel: string
    fullIngredients: string
  }
}

const INCI_BASE =
  'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Coumarin, Geraniol.'

export const VARIANTS: ScentVariant[] = [
  {
    id: 'bahari',
    name: 'Aira Bahari',
    family: 'Aquatic Aromatik',
    tagline: 'Napas samudra di atas kulit yang hangat.',
    shortDescription: 'Segar dan luas — garam laut, neroli, dan ambergris yang berkilau seperti cahaya di permukaan air.',
    mood: ['Segar', 'Luas', 'Tenang', 'Bercahaya'],
    palette: {
      liquid: '#5AA6CC',
      liquidDeep: '#0E4466',
      bgTop: '#0C2A3B',
      bgBottom: '#03101A',
      glow: '#2E7DA6',
      fog: '#082030',
      keyLight: '#E3F1F7',
      rimLight: '#5FB8E0',
      particle: '#CBE9F5',
      petal: '#E4EFF2',
      mist: '#BFDDEA',
      accent: '#8FCBE4',
    },
    notes: {
      top: [
        { name: 'Bergamot Calabria', icon: 'citrus', description: 'Kilau sitrus yang bersih dan sedikit pahit.' },
        { name: 'Garam Laut', icon: 'salt', description: 'Mineral, asin, seperti angin dari dermaga.' },
        { name: 'Lada Merah Muda', icon: 'spice', description: 'Percik pedas lembut yang membangunkan.' },
      ],
      heart: [
        { name: 'Neroli', icon: 'flower', description: 'Bunga jeruk yang cerah dan madu tipis.' },
        { name: 'Teratai Air', icon: 'lily', description: 'Akuatik, transparan, menenangkan.' },
        { name: 'Ombak Akuatik', icon: 'wave', description: 'Akord ozon yang memberi kesan luas.' },
      ],
      base: [
        { name: 'Ambergris', icon: 'amber', description: 'Hangat-asin, berpendar di kulit.' },
        { name: 'Kayu Hanyut', icon: 'wood', description: 'Kayu kering yang diputihkan matahari.' },
        { name: 'Musk Putih', icon: 'musk', description: 'Lembut seperti kain linen bersih.' },
      ],
    },
    story: {
      quote: '“Pagi pertama di pesisir timur — ketika laut masih biru tua dan dunia belum bersuara.”',
      inspiration:
        'Terinspirasi dari fajar di perairan Nusa Tenggara: kabut asin yang menggantung rendah, perahu kayu yang basah, dan bunga jeruk dari kebun di balik bukit.',
      character:
        'Bersih namun tidak dingin. Sitrus dan mineral membuka jalan, lalu ambergris menghangatkan kulit seperti matahari yang perlahan naik.',
      atmosphere:
        'Untuk hari yang ingin dimulai dengan ringan: kemeja linen, jendela terbuka, dan pikiran yang jernih.',
    },
    product: {
      sku: 'AIRA-BHR',
      concentration: 'Eau de Parfum · 18%',
      sizes: [
        { ml: 30, price: 685000 },
        { ml: 50, price: 985000 },
        { ml: 100, price: 1650000 },
      ],
      keyIngredients: [
        { name: 'Garam laut', origin: 'Pesisir Bali', description: 'Diekstrak sebagai akord mineral yang lembut.' },
        { name: 'Neroli', origin: 'Tunisia', description: 'Distilasi uap bunga jeruk pahit.' },
        { name: 'Ambrox', origin: 'Bioteknologi', description: 'Alternatif ambergris yang etis dan stabil.' },
      ],
      longevity: 4,
      sillage: 3,
      longevityLabel: '7–9 jam',
      sillageLabel: 'Sedang',
      fullIngredients: INCI_BASE,
    },
  },
  {
    id: 'matcha',
    name: 'Aira Matcha',
    family: 'Green Tea Woody',
    tagline: 'Ketenangan hijau dalam satu tarikan napas.',
    shortDescription: 'Teh hijau yang dikocok halus, yuzu, dan hinoki — meditasi yang bisa dikenakan.',
    mood: ['Hening', 'Hijau', 'Fokus', 'Lembut'],
    palette: {
      liquid: '#8FB35C',
      liquidDeep: '#2E4A1B',
      bgTop: '#0F2A27',
      bgBottom: '#041311',
      glow: '#3E6A3A',
      fog: '#0A201C',
      keyLight: '#F1F4E4',
      rimLight: '#B5D37F',
      particle: '#DDEBC4',
      petal: '#B7CF8E',
      mist: '#D3E2BC',
      accent: '#B3CD8C',
    },
    notes: {
      top: [
        { name: 'Yuzu', icon: 'citrus', description: 'Sitrus Jepang yang tajam dan berembun.' },
        { name: 'Daun Matcha', icon: 'tea', description: 'Hijau, sedikit pahit, seperti uap teh pertama.' },
        { name: 'Kapulaga', icon: 'spice', description: 'Rempah sejuk yang terasa bersih.' },
      ],
      heart: [
        { name: 'Daun Ara', icon: 'fig', description: 'Hijau-krimi, getah daun yang segar.' },
        { name: 'Melati Sambac', icon: 'flower', description: 'Melati Indonesia yang lembut dan tidak menyengat.' },
        { name: 'Daun Violet', icon: 'leaf', description: 'Nuansa daun basah setelah hujan.' },
      ],
      base: [
        { name: 'Hinoki', icon: 'wood', description: 'Kayu cemara Jepang, bersih dan meditatif.' },
        { name: 'Akar Wangi', icon: 'leaf', description: 'Vetiver Garut yang berasap halus.' },
        { name: 'Musk Lembut', icon: 'musk', description: 'Bantalan hangat yang menahan semuanya.' },
      ],
    },
    story: {
      quote: '“Sebuah jeda — antara dua tegukan teh, ketika waktu terasa melambat.”',
      inspiration:
        'Lahir dari upacara teh di sebuah rumah kayu di Kyoto dan kebun teh berkabut di lereng Puncak — dua tempat yang mengajarkan arti hening.',
      character:
        'Hijau yang tenang, bukan yang meledak. Matcha dan yuzu terasa segar, lalu hinoki dan akar wangi menurunkan napas menjadi lebih dalam.',
      atmosphere:
        'Untuk pagi yang lambat, ruang kerja yang rapi, dan percakapan yang tidak terburu-buru.',
    },
    product: {
      sku: 'AIRA-MTC',
      concentration: 'Eau de Parfum · 16%',
      sizes: [
        { ml: 30, price: 665000 },
        { ml: 50, price: 945000 },
        { ml: 100, price: 1590000 },
      ],
      keyIngredients: [
        { name: 'Akord matcha', origin: 'Uji, Jepang', description: 'Direkonstruksi dari teh bubuk upacara.' },
        { name: 'Akar wangi', origin: 'Garut, Indonesia', description: 'Vetiver yang disuling secara tradisional.' },
        { name: 'Hinoki', origin: 'Jepang', description: 'Minyak kayu dari hutan lestari.' },
      ],
      longevity: 3,
      sillage: 2,
      longevityLabel: '6–8 jam',
      sillageLabel: 'Dekat kulit',
      fullIngredients: INCI_BASE,
    },
  },
  {
    id: 'senja',
    name: 'Aira Senja',
    family: 'Woody Amber',
    tagline: 'Cahaya keemasan yang tinggal lebih lama.',
    shortDescription: 'Cendana, vanila Bourbon, dan osmanthus — hangat seperti kulit yang menyimpan sinar matahari sore.',
    mood: ['Hangat', 'Sensual', 'Intim', 'Keemasan'],
    palette: {
      liquid: '#D3A06A',
      liquidDeep: '#6E3F1E',
      bgTop: '#1F2228',
      bgBottom: '#0B0A0B',
      glow: '#9C6B42',
      fog: '#17151A',
      keyLight: '#FFF0DC',
      rimLight: '#E2B27C',
      particle: '#F1D9B8',
      petal: '#E7C3A0',
      mist: '#EBD3B6',
      accent: '#DDB78F',
    },
    notes: {
      top: [
        { name: 'Jeruk Mandarin', icon: 'citrus', description: 'Manis dan berkilau, seperti kulit jeruk hangat.' },
        { name: 'Saffron', icon: 'spice', description: 'Kulit dan madu dengan sentuhan logam.' },
        { name: 'Ara Matang', icon: 'fig', description: 'Buah lembut yang memberi kedalaman.' },
      ],
      heart: [
        { name: 'Mawar Damask', icon: 'rose', description: 'Mawar beludru, tidak manis berlebihan.' },
        { name: 'Osmanthus', icon: 'flower', description: 'Aprikot, kulit, dan teh — sangat lembut.' },
        { name: 'Iris', icon: 'lily', description: 'Bedak halus yang elegan.' },
      ],
      base: [
        { name: 'Cendana', icon: 'wood', description: 'Kayu krimi yang hangat dan menenangkan.' },
        { name: 'Vanila Bourbon', icon: 'vanilla', description: 'Gelap, berasap, sedikit boozy.' },
        { name: 'Ambar', icon: 'amber', description: 'Resin keemasan yang memeluk kulit.' },
      ],
    },
    story: {
      quote: '“Ketika matahari turun perlahan, dan semua warna berubah menjadi madu.”',
      inspiration:
        'Dari teras kayu di Ubud saat senja: dupa cendana yang terbakar perlahan, bunga osmanthus di halaman, dan secangkir kopi yang mulai dingin.',
      character:
        'Hangat, dekat, dan sensual. Dibuka dengan mandarin dan saffron, lalu tenggelam ke dalam cendana dan vanila yang lembut seperti kasmir.',
      atmosphere:
        'Untuk malam yang tidak terburu-buru, cahaya lilin, dan seseorang yang duduk cukup dekat untuk menyadarinya.',
    },
    product: {
      sku: 'AIRA-SNJ',
      concentration: 'Eau de Parfum · 20%',
      sizes: [
        { ml: 30, price: 725000 },
        { ml: 50, price: 1045000 },
        { ml: 100, price: 1750000 },
      ],
      keyIngredients: [
        { name: 'Cendana', origin: 'Nusa Tenggara Timur', description: 'Bersertifikat dari perkebunan lestari.' },
        { name: 'Vanila Bourbon', origin: 'Madagaskar', description: 'Absolut vanila yang diekstraksi CO₂.' },
        { name: 'Osmanthus', origin: 'Guilin, Tiongkok', description: 'Absolut bunga yang langka dan lembut.' },
      ],
      longevity: 5,
      sillage: 4,
      longevityLabel: '10–12 jam',
      sillageLabel: 'Kuat',
      fullIngredients: INCI_BASE,
    },
  },
]

export const DEFAULT_VARIANT_ID = VARIANTS[0].id

export function getVariant(id: string): ScentVariant {
  return VARIANTS.find((v) => v.id === id) ?? VARIANTS[0]
}

export const NOTE_TIERS = [
  { key: 'top', label: 'Top Notes', title: 'Kesan Pertama', timing: '0 – 15 menit' },
  { key: 'heart', label: 'Heart Notes', title: 'Jiwa Aroma', timing: '15 menit – 3 jam' },
  { key: 'base', label: 'Base Notes', title: 'Jejak yang Tertinggal', timing: '3 jam ke atas' },
] as const
