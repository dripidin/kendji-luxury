export interface ProductVariant {
  id: string;
  name: string;
  image?: string;
  colorHex?: string;
}

export interface Product {
  id: string;
  slug: string;
  folderSlug: string;
  name: string;
  category: string;
  categorySlug: string;
  collection: string;
  collectionSlug: string;
  price: number;
  currency: string;
  images: string[];
  coverImage: string;
  description: string;
  metallicFinish?: string;
  stonesOrInserts?: string;
  designCharacteristics?: string;
  piecesIncluded?: string;
  variants?: ProductVariant[];
  isHero?: boolean;
  isFeatured?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: string;
  accentProductSlug: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface BackgroundAsset {
  code: string;
  name: string;
  path: string;
  description: string;
}

export const BACKGROUND_ASSETS: Record<string, BackgroundAsset> = {
  'KJ-BG-01': {
    code: 'KJ-BG-01',
    name: 'Pearl Ivory Editorial',
    path: '/backgrounds/kj-bg-01.jpg',
    description: 'Clean modern architectural interior with quiet luxury ivory tones'
  },
  'KJ-BG-02': {
    code: 'KJ-BG-02',
    name: 'Champagne Silk',
    path: '/backgrounds/kj-bg-02.jpg',
    description: 'Ultra-luxurious subtle champagne gold silk flowing drapery'
  },
  'KJ-BG-03': {
    code: 'KJ-BG-03',
    name: 'Rose Blush Editorial',
    path: '/backgrounds/kj-bg-03.jpg',
    description: 'Delicate soft rose blush and warm ivory satin folds'
  },
  'KJ-BG-04': {
    code: 'KJ-BG-04',
    name: 'Monochrome Architecture',
    path: '/backgrounds/kj-bg-04.jpg',
    description: 'Sharp geometric architectural minimalism with stark obsidian and ivory stone'
  },
  'KJ-BG-05': {
    code: 'KJ-BG-05',
    name: 'Deep Luxury Satin',
    path: '/backgrounds/kj-bg-05.jpg',
    description: 'Deep charcoal obsidian black fluid satin folds with studio spotlight'
  },
  'KJ-BG-06': {
    code: 'KJ-BG-06',
    name: 'Pearl Botanical Whisper',
    path: '/backgrounds/kj-bg-06.jpg',
    description: 'Soft floral botanical shadows cast on warm pearl ivory plaster'
  }
};

export const COLLECTIONS: Collection[] = [
  {
    slug: 'signature-motifs',
    name: 'Signature Motifs',
    tagline: 'Timeless Emblems & Architectural Grace',
    description: 'Iconic clover motifs and structural geometry crafted for enduring elegance and quiet authority.',
    coverImage: '/backgrounds/kj-bg-01.jpg',
    accentProductSlug: 'quatrefoil-clover-4-piece-jewelry-set'
  },
  {
    slug: 'romantic-nature',
    name: 'Romantic Nature',
    tagline: 'Botanical Whimsy & Delicate Brilliance',
    description: 'Ethereal florals, pavé swans, and delicate rose silhouettes designed for intimate moments and feminine expression.',
    coverImage: '/backgrounds/kj-bg-03.jpg',
    accentProductSlug: 'pave-swan-motif-thin-bangle-bracelet'
  },
  {
    slug: 'urban-iconic',
    name: 'Urban & Iconic',
    tagline: 'Modern Contours & Confident Accents',
    description: 'Bold nail & screw duo bangles, paperclip links, and precision timepieces tailored for the contemporary silhouette.',
    coverImage: '/backgrounds/kj-bg-04.jpg',
    accentProductSlug: 'gold-tone-iconic-bangle-duo-set-nail-screw-motif'
  },
  {
    slug: 'personalized-cultural',
    name: 'Personalized & Cultural',
    tagline: 'Heritage, Monograms & Symbolic Bonds',
    description: 'Fine Arabic calligraphy pendants, pavé initials, and intertwined heart motifs rich in sentiment and heritage.',
    coverImage: '/backgrounds/kj-bg-06.jpg',
    accentProductSlug: 'gold-tone-arabic-calligraphy-pendant-necklace'
  }
];

export const CATEGORIES: Category[] = [
  { slug: 'sets', name: 'Sets', description: 'Coordinated parures of bracelets, rings, earrings, and necklaces.' },
  { slug: 'necklaces', name: 'Necklaces', description: 'Delicate chains, drop pendants, and statement sautoirs.' },
  { slug: 'bracelets', name: 'Bracelets', description: 'Cuffs, charm links, bangles, and tennis strands.' },
  { slug: 'rings', name: 'Rings', description: 'Solitaire bands, floral statement rings, and duos.' },
  { slug: 'watches', name: 'Watches', description: 'Classic timepieces with fluted bezels and refined dials.' }
];

export const PRODUCTS: Product[] = [
  {
    id: 'KDL-FLW-SET-01',
    slug: 'floral-enamel-bracelet-and-ring-set',
    folderSlug: 'product-1',
    name: 'Floral Enamel Bracelet and Ring Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1200,
    currency: 'DZD',
    images: [
      '/products/product-1/white.jpg',
      '/products/product-1/black.jpg',
      '/products/product-1/rose.jpg'
    ],
    coverImage: '/products/product-1/white.jpg',
    description: 'Bold statement floral cuff and matching ring set featuring high-gloss enamel petal inserts and polished gold-tone contours.',
    metallicFinish: 'Polished gold-tone with smooth petal bezels.',
    stonesOrInserts: 'High-gloss enamel fill in White, Black, and Blush Rose.',
    designCharacteristics: 'Linked 5-petal flower cuff bracelet paired with a matching statement floral ring.',
    piecesIncluded: '2 Pieces (Floral Cuff Bracelet + Matching Ring)',
    variants: [
      { id: 'v-white', name: 'Blanc Émail', image: '/products/product-1/white.jpg', colorHex: '#F4F4F0' },
      { id: 'v-black', name: 'Noir Émail', image: '/products/product-1/black.jpg', colorHex: '#1A1A1A' },
      { id: 'v-rose', name: 'Rose Poudré', image: '/products/product-1/rose.jpg', colorHex: '#E8C5C8' }
    ],
    isFeatured: true
  },
  {
    id: 'KDL-CLV-SET-01',
    slug: 'quatrefoil-clover-4-piece-jewelry-set',
    folderSlug: 'product-2',
    name: 'Quatrefoil Clover 4-Piece Jewelry Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 1500,
    currency: 'DZD',
    images: [
      '/products/product-2/black.jpg',
      '/products/product-2/gold.png',
      '/products/product-2/white.png'
    ],
    coverImage: '/products/product-2/black.jpg',
    description: 'Iconic four-leaf clover motif parure comprising necklace, bracelet, stud earrings, and statement ring in contrasting finishes.',
    metallicFinish: 'Polished gold-tone chains with micro-beaded border contours.',
    stonesOrInserts: 'Smooth onyx black, guilloché textured gold, and luminous mother-of-pearl white inserts.',
    designCharacteristics: 'Quatrefoil 4-leaf clover emblems; 5-motif necklace, 3-motif bracelet, stud earrings, and cocktail ring.',
    piecesIncluded: '4 Pieces (5-Motif Necklace, 3-Motif Bracelet, Stud Earrings, Ring)',
    variants: [
      { id: 'v-black', name: 'Noir Onyx', image: '/products/product-2/black.jpg', colorHex: '#1A1A1A' },
      { id: 'v-gold', name: 'Or Texturé', image: '/products/product-2/gold.png', colorHex: '#D4AF37' },
      { id: 'v-white', name: 'Blanc Nacre', image: '/products/product-2/white.png', colorHex: '#F9F9F7' }
    ],
    isHero: true,
    isFeatured: true
  },
  {
    id: 'KDL-ROSE-NECK-01',
    slug: 'rose-pendant-necklace-with-gemstone-accents',
    folderSlug: 'product-3',
    name: 'Rose Pendant Necklace with Gemstone Accents',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 800,
    currency: 'DZD',
    images: ['/products/product-3/product-image.png'],
    coverImage: '/products/product-3/product-image.png',
    description: 'Sculpted romantic rose bud pendant on delicate cable link chain with pavé stem and marquise gemstone leaf.',
    metallicFinish: 'Polished gold-tone.',
    stonesOrInserts: 'Rich scarlet bud insert, micro-pavé clear stones, and marquise-cut emerald-tone stone on stem.',
    designCharacteristics: 'Delicate drop pendant featuring a sculpted rose silhouette and fine bail.',
    piecesIncluded: '1 Piece (Necklace)'
  },
  {
    id: 'KDL-CLV-LONG-NECK-01',
    slug: 'long-quatrefoil-clover-necklace-sautoir',
    folderSlug: 'product-4',
    name: 'Long Quatrefoil Clover Necklace (Sautoir)',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 600,
    currency: 'DZD',
    images: ['/products/product-4/image-product.jpg'],
    coverImage: '/products/product-4/image-product.jpg',
    description: 'Versatile opera-length sautoir chain adorned with spaced quatrefoil clover stations for single or layered styling.',
    metallicFinish: 'Polished gold-tone chain with textured beaded motif bezels.',
    stonesOrInserts: 'Smooth contrasting black and white enamel inserts.',
    designCharacteristics: 'Extended length sautoir with 5 evenly spaced clover stations and secure lobster clasp.',
    piecesIncluded: '1 Piece (Sautoir Necklace)'
  },
  {
    id: 'KDL-MIX-CHAIN-NECK-01',
    slug: 'mixed-metal-chain-pendant-necklace',
    folderSlug: 'product-5',
    name: 'Mixed Metal Chain Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Urban & Iconic',
    collectionSlug: 'urban-iconic',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-5/product-image.jpg'],
    coverImage: '/products/product-5/product-image.jpg',
    description: 'Contemporary two-tone statement pendant combining a pavé crystal bar with a bold Cuban chain link segment.',
    metallicFinish: 'Two-tone polished gold and rhodium silver.',
    stonesOrInserts: 'Micro-pavé clear zirconia crystals on rectangular connector.',
    designCharacteristics: 'Mixed metal contrast connecting delicate chain to a heavy-gauge curb link drop.',
    piecesIncluded: '1 Piece (Pendant Necklace)'
  },
  {
    id: 'KDL-INITIAL-S-NECK-01',
    slug: 'letter-s-pave-initial-pendant-necklace',
    folderSlug: 'product-6',
    name: 'Letter "S" Pavé Initial Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Personalized & Cultural',
    collectionSlug: 'personalized-cultural',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-6/product-image.png'],
    coverImage: '/products/product-6/product-image.png',
    description: 'Personalized monogram medallion with dense pavé stone setting and contrasting black enamel center letter.',
    metallicFinish: 'High-polish gold-tone chain and frame.',
    stonesOrInserts: 'Full pavé micro-crystals surrounding a black square enamel initial plate.',
    designCharacteristics: 'Rectangular monogram medal on adjustable fine cable chain.',
    piecesIncluded: '1 Piece (Monogram Necklace)'
  },
  {
    id: 'KDL-PAVE-RECT-BRAC-01',
    slug: 'pave-rectangular-centerpiece-chain-bracelet',
    folderSlug: 'product-7',
    name: 'Pavé Rectangular Centerpiece Chain Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Urban & Iconic',
    collectionSlug: 'urban-iconic',
    price: 1500,
    currency: 'DZD',
    images: ['/products/product-7/product-image.png'],
    coverImage: '/products/product-7/product-image.png',
    description: 'Heavy-gauge flat curb chain bracelet anchored by a gleaming rectangular plate encrusted with dense crystal pavé.',
    metallicFinish: 'Polished mirror-finish gold-tone.',
    stonesOrInserts: 'Dense multi-row clear pavé stones.',
    designCharacteristics: 'Substantial Cuban curb links with integrated rectangular bar centerpiece.',
    piecesIncluded: '1 Piece (Chain Bracelet)'
  },
  {
    id: 'KDL-RING-DUO-01',
    slug: 'gold-tone-solitaire-and-quatrefoil-band-ring-duo',
    folderSlug: 'product-8',
    name: 'Gold-Tone Solitaire and Quatrefoil Band Ring Duo',
    category: 'Rings',
    categorySlug: 'rings',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-8/product-image.png'],
    coverImage: '/products/product-8/product-image.png',
    description: 'Complementary ring pairing featuring a floral halo solitaire and an engraved clover eternity band.',
    metallicFinish: 'Polished gold-tone solitaire band and satin-engraved wide band.',
    stonesOrInserts: 'Round clear halo centerpiece; subtle accent gems in clover motifs.',
    designCharacteristics: 'Two stacking rings: one crown halo solitaire, one stamped quatrefoil band.',
    piecesIncluded: '2 Pieces (Solitaire Ring + Clover Band)'
  },
  {
    id: 'KDL-VINE-BRAC-01',
    slug: 'vine-and-leaf-stone-bracelet',
    folderSlug: 'product-9',
    name: 'Vine and Leaf Stone Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-9/products-image.jpg'],
    coverImage: '/products/product-9/products-image.jpg',
    description: 'Organic botanical vine bracelet adorned with alternating marquise crystal leaves and faceted stone stations.',
    metallicFinish: 'Polished gold-tone and rhodium accents.',
    stonesOrInserts: 'Faceted oval and marquise-cut crystal stones with lobster clasp closure.',
    designCharacteristics: 'Articulated vine chain link with delicate leaf settings.',
    piecesIncluded: '1 Piece (Bracelet)'
  },
  {
    id: 'KDL-2TONE-PAPER-BRAC-01',
    slug: 'two-tone-paperclip-chain-bracelet-with-pave-center-link',
    folderSlug: 'product-10',
    name: 'Two-Tone Paperclip Chain Bracelet with Pavé Center Link',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Urban & Iconic',
    collectionSlug: 'urban-iconic',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-10/product-image.png'],
    coverImage: '/products/product-10/product-image.png',
    description: 'Elongated paperclip chain links separated by polished gold beads, centered around a contrasting silver pavé link.',
    metallicFinish: 'Two-tone polished gold-tone links with rhodium silver center link.',
    stonesOrInserts: 'Dense micro-pavé zirconia crystals on center link.',
    designCharacteristics: 'Modern architectural link rhythm with bead separators and secure lobster clasp.',
    piecesIncluded: '1 Piece (Paperclip Bracelet)'
  },
  {
    id: 'KDL-KNOT-SET-01',
    slug: 'gold-knot-link-4-piece-jewelry-set',
    folderSlug: 'product-11',
    name: 'Gold Knot Link 4-Piece Jewelry Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 1800,
    currency: 'DZD',
    images: ['/products/product-11/product-image.jpg'],
    coverImage: '/products/product-11/product-image.jpg',
    description: 'Sculptural love knot links forming a unified parure with drop lariat necklace, matching bracelet, earrings, and ring.',
    metallicFinish: 'High-polish mirror gold-tone finish.',
    stonesOrInserts: 'Pure metallic sculptural knots without stones.',
    designCharacteristics: 'Intertwined knot motifs; necklace features a lariat drop; bracelet features extension links.',
    piecesIncluded: '4 Pieces (Lariat Necklace, Knot Bracelet, Knot Earrings, Knot Ring)'
  },
  {
    id: 'KDL-PINK-DROP-NECK-01',
    slug: 'pink-and-clear-stone-drop-pendant-necklace',
    folderSlug: 'product-12',
    name: 'Pink and Clear Stone Drop Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-12/product-image.png'],
    coverImage: '/products/product-12/product-image.png',
    description: 'Luminous pastel pink cushion and pear stones arranged in a V-shaped neckline collar with cascading drops.',
    metallicFinish: 'Polished gold-tone prong settings.',
    stonesOrInserts: 'Faceted light pink and clear teardrop/marquise gemstones.',
    designCharacteristics: 'Symmetrical stone collar framing a central star cluster and dangling pear drop.',
    piecesIncluded: '1 Piece (Collar Necklace)'
  },
  {
    id: 'KDL-CHARM-BRAC-01',
    slug: 'gold-twisted-chain-charm-bracelet',
    folderSlug: 'product-13',
    name: 'Gold Twisted Chain Charm Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Personalized & Cultural',
    collectionSlug: 'personalized-cultural',
    price: 1500,
    currency: 'DZD',
    images: ['/products/product-13/product-image.png'],
    coverImage: '/products/product-13/product-image.png',
    description: 'Substantial rope curb chain suspended with assorted symbolic 3D metallic medallions and engraved motifs.',
    metallicFinish: 'Textured and polished gold-tone.',
    stonesOrInserts: 'All-metal sculpted 3D charms.',
    designCharacteristics: 'Heavy twisted rope curb chain with dangling lockets and solid lobster clasp.',
    piecesIncluded: '1 Piece (Charm Bracelet)'
  },
  {
    id: 'KDL-QUATREFOIL-DROP-SET-01',
    slug: 'gold-quatrefoil-drop-pendant-and-earring-set',
    folderSlug: 'product-14',
    name: 'Gold Quatrefoil Drop Pendant and Earring Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 2200,
    currency: 'DZD',
    images: ['/products/product-14/product-image.png'],
    coverImage: '/products/product-14/product-image.png',
    description: 'Dramatic tiered quatrefoil clover pendant and matching earrings featuring pavé outlines and warm amber accents.',
    metallicFinish: 'Polished gold-tone bezels with beaded edges.',
    stonesOrInserts: 'Micro-pavé clear stones outlining amber and black central enamel inserts.',
    designCharacteristics: 'Statement oversized drop pendant with matching dangle earrings.',
    piecesIncluded: '2 Pieces (Tiered Drop Pendant Necklace + Drop Earrings)'
  },
  {
    id: 'KDL-HEART-NECK-01',
    slug: 'minimalist-open-heart-pendant-necklace',
    folderSlug: 'product-15',
    name: 'Minimalist Open Heart Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 800,
    currency: 'DZD',
    images: ['/products/product-15/product-image.jpg'],
    coverImage: '/products/product-15/product-image.jpg',
    description: 'Clean wireframe open heart outline pendant suspended along a delicate whisper cable chain.',
    metallicFinish: 'High-polish mirror gold-tone.',
    stonesOrInserts: 'Pure polished metal silhouette.',
    designCharacteristics: 'Minimal open-contour heart pendant on fine chain.',
    piecesIncluded: '1 Piece (Necklace)'
  },
  {
    id: 'KDL-PEARL-CHARM-BRAC-01',
    slug: 'gold-tone-ocean-charm-and-pearl-bracelet',
    folderSlug: 'product-16',
    name: 'Gold-Tone Ocean Charm and Pearl Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-16/product-image.png'],
    coverImage: '/products/product-16/product-image.png',
    description: 'Lustrous round white pearls alternating with 3D ocean-inspired charms (starfish, shell, seahorse) on gold chain.',
    metallicFinish: 'Polished gold-tone.',
    stonesOrInserts: 'Round white lustrous pearls with sculptural metallic charms.',
    designCharacteristics: 'Delicate cable chain with evenly spaced pearls and coastal charm pendants.',
    piecesIncluded: '1 Piece (Charm Bracelet)'
  },
  {
    id: 'KDL-BUTTERFLY-NECK-01',
    slug: 'silver-tone-pave-butterfly-pendant-necklace',
    folderSlug: 'product-17',
    name: 'Silver-Tone Pavé Butterfly Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-17/image-product.jpg'],
    coverImage: '/products/product-17/image-product.jpg',
    description: 'Dazzling rhodium silver-tone pendant sculpted into a butterfly with wings fully paved in clear micro-crystals.',
    metallicFinish: 'Polished rhodium silver-tone.',
    stonesOrInserts: 'Dense clear crystal pavé setting.',
    designCharacteristics: 'Intricate butterfly silhouette on fine chain with extension links.',
    piecesIncluded: '1 Piece (Pendant Necklace)'
  },
  {
    id: 'KDL-BANGLE-DUO-01',
    slug: 'gold-tone-iconic-bangle-duo-set-nail-screw-motif',
    folderSlug: 'product-18',
    name: 'Gold-Tone Iconic Bangle Duo Set (Nail & Screw Motif)',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Urban & Iconic',
    collectionSlug: 'urban-iconic',
    price: 1500,
    currency: 'DZD',
    images: ['/products/product-18/product-image.png'],
    coverImage: '/products/product-18/product-image.png',
    description: 'High-fashion stacking duo consisting of the curved nail bangle with pavé head and the engraved screw cuff.',
    metallicFinish: 'Mirror-polished gold finish.',
    stonesOrInserts: 'Micro-pavé stones on the nail head and curved clasp mechanism.',
    designCharacteristics: 'Two iconic stacking bangles: one nail contour, one engraved screw motif.',
    piecesIncluded: '2 Pieces (Nail Bangle + Screw Cuff)',
    isFeatured: true
  },
  {
    id: 'KDL-FLORAL-CUFF-SET-01',
    slug: 'gold-tone-floral-cuff-bracelet-and-ring-set',
    folderSlug: 'product-19',
    name: 'Gold-Tone Floral Cuff Bracelet and Ring Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-19/product-image.png'],
    coverImage: '/products/product-19/product-image.png',
    description: 'Architectural cuff bracelet formed of interlocking satin-brushed 5-petal flowers with a matching double-flower ring.',
    metallicFinish: 'Brushed matte gold petals with mirror-polished outer rims.',
    stonesOrInserts: 'All-metal textured petals.',
    designCharacteristics: 'Semi-rigid floral cuff bracelet paired with stacked floral statement ring.',
    piecesIncluded: '2 Pieces (Floral Cuff + Matching Double Ring)'
  },
  {
    id: 'KDL-HEART-SNAKE-SET-01',
    slug: 'gold-tone-intertwined-heart-4-piece-jewelry-set',
    folderSlug: 'product-20',
    name: 'Gold-Tone Intertwined Heart 4-Piece Jewelry Set',
    category: 'Sets',
    categorySlug: 'sets',
    collection: 'Personalized & Cultural',
    collectionSlug: 'personalized-cultural',
    price: 800,
    currency: 'DZD',
    images: ['/products/product-20/product-image.png'],
    coverImage: '/products/product-20/product-image.png',
    description: 'Fluid cylindrical snake chain parure with intertwined open double-heart pendants representing enduring connection.',
    metallicFinish: 'High-polish mirror snake chain in gold-tone.',
    stonesOrInserts: 'All-metal open heart silhouettes.',
    designCharacteristics: 'Cylindrical snake chains with intertwined double heart pendants.',
    piecesIncluded: '4 Pieces (Snake Necklace, Snake Bracelet, Heart Earrings, Heart Ring)'
  },
  {
    id: 'KDL-SWAN-BRAC-01',
    slug: 'pave-swan-motif-thin-bangle-bracelet',
    folderSlug: 'product-21',
    name: 'Pavé Swan Motif Thin Bangle Bracelet',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 900,
    currency: 'DZD',
    images: [
      '/products/product-21/product-image.png',
      '/products/product-21/gold-with-white.jpg',
      '/products/product-21/gold-with-violets.jpg',
      '/products/product-21/silver.jpg'
    ],
    coverImage: '/products/product-21/product-image.png',
    description: 'Slender rigid bangle crowned with a graceful swan motif encrusted in micro-pavé crystals across classic colorways.',
    metallicFinish: 'Polished gold-tone and rhodium silver.',
    stonesOrInserts: 'Micro-pavé crystals in clear diamond, amethyst violet, and black accents.',
    designCharacteristics: 'Slim rigid oval bangle with hinge opening and crystal swan focal point.',
    piecesIncluded: '1 Piece (Swan Bangle)',
    variants: [
      { id: 'v-gold-white', name: 'Or & Blanc', image: '/products/product-21/gold-with-white.jpg', colorHex: '#F0E6D2' },
      { id: 'v-gold-violet', name: 'Or & Violet', image: '/products/product-21/gold-with-violets.jpg', colorHex: '#7852A9' },
      { id: 'v-silver', name: 'Argent Rhodié', image: '/products/product-21/silver.jpg', colorHex: '#D8D8D8' }
    ],
    isFeatured: true
  },
  {
    id: 'KDL-KNOT-NECK-02',
    slug: 'gold-tone-stone-encrusted-knot-pendant-necklace',
    folderSlug: 'product-22',
    name: 'Gold-Tone Stone-Encrusted Knot Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Signature Motifs',
    collectionSlug: 'signature-motifs',
    price: 1200,
    currency: 'DZD',
    images: ['/products/product-22/product-image.png'],
    coverImage: '/products/product-22/product-image.png',
    description: 'Horizontal bar pendant twisting into an infinity knot encrusted with channel-set crystal pavé on fine chain.',
    metallicFinish: 'Polished gold-tone.',
    stonesOrInserts: 'Channel-set clear pavé crystals across the knot contour.',
    designCharacteristics: 'Horizontal infinity knot focal piece with integrated bail.',
    piecesIncluded: '1 Piece (Necklace)'
  },
  {
    id: 'KDL-FLORAL-VINE-BRAC-01',
    slug: 'gold-tone-floral-vine-bracelet-with-pink-stones',
    folderSlug: 'product-23',
    name: 'Gold-Tone Floral Vine Bracelet with Pink Stones',
    category: 'Bracelets',
    categorySlug: 'bracelets',
    collection: 'Romantic Nature',
    collectionSlug: 'romantic-nature',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-23/product-image.jpg'],
    coverImage: '/products/product-23/product-image.jpg',
    description: 'Graceful garden vine branch with three floral clusters set with blush pink stones and pavé leaves.',
    metallicFinish: 'Polished gold-tone.',
    stonesOrInserts: 'Blush pink center stones with clear halo crystals and crystal leaves.',
    designCharacteristics: 'Articulated vine chain with three flower stations and extension links.',
    piecesIncluded: '1 Piece (Bracelet)'
  },
  {
    id: 'KDL-CALLIGRAPHY-NECK-01',
    slug: 'gold-tone-arabic-calligraphy-pendant-necklace',
    folderSlug: 'product-24',
    name: 'Gold-Tone Arabic Calligraphy Pendant Necklace',
    category: 'Necklaces',
    categorySlug: 'necklaces',
    collection: 'Personalized & Cultural',
    collectionSlug: 'personalized-cultural',
    price: 1000,
    currency: 'DZD',
    images: ['/products/product-24/product-image.png'],
    coverImage: '/products/product-24/product-image.png',
    description: 'Stylized Arabic calligraphy script suspended as a fluid horizontal pendant on delicate gold chain.',
    metallicFinish: 'Polished gold-tone.',
    stonesOrInserts: 'Pure sculptural metal script.',
    designCharacteristics: 'Horizontal calligraphy medal celebrating traditional script with modern clean lines.',
    piecesIncluded: '1 Piece (Pendant Necklace)',
    isFeatured: true
  },
  {
    id: 'KDL-WATCH-DATEJUST-01',
    slug: 'two-tone-black-dial-watch-with-stone-set-bezel-datejust-style',
    folderSlug: 'product-25',
    name: 'Two-Tone Black Dial Watch (Datejust Style)',
    category: 'Watches',
    categorySlug: 'watches',
    collection: 'Urban & Iconic',
    collectionSlug: 'urban-iconic',
    price: 1900,
    currency: 'DZD',
    images: ['/products/product-25/product-image.jpg'],
    coverImage: '/products/product-25/product-image.jpg',
    description: 'Classic two-tone Jubilee link bracelet watch featuring a sunray black dial, date cyclops lens, and crystal-set fluted bezel.',
    metallicFinish: 'Two-tone brushed and polished gold/steel finish.',
    stonesOrInserts: 'Round clear crystal stones set in the fluted bezel.',
    designCharacteristics: 'Analog dial with date window at 3 o\'clock, cyclops magnifier, and 5-link Jubilee bracelet.',
    piecesIncluded: '1 Piece (Timepiece)'
  }
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.isFeatured);
}

export function getHeroProduct(): Product {
  return PRODUCTS.find(p => p.isHero) || PRODUCTS[0];
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getCollections(): Collection[] {
  return COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find(c => c.slug === slug);
}

export function getCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  return PRODUCTS.filter(p => p.collectionSlug === collectionSlug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter(p => p.categorySlug === categorySlug);
}

export function getRelatedProducts(currentProduct: Product, limit: number = 4): Product[] {
  // Prefer same collection first, then same category, excluding current product
  const sameCollection = PRODUCTS.filter(
    p => p.collectionSlug === currentProduct.collectionSlug && p.id !== currentProduct.id
  );
  const sameCategory = PRODUCTS.filter(
    p => p.categorySlug === currentProduct.categorySlug && p.id !== currentProduct.id && !sameCollection.some(sc => sc.id === p.id)
  );
  
  const combined = [...sameCollection, ...sameCategory];
  if (combined.length < limit) {
    const others = PRODUCTS.filter(p => p.id !== currentProduct.id && !combined.some(c => c.id === p.id));
    return [...combined, ...others].slice(0, limit);
  }
  
  return combined.slice(0, limit);
}
