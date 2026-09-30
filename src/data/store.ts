/* ------------------------------------------------------------------
 * FLAYA prototype data layer (dummy content, no backend).
 * Real collection structure: Velvet · Armani Silk · Aura · Emirati
 * Satin · Capsule + atelier line. ~110 styles · 4-5 shots per product.
 * ------------------------------------------------------------------ */

export const px = (id: number, w = 900, h = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

export type Size = "XS" | "S" | "M" | "L" | "XL" | "OS";
export const ALL_SIZES: Size[] = ["XS", "S", "M", "L", "XL"];

export type CategoryId = "abayas" | "dresses" | "sets" | "outerwear";

export interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
  sizes: Size[];
  stockNote?: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number; // AED (effective selling price)
  compareAtPrice?: number; // AED original when on sale
  badge?: "new" | "bestseller";
  collection: string;
  desc: string;
  details?: string[];
  fabric: string;
  colors: ColorVariant[];
  rating: number;
  reviewCount: number;
  addedAt?: number; // epoch ms — used for date sorting
  look?: { image: string; caption: string; itemIds: string[] };
}

/* ------------------------- imagery pools ------------------------- */

const ABAYA_DARK = [13838842, 32279501, 33796538, 33448124, 37558000, 13791306, 32279505, 13838840, 5498151, 13097074, 7815359, 33600455, 8911852, 8350517];
const PINK_POOL = [10634555, 32113594, 1698731, 19537362, 19537377, 16269792];
const YELLOW_POOL = [8070476, 19263912, 33195874, 7628423, 8063274, 19333541];
const WHITE_POOL = [7814845, 8748722, 10288366, 30698026, 6071508, 10288352, 13938082];
const SATIN_POOL = [16269792, 19816456, 19771940, 29943182, 30873274, 37346213, 20264905];
const VELVET_POOL = [38962066, 15862132, 31648340, 36617116, 18709335, 7815359];
const TERRA_POOL = [37346213, 31648340, 33195874, 19816456, 30873274, 37346213];
const NEUTRAL_POOL = [30345140, 4235408, 39398506, 33042614, 18161522, 36726774, 8350584, 18435659, 32751886];
const TEXTURE_POOL = [8465992, 8465951, 8465946, 36726412, 8465944, 33264441, 8465941, 35980977];

const shots = (pool: number[], base: number[] = [], count = 5): string[] => {
  const out = [...new Set([...base, ...pool])].slice(0, count - 1);
  out.push(TEXTURE_POOL[(base[0] ?? 0) % TEXTURE_POOL.length]);
  return out.map((id) => px(id, 900, 1200));
};

/* ------------------------- real site colours ------------------------- */

const C = {
  black: { name: "Black", hex: "#1b1917" },
  chocolate: { name: "Chocolate", hex: "#503729" },
  gold: { name: "Gold", hex: "#b08d3f" },
  brown: { name: "Brown", hex: "#6b4a35" },
  cherry: { name: "Cherry", hex: "#6e2434" },
  lemon: { name: "Lemon", hex: "#d9c53f" },
  nude: { name: "Nude", hex: "#d9bfa5" },
  white: { name: "White", hex: "#f2efe9" },
  pink: { name: "Pink", hex: "#e3b7c4" },
  yellow: { name: "Yellow", hex: "#e2c94f" },
  terracotta: { name: "Terracotta", hex: "#b5674a" },
  babyBlue: { name: "Baby Blue", hex: "#aec6d8" },
  blue: { name: "Blue", hex: "#4a6d8c" },
  green: { name: "Green", hex: "#5c6b54" },
  noir: { name: "Noir", hex: "#1b1917" },
  graphite: { name: "Graphite", hex: "#45413c" },
  softOnyx: { name: "Soft Onyx", hex: "#2e2a25" },
  espresso: { name: "Espresso", hex: "#3a2e26" },
  sand: { name: "Sand", hex: "#cbb69c" },
  camel: { name: "Camel", hex: "#a9825a" },
  oat: { name: "Oat", hex: "#cfc0a7" },
  ivory: { name: "Ivory", hex: "#ece5d7" },
  butter: { name: "Butter", hex: "#e0cda5" },
  dustyRose: { name: "Dusty Rose", hex: "#c9a79f" },
  sage: { name: "Sage", hex: "#9aa08b" },
  sky: { name: "Sky", hex: "#a7b8c9" },
  olive: { name: "Olive", hex: "#6e6a52" },
  champagne: { name: "Champagne", hex: "#e2d2b6" },
  stone: { name: "Stone", hex: "#8f8b84" },
  sahara: { name: "Sahara", hex: "#c4a878" },
  citySand: { name: "City Sand", hex: "#c2ad90" },
  sandstone: { name: "Sandstone", hex: "#b6a184" },
  softWhite: { name: "Soft White", hex: "#ece7dc" },
  deepInk: { name: "Deep Ink", hex: "#25221f" },
} satisfies Record<string, { name: string; hex: string }>;

const familyPool = (key: string): number[] => {
  if (["pink"].includes(key)) return PINK_POOL;
  if (["yellow", "lemon", "gold"].includes(key)) return YELLOW_POOL;
  if (["white", "ivory", "softWhite", "nude", "babyBlue"].includes(key)) return WHITE_POOL;
  if (["terracotta"].includes(key)) return TERRA_POOL;
  if (["chocolate"].includes(key)) return VELVET_POOL;
  if (["blue", "green", "sage", "sky"].includes(key)) return SATIN_POOL;
  if (["sand", "camel", "oat", "butter", "champagne", "sahara", "citySand", "sandstone"].includes(key)) return NEUTRAL_POOL;
  return ABAYA_DARK;
};

const shotsFromIndex = (pool: number[], startIdx: number, count = 5): string[] => {
  const out: number[] = [];
  const seen = new Set<number>();
  for (let i = 0; out.length < count - 1 && i < pool.length; i++) {
    const id = pool[(startIdx + i) % pool.length];
    if (!seen.has(id)) { seen.add(id); out.push(id); }
  }
  // anchor the seeded studio shot first when provided
  out.push(TEXTURE_POOL[(startIdx + 3) % TEXTURE_POOL.length]);
  return out.map((id) => px(id, 900, 1200));
};

const variant = (
  pal: { name: string; hex: string },
  poolKey: string,
  base: number[],
  sizes: Size[],
  stockNote?: string,
  offset = 0
): ColorVariant => {
  const fp = familyPool(poolKey);
  let images: string[];
  if (base.length) {
    images = shots(fp, base);
  } else {
    images = shotsFromIndex(fp, offset % Math.max(1, fp.length));
  }
  return {
    name: pal.name,
    hex: pal.hex,
    images,
    sizes,
    ...(stockNote ? { stockNote } : {}),
  };
};

const OS: Size[] = ["OS"];
const FULL: Size[] = ["XS", "S", "M", "L", "XL"];
let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
const subSizes = (): Size[] => {
  const s = [...FULL];
  const drop = Math.floor(rnd() * 2);
  for (let i = 0; i < drop; i++) s.splice(Math.floor(rnd() * s.length), 1);
  return s;
};

/* ------------------------- COLLECTIONS (real site) ------------------------- */

export const COLLECTIONS = [
  {
    id: "the-capsule",
    name: "Capsule Collection",
    desc: "Enter a realm of timeless elegance — base dresses, sculpting fits and transforming pieces designed to layer into a full wardrobe.",
  },
  {
    id: "velvet",
    name: "Velvet Abaya",
    desc: "Luxurious velvet with a soft shine — open abayas in Black, Chocolate and Gold, cut in a relaxed free-size silhouette.",
  },
  {
    id: "armani-silk",
    name: "Armani Silk",
    desc: "Crafted from Armani silk, a luxurious satin celebrated for its fluid drape and refined glow. Silky-smooth, moving effortlessly with the body.",
  },
  {
    id: "aura",
    name: "Aura Collection",
    desc: "The Aura Set — a softly sculpting ensemble in six considered shades, made for elevated everyday wear.",
  },
  {
    id: "emirati-satin",
    name: "Emirati Satin",
    desc: "A four-piece ensemble — flowing maxi slip dress, sleek bandeau top, open abaya and coordinating belt — tailored from lustrous Emirati satin.",
  },
];

/* ------------------------- VELVET ABAYA (real PDP copy) ------------------------- */

const velvetDesc =
  "Crafted from luxurious velvet fabric, this elegant open abaya adds depth and sophistication to any look. The fluid silhouette and soft sheen create a graceful movement, making it a refined layering piece for both everyday elegance and special occasions. Designed in a relaxed free-size fit, it drapes beautifully over the body and pairs perfectly with our Mermaid Dress for a complete, elevated ensemble.";
const velvetDetails = [
  "Style: Open Abaya",
  "Luxurious velvet fabric with soft shine",
  "Relaxed free-size silhouette",
  "Elegant fluid drape",
  "Lightweight and comfortable to wear",
  "Perfect for layering over dresses",
  "Designed to pair beautifully with the FLAYA Mermaid Dress",
  "One size",
];

const VELVET: Product[] = [
  {
    id: "black-velvet-abaya",
    name: "Black Velvet Abaya",
    category: "abayas",
    price: 599,
    badge: "new",
    collection: "velvet",
    desc: velvetDesc,
    details: [...velvetDetails.slice(0, 1), "Color: Black", ...velvetDetails.slice(1)],
    fabric: "Plush matte velvet. Dry clean only to preserve the pile and sheen.",
    colors: [variant(C.black, "black", [38962066, 18709335, 36617116], OS, "Low stock")],
    rating: 4.9,
    reviewCount: 18,
  },
  {
    id: "chocolate-velvet-abaya",
    name: "Chocolate Velvet Abaya",
    category: "abayas",
    price: 599,
    badge: "new",
    collection: "velvet",
    desc: velvetDesc,
    details: [...velvetDetails.slice(0, 1), "Color: Chocolate", ...velvetDetails.slice(1)],
    fabric: "Plush matte velvet. Dry clean only to preserve the pile and sheen.",
    colors: [variant(C.chocolate, "chocolate", [15862132, 31648340], OS)],
    rating: 4.8,
    reviewCount: 11,
  },
  {
    id: "gold-velvet-abaya",
    name: "Gold Velvet Abaya",
    category: "abayas",
    price: 599,
    collection: "velvet",
    desc: velvetDesc,
    details: [...velvetDetails.slice(0, 1), "Color: Gold", ...velvetDetails.slice(1)],
    fabric: "Plush matte velvet. Dry clean only to preserve the pile and sheen.",
    colors: [variant(C.gold, "gold", [30873274, 33195874], OS)],
    rating: 4.7,
    reviewCount: 7,
  },
];

/* ------------------------- ARMANI SILK (6 colours) ------------------------- */

const silkDesc =
  "Crafted from Armani silk — a luxurious satin celebrated for its fluid drape and refined glow. Silky-smooth to the touch, the fabric moves effortlessly with the body, creating an elegant and sophisticated silhouette. A timeless open abaya, cut for evenings that demand quiet grandeur.";
const silkColors: { key: string; pal: (typeof C)[keyof typeof C]; pool: string }[] = [
  { key: "black", pal: C.black, pool: "black" },
  { key: "brown", pal: C.brown, pool: "chocolate" },
  { key: "cherry", pal: C.cherry, pool: "black" },
  { key: "lemon", pal: C.lemon, pool: "yellow" },
  { key: "nude", pal: C.nude, pool: "nude" },
  { key: "white", pal: C.white, pool: "white" },
];

const ARMANI: Product[] = silkColors.map(({ key, pal, pool }, i) => ({
  id: `${key}-armani-silk`,
  name: `${pal.name} Armani Silk`,
  category: "abayas",
  price: 999,
  badge: i === 0 ? "bestseller" : undefined,
  collection: "armani-silk",
  desc: silkDesc,
  details: ["Style: Open Abaya", `Color: ${pal.name}`, "Armani silk satin with refined glow", "Fluid full-length drape", "Concealed front closure", "Designed and handcrafted in Dubai"],
  fabric: "100% Armani silk satin. Dry clean only.",
  colors: [variant(pal, pool, [], FULL, undefined, i * 2)],
  rating: Math.round((46 + rnd() * 4)) / 10,
  reviewCount: 6 + Math.floor(rnd() * 20),
}));

/* ------------------------- AURA SET (5 colours) ------------------------- */

const auraDesc =
  "The Aura Set — a softly sculpting two-piece with a longline tunic and fluid trouser, made to carry you from morning errands to evening majlis without a second thought. Lightweight, crease-resistant and endlessly layerable.";
const auraColors: { key: string; pal: (typeof C)[keyof typeof C]; pool: string }[] = [
  { key: "brown", pal: C.brown, pool: "chocolate" },
  { key: "black", pal: C.black, pool: "black" },
  { key: "terracotta", pal: C.terracotta, pool: "terracotta" },
  { key: "white", pal: C.white, pool: "white" },
  { key: "baby-blue", pal: C.babyBlue, pool: "babyBlue" },
];

const AURA: Product[] = auraColors.map(({ key, pal, pool }, i) => ({
  id: `aura-set-${key}`,
  name: `Aura Set — ${pal.name}`,
  category: "sets",
  price: 949,
  badge: i === 2 ? "new" : undefined,
  collection: "aura",
  desc: auraDesc,
  details: ["Two-piece set: tunic + trouser", `Color: ${pal.name}`, "Soft sculpting knit crepe", "Crease-resistant for travel", "Machine washable"],
  fabric: "Sculpting knit crepe. Machine wash cold, hang dry.",
  colors: [variant(pal, pool, [], FULL, undefined, (i + 2) * 2)],
  rating: Math.round((46 + rnd() * 4)) / 10,
  reviewCount: 5 + Math.floor(rnd() * 16),
}));

/* ------------------------- EMIRATI SATIN (6 colours, on sale) ------------------------- */

const satinSetDesc =
  "The Emirati Satin Collection reimagines timeless sophistication in a modern light. This four-piece ensemble — a flowing maxi slip dress, sleek bandeau top, open abaya and coordinating belt — is tailored from lustrous Emirati satin, prized for its fluid drape and radiant finish. Lightweight, modest and versatile, it transitions effortlessly from elevated everyday wear to evenings and special occasions.";
const satinSetColors: { key: string; pal: (typeof C)[keyof typeof C]; pool: string; price: number; off: number }[] = [
  { key: "blue", pal: C.blue, pool: "blue", price: 749, off: 25 },
  { key: "brown", pal: C.brown, pool: "chocolate", price: 749, off: 25 },
  { key: "pink", pal: C.pink, pool: "pink", price: 749, off: 25 },
  { key: "nude", pal: C.nude, pool: "nude", price: 749, off: 25 },
  { key: "white", pal: C.white, pool: "white", price: 749, off: 25 },
  { key: "black", pal: C.black, pool: "black", price: 799, off: 20 },
];

const EMIRATI: Product[] = satinSetColors.map(({ key, pal, pool, price }, i) => ({
  id: `${key}-emirati-satin-set`,
  name: `${pal.name} Emirati Satin Set`,
  category: "sets",
  price,
  compareAtPrice: 999,
  collection: "emirati-satin",
  desc: satinSetDesc,
  details: ["Four-piece set: slip dress, bandeau, open abaya, belt", `Color: ${pal.name}`, "Lustrous Emirati satin", "Radiant fluid finish", "Wear the pieces together or apart"],
  fabric: "Emirati satin (silky poly-blend). Dry clean recommended.",
  colors: [variant(pal, pool, [], FULL, undefined, (i + 1) * 2)],
  rating: Math.round((47 + rnd() * 3)) / 10,
  reviewCount: 8 + Math.floor(rnd() * 22),
}));

/* ------------------------- CAPSULE COLLECTION families ------------------------- */

interface FamSpec {
  name: string; // e.g. "Basic Tee Dress"
  category: CategoryId;
  price: number;
  colors: { key: string; pal: (typeof C)[keyof typeof C]; pool: string }[];
  desc: string;
  details: string[];
  fabric: string;
  badge?: "new" | "bestseller";
}

const fam = (s: FamSpec): Product[] =>
  s.colors.map(({ key, pal, pool }, i) => ({
    id: `${s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${key}`.replace(/-+/g, "-").replace(/^-|-$/g, ""),
    name: s.colors.length > 1 ? `${s.name} — ${pal.name}` : s.name,
    category: s.category,
    price: s.price,
    badge: i === 0 ? s.badge : undefined,
    collection: "the-capsule",
    desc: s.desc.split("{color}").join(pal.name),
    details: s.details.map((d) => d.split("{color}").join(pal.name)),
    fabric: s.fabric,
    colors: [variant(pal, pool, [], subSizes(), undefined, i * 2)],
    rating: Math.round((44 + rnd() * 6)) / 10,
    reviewCount: 4 + Math.floor(rnd() * 40),
  }));

const CAPSULE: Product[] = [
  ...fam({
    name: "Basic Tee Dress",
    category: "dresses",
    price: 449,
    badge: "bestseller",
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "white", pal: C.white, pool: "white" },
      { key: "pink", pal: C.pink, pool: "pink" },
      { key: "yellow", pal: C.yellow, pool: "yellow" },
    ],
    desc: "The everyday base of the capsule: a soft tee-weight maxi in {color} with a relaxed column cut that skims, never clings. Style it under any FLAYA overlay or wear it solo with sandals.",
    details: ["Relaxed column silhouette", "Tee-weight stretch jersey", "Colour: {color}", "Breastfeeding-friendly high crew neck", "Machine washable"],
    fabric: "Soft stretch jersey (92% viscose). Machine wash cold.",
  }),
  ...fam({
    name: "Basic Dress Sculpting Fit",
    category: "dresses",
    price: 499,
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "blue", pal: C.blue, pool: "blue" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "green", pal: C.green, pool: "green" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "white", pal: C.white, pool: "white" },
    ],
    desc: "Our sculpting-fit base dress in {color}: double-layered through the body for a smooth, held-in feel while staying fully opaque. The piece every capsule starts with.",
    details: ["Sculpting double-layer knit", "Fully opaque in every colour", "Colour: {color}", "Four-way stretch", "Sits smoothly under abayas"],
    fabric: "Sculpting double-knit. Machine wash cold, lay flat to dry.",
  }),
  ...fam({
    name: "Mermaid Dress",
    category: "dresses",
    price: 449,
    badge: "bestseller",
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "white", pal: C.white, pool: "white" },
      { key: "pink", pal: C.pink, pool: "pink" },
    ],
    desc: "A gentle mermaid flare in {color} — fitted to the knee, then released into a soft sweep. The dress we pair under every Velvet Abaya.",
    details: ["Soft mermaid flare from the knee", "Colour: {color}", "Stretch crepe with recovery", "Signature pairing for Velvet Abaya", "Full-length modest cut"],
    fabric: "Stretch crepe. Machine wash cold, hang dry.",
  }),
  ...fam({
    name: "Mermaid Sculpting Dress",
    category: "dresses",
    price: 499,
    colors: [
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "black", pal: C.black, pool: "black" },
    ],
    desc: "The mermaid silhouette with our sculpting double-knit — {color} drapes close through the body and flares softly at the hem. Evening-ready with zero effort.",
    details: ["Sculpting fit with mermaid flare", "Colour: {color}", "Double-knit opacity", "Four-way stretch", "Occasion-ready"],
    fabric: "Sculpting double-knit. Machine wash cold, lay flat to dry.",
  }),
  ...fam({
    name: "Short Cover-Up",
    category: "abayas",
    price: 399,
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "white", pal: C.white, pool: "white" },
    ],
    desc: "The cropped overlay in {color} that finishes every base dress — hip-length, open-front, with sleeves cut to move. Slip it on and the outfit is done.",
    details: ["Hip-length open cover-up", "Colour: {color}", "Featherweight crepe", "Layer over any capsule dress", "Travel-friendly"],
    fabric: "Featherweight crepe. Machine wash cold.",
  }),
  ...fam({
    name: "Stretch Abaya",
    category: "abayas",
    price: 499,
    badge: "bestseller",
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
      { key: "nude", pal: C.nude, pool: "nude" },
      { key: "gold", pal: C.gold, pool: "gold" },
    ],
    desc: "A pull-on stretch abaya in {color} — no closures, no fuss, just one clean line. The abaya you’ll keep by the door.",
    details: ["Pull-on design, no closures", "Colour: {color}", "Stretch crepe with recovery", "Side pockets", "Everyday workhorse"],
    fabric: "Stretch crepe. Machine wash cold, hang dry.",
  }),
  ...fam({
    name: "Transforming Dress",
    category: "dresses",
    price: 549,
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
    ],
    desc: "One dress, three silhouettes: tie the panels for a wrap look, knot them for draping, or let them fall as a column. The transformer of the capsule, in {color}.",
    details: ["Three wearing styles in one", "Colour: {color}", "Adjustable self-tie panels", "Sculpting bodice", "Full-length"],
    fabric: "Stretch crepe with structure. Machine wash cold.",
  }),
  ...fam({
    name: "Transforming Dress Sleeveless",
    category: "dresses",
    price: 449,
    colors: [
      { key: "black", pal: C.black, pool: "black" },
      { key: "brown", pal: C.brown, pool: "chocolate" },
      { key: "cherry", pal: C.cherry, pool: "black" },
    ],
    desc: "The sleeveless transformer in {color}, made to layer under every FLAYA overlay — same three-way styling as the original, cut for the warmest days.",
    details: ["Sleeveless layering cut", "Colour: {color}", "Three-way tie styling", "Pairs under cover-ups & abayas", "Full-length"],
    fabric: "Stretch crepe with structure. Machine wash cold.",
  }),
];

/* --------------------- signature atelier line (kept) --------------------- */

const SIGNATURE: Product[] = [
  {
    id: "aya-signature-abaya",
    name: "Aya Signature Abaya",
    category: "abayas",
    price: 890,
    badge: "bestseller",
    collection: "the-capsule",
    desc: "The abaya FLAYA is known for. Cut from fluid Japanese crepe with a softly structured shoulder and a concealed placket, the Aya falls in one clean line from collar to hem. Designed in Dubai to move between workdays, travel and evenings without missing a step.",
    fabric: "92% Japanese crepe viscose, 8% elastane. Cool hand wash, hang to dry, cool iron on reverse.",
    colors: [
      variant(C.noir, "black", [13838842, 13791306], FULL),
      variant(C.white, "white", [7814845], ["XS", "S", "M", "L"]),
      variant(C.pink, "pink", [10634555, 1698731], ["S", "M", "L"]),
      variant(C.yellow, "yellow", [8070476], ["XS", "S", "M"]),
      variant(C.graphite, "graphite", [33448124], []),
    ],
    rating: 4.9,
    reviewCount: 27,
  },
  {
    id: "noor-open-abaya",
    name: "Noor Open Abaya",
    category: "abayas",
    price: 780,
    badge: "new",
    collection: "the-capsule",
    desc: "An open-front layering abaya with an optional self-tie belt. Worn loose it drapes like a coat; belted, it becomes a dress in its own right. The piece that makes the capsule system work.",
    fabric: "100% matte crepe. Machine wash cold with like colours, hang dry, steam to finish.",
    colors: [
      variant(C.noir, "black", [32279501, 32279505], ["S", "M", "L", "XL"]),
      variant(C.deepInk, "black", [13097074], FULL),
    ],
    rating: 4.8,
    reviewCount: 12,
  },
  {
    id: "layla-evening-abaya",
    name: "Layla Evening Abaya",
    category: "abayas",
    price: 940,
    collection: "emirati-satin",
    desc: "Our occasion abaya: the same clean FLAYA line with hand-finished embellishment at the cuff that catches light only when you move. Understated from a distance, unforgettable up close.",
    fabric: "Matte crepe with hand-applied crystal cuff detailing. Dry clean only.",
    colors: [
      variant(C.noir, "black", [5498151], ["S", "M", "L"]),
      variant(C.espresso, "chocolate", [33796538], []),
    ],
    rating: 4.7,
    reviewCount: 9,
  },
  {
    id: "amara-maxi-dress",
    name: "Amara Maxi Dress",
    category: "dresses",
    price: 720,
    badge: "bestseller",
    collection: "the-capsule",
    desc: "The base layer of the capsule. A bias-cut maxi with a high neckline and bracelet-length sleeves, engineered to sit perfectly under every FLAYA overlay — and to hold its own worn alone.",
    fabric: "68% viscose, 27% Tencel™, 5% elastane. Machine wash cold, hang dry.",
    colors: [
      variant(C.sand, "sand", [30345140, 4235408], FULL),
      variant(C.butter, "butter", [39398509, 39398506], ["S", "M", "L"]),
    ],
    rating: 4.9,
    reviewCount: 34,
  },
  {
    id: "selma-column-dress",
    name: "Selma Column Dress",
    category: "dresses",
    price: 860,
    badge: "new",
    collection: "the-capsule",
    desc: "A floor-skimming column in double-faced crepe with a hidden back zip and side vents for movement. The dress that answers every ‘what do I wear’ message in the group chat.",
    fabric: "Double-faced crepe, fully lined. Dry clean recommended.",
    colors: [
      variant(C.ivory, "ivory", [13361321, 13657440], ["XS", "S", "M", "L"]),
      variant(C.sahara, "sahara", [36726774, 33042614], ["S", "M", "L", "XL"]),
    ],
    rating: 4.8,
    reviewCount: 15,
  },
  {
    id: "dalia-wrap-dress",
    name: "Dalia Wrap Dress",
    category: "dresses",
    price: 690,
    collection: "the-capsule",
    desc: "A true wrap silhouette that adjusts to you — tie it high, low, front or back. Satin-backed crepe keeps the drape liquid and the finish matte.",
    fabric: "Satin-backed crepe. Gentle machine wash, hang dry away from direct sun.",
    colors: [
      variant(C.camel, "camel", [4235399, 4235408], ["S", "M", "L", "XL"]),
      variant(C.champagne, "champagne", [18161522], []),
    ],
    rating: 4.6,
    reviewCount: 11,
  },
  {
    id: "yasmin-coord-set",
    name: "Yasmin Co-ord Set",
    category: "sets",
    price: 980,
    badge: "bestseller",
    collection: "the-capsule",
    desc: "A tailored two-piece — longline tunic and wide trouser — that reads polished together and multiplies your wardrobe apart. The tunic slips under every FLAYA abaya.",
    fabric: "Crepe suiting with a soft hand. Machine wash cold, cool iron.",
    colors: [
      variant(C.sandstone, "sandstone", [17907026, 17907027], FULL),
      variant(C.ivory, "ivory", [31132019], ["S", "M", "L"]),
    ],
    rating: 4.9,
    reviewCount: 21,
  },
  {
    id: "rania-studio-set",
    name: "Rania Studio Set",
    category: "sets",
    price: 1050,
    badge: "new",
    collection: "the-capsule",
    desc: "Our sculptural set — an architectural top with a column skirt. Minimal hardware, maximum presence. Designed for the days that run from studio to dinner.",
    fabric: "Structured ponte knit with stretch. Hand wash cold, lay flat to dry.",
    colors: [
      variant(C.softWhite, "softWhite", [10288352], ["S", "M", "L"]),
      variant(C.noir, "black", [38894197], []),
    ],
    rating: 4.7,
    reviewCount: 8,
  },
  {
    id: "mira-trench-coat",
    name: "Mira Trench Coat",
    category: "outerwear",
    price: 1250,
    badge: "bestseller",
    collection: "the-capsule",
    desc: "A fluid trench with the weight removed — no heavy lining, no bulk, just a clean belt and a collar that sits exactly where it should. Made for Dubai winters and every airport in between.",
    fabric: "Water-resistant bonded cotton blend. Machine wash cold, hang dry.",
    colors: [
      variant(C.camel, "camel", [30721037, 7760026], FULL),
      variant(C.oat, "oat", [7682077, 7760027], ["S", "M", "L"]),
      variant(C.stone, "stone", [7682026], ["M", "L", "XL"]),
    ],
    rating: 4.9,
    reviewCount: 19,
  },
  {
    id: "sana-oversized-blazer",
    name: "Sana Oversized Blazer",
    category: "outerwear",
    price: 1120,
    collection: "the-capsule",
    desc: "Borrowed-from-the-tailors proportion with a softened shoulder so it layers cleanly over abayas and dresses alike. One button, no fuss.",
    fabric: "Wool-touch crepe suiting. Dry clean recommended.",
    colors: [
      variant(C.citySand, "citySand", [27869836], ["S", "M", "L"]),
      variant(C.sky, "sky", [6702631], ["XS", "S", "M", "L"]),
      variant(C.noir, "black", [8958834], ["M", "L", "XL"]),
    ],
    rating: 4.8,
    reviewCount: 7,
  },
];

/* --------------------- atelier filler (keeping the catalogue deep) --------------------- */

const FIRST = ["Zahra","Haya","Dana","Reem","Farah","Leen","Mariam","Salma","Nadia","Inaya","Soraya","Amani","Ghaya","Mahra","Noura","Shamma","Tala","Warda","Layan","Hessa","Meera","Asma","Budour","Dalal","Eman","Ghala","Hind","Joud","Kenda","Lulwa","Moza","Afra","Alanoud","Muneera","Roudha","Salama","Shaikha"];
const STYLE: Record<CategoryId, string[]> = {
  abayas: ["Kimono Abaya", "Pleated Abaya", "Embellished Abaya", "Belted Abaya", "Cape Abaya", "Bisht Abaya", "Sculpted Abaya", "Draped Abaya"],
  dresses: ["Maxi Dress", "Kaftan Dress", "Tiered Dress", "A-Line Dress", "Bias Dress", "Panelled Dress"],
  sets: ["Tailored Set", "Studio Set", "Skirt Set"],
  outerwear: ["Duster Coat", "Wool Cape", "Belted Coat", "Overlay Coat"],
};
const GEN_PALETTES = [C.noir, C.softOnyx, C.graphite, C.espresso, C.sand, C.camel, C.oat, C.ivory, C.dustyRose, C.sage, C.sky, C.olive, C.pink, C.yellow, C.babyBlue, C.terracotta, C.cherry, C.white, C.gold];
const POOLKEY: Record<string, string> = {};
Object.keys(C).forEach((k) => (POOLKEY[k] = k));

function generatedLine(): Product[] {
  const used = new Set<string>();
  const out: Product[] = [];
  const plan: { category: CategoryId; count: number; min: number; max: number }[] = [
    { category: "abayas", count: 16, min: 690, max: 1490 },
    { category: "dresses", count: 8, min: 590, max: 1290 },
    { category: "sets", count: 5, min: 890, max: 1390 },
    { category: "outerwear", count: 5, min: 990, max: 1690 },
  ];
  const DESC: Record<CategoryId, string> = {
    abayas: "Cut from fluid Japanese crepe with a softly structured shoulder, falling in one uninterrupted line from collar to hem. Designed and handcrafted in Dubai.",
    dresses: "A bias-cut silhouette that skims rather than clings, finished by hand at the seam. From morning majlis to midnight, it keeps its line and its calm.",
    sets: "Softly structured tailoring with a relaxed modest cut. Wear the pieces together for impact, separately for range.",
    outerwear: "A fluid outer layer made for Dubai winters and every airport in between. Packable, crushable, always composed.",
  };
  plan.forEach(({ category, count, min, max }) => {
    for (let i = 0; i < count; i++) {
      const first = FIRST[Math.floor(rnd() * FIRST.length)];
      const style = STYLE[category][Math.floor(rnd() * STYLE[category].length)];
      let name = `${first} ${style}`;
      let n = 2;
      while (used.has(name)) name = `${first} ${style} ${["II", "III", "IV"][n++ - 2] ?? n}`;
      used.add(name);
      const colorCount = 1 + Math.floor(rnd() * 3);
      const start = Math.floor(rnd() * GEN_PALETTES.length);
      const colors: ColorVariant[] = Array.from({ length: colorCount }, (_, ci) => {
        const pal = GEN_PALETTES[(start + ci * 4) % GEN_PALETTES.length];
        const key = Object.keys(C).find((k) => C[k as keyof typeof C] === pal) ?? "black";
        return variant(pal, POOLKEY[key], [], rnd() < 0.12 ? [] : subSizes(), undefined, start + ci * 4 + i);
      });
      const price = Math.round((min + rnd() * (max - min)) / 10) * 10;
      out.push({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        category,
        price,
        collection: ["the-capsule", "aura", "emirati-satin"][Math.floor(rnd() * 3)],
        desc: DESC[category],
        fabric: "Premium crepe suiting. Machine wash cold, hang dry.",
        colors,
        rating: Math.round((44 + rnd() * 6)) / 10,
        reviewCount: 4 + Math.floor(rnd() * 40),
      });
    }
  });
  return out;
}

export const PRODUCTS: Product[] = [...SIGNATURE, ...VELVET, ...ARMANI, ...AURA, ...EMIRATI, ...CAPSULE, ...generatedLine()];

/* Badge spread for generated items */
PRODUCTS.forEach((p, i) => {
  if (p.badge) return;
  if (p.id.startsWith("gen-")) return;
  if (i % 9 === 2) p.badge = "new";
  else if (i % 13 === 7) p.badge = "bestseller";
});

/* Synthetic release dates so date sorting works in the prototype */
const DAY = 86400000;
const DATE_BASE = Date.UTC(2025, 8, 15); // 15 Sep 2025
PRODUCTS.forEach((p, i) => {
  p.addedAt = DATE_BASE + i * 3 * DAY + (p.badge === "new" ? 210 * DAY : 0);
});

/* Complete-the-look wiring */
PRODUCTS.forEach((p, i) => {
  if (i % 2 === 0) {
    const others = PRODUCTS.filter((x) => x.id !== p.id);
    const items = [others[(i + 3) % others.length], others[(i + 11) % others.length], others[(i + 23) % others.length]];
    p.look = {
      image: px([4235408, 36178530, 31132019, 3989688, 9968534][i % 5], 1000, 1300),
      caption: `Capsule styling — Look ${String((i % 9) + 1).padStart(2, "0")}`,
      itemIds: items.map((x) => x.id),
    };
  }
});

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

const countOf = (c: CategoryId) => PRODUCTS.filter((p) => p.category === c).length;

export interface Category {
  id: string;
  name: string;
  image: string;
  note: string;
}

export const CATEGORIES: Category[] = [
  { id: "abayas", name: "Abayas", image: px(32279501, 800, 1100), note: `${countOf("abayas")} styles` },
  { id: "dresses", name: "Dresses", image: px(30345140, 800, 1100), note: `${countOf("dresses")} styles` },
  { id: "sets", name: "Co-ord Sets", image: px(17907026, 800, 1100), note: `${countOf("sets")} styles` },
  { id: "outerwear", name: "Outerwear", image: px(12349052, 800, 1100), note: `${countOf("outerwear")} styles` },
  { id: "new", name: "New Collection", image: px(36617116, 800, 1100), note: "SS26 has arrived" },
  { id: "best-sellers", name: "Best Sellers", image: px(13097074, 800, 1100), note: "Most loved" },
];

/* --------------------- hero slideshow (16 frames, real pieces) --------------------- */

export interface HeroSlide {
  id: number;
  tag: string;
  productId?: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  { id: 13838842, tag: "Black Velvet Abaya", productId: "black-velvet-abaya" },
  { id: 30873274, tag: "Gold Velvet Abaya", productId: "gold-velvet-abaya" },
  { id: 10634555, tag: "Pink Emirati Satin Set", productId: "pink-emirati-satin-set" },
  { id: 32279501, tag: "Noor Open Abaya — Noir", productId: "noor-open-abaya" },
  { id: 8748722, tag: "White Armani Silk", productId: "white-armani-silk" },
  { id: 8070476, tag: "Yellow Basic Tee Dress", productId: "basic-tee-dress-yellow" },
  { id: 13097074, tag: "The SS26 Edit" },
  { id: 30345140, tag: "Amara Maxi Dress — Sand", productId: "amara-maxi-dress" },
  { id: 15862132, tag: "Chocolate Velvet Abaya", productId: "chocolate-velvet-abaya" },
  { id: 19537362, tag: "Aya Signature — Pink", productId: "aya-signature-abaya" },
  { id: 16269792, tag: "Cherry Armani Silk", productId: "cherry-armani-silk" },
  { id: 5498151, tag: "Layla Evening Abaya", productId: "layla-evening-abaya" },
  { id: 37346213, tag: "Aura Set — Terracotta", productId: "aura-set-terracotta" },
  { id: 13657440, tag: "Selma Column Dress — Ivory", productId: "selma-column-dress" },
  { id: 7814845, tag: "Aya Signature — White", productId: "aya-signature-abaya" },
  { id: 19816456, tag: "Emirati Satin — Nude", productId: "nude-emirati-satin-set" },
];

export const heroImg = (id: number, w: number, h: number) => px(id, w, h);

export const EDITORIAL = {
  main: px(8070530, 1100, 1400),
  secondary: px(3989688, 800, 1000),
  texture: px(36726412, 900, 1100),
};

/* ---------------- Reviews (stage one: shared brand reviews) ---------------- */

export interface Review {
  id: string;
  initials: string;
  avatar?: string; // real customer portrait (permission granted on live site)
  text: string;
  context: string;
  rating: number;
  source: "Website" | "Instagram";
}

const av = (id: number) => px(id, 200, 200);

export const REVIEWS: Review[] = [
  { id: "r1", initials: "R.A.", avatar: av(7717254), text: "The Black Velvet Abaya is the piece I reach for every single week. The sheen is subtle, the drape is everything.", context: "Black Velvet Abaya", rating: 5, source: "Website" },
  { id: "r2", initials: "M.K.", avatar: av(17888489), text: "Ordered on Tuesday evening in Dubai and it arrived Wednesday morning. The packaging felt like receiving a gift.", context: "Next-day delivery", rating: 5, source: "Website" },
  { id: "r3", initials: "S.H.", avatar: av(6497114), text: "I styled the Mermaid Dress under the Chocolate Velvet Abaya for a wedding — three people asked where it was from before dinner.", context: "Chocolate Velvet Abaya", rating: 5, source: "Instagram" },
  { id: "r4", initials: "N.A.", avatar: av(34930167), text: "Finally a brand that understands modest cuts without compromising on design. The Emirati Satin set feels like liquid.", context: "Emirati Satin Set", rating: 5, source: "Website" },
  { id: "r5", initials: "L.M.", avatar: av(27603433), text: "The capsule idea is genius. One base dress, three overlays, a week of looks. Worth every dirham.", context: "Capsule Collection", rating: 5, source: "Instagram" },
  { id: "r6", initials: "H.Y.", avatar: av(35132361), text: "Needed a size exchange and it was handled over WhatsApp in minutes. Zero stress, genuinely kind service.", context: "Customer care", rating: 5, source: "Website" },
  { id: "r7", initials: "D.S.", avatar: av(29283906), text: "The Armani Silk drapes like proper couture. Quality is exceptional at this price point — sizing ran true to the guide.", context: "White Armani Silk", rating: 4, source: "Website" },
  { id: "r8", initials: "A.T.", avatar: av(19537362), text: "Wore the Basic Tee Dress through a full Dubai summer day and stayed cool. The fabric is a dream.", context: "Basic Tee Dress", rating: 5, source: "Instagram" },
  { id: "r9", initials: "F.J.", avatar: av(6497112), text: "The colour swatches on the site are exactly what arrives. No surprises, just quiet luxury.", context: "Colour & fit", rating: 5, source: "Website" },
  { id: "r10", initials: "B.N.", avatar: av(32113594), text: "I’ve bought abayas for years and this is the first that feels designed, not just made. The shoulder sits perfectly.", context: "Aura Set — Black", rating: 5, source: "Website" },
  { id: "r11", initials: "K.R.", avatar: av(30698026), text: "Gift-wrapped, hand-written note, and a garment bag I’ll actually reuse. This is how premium should feel.", context: "Unboxing", rating: 5, source: "Instagram" },
  { id: "r12", initials: "T.W.", avatar: av(6071508), text: "The Aura set took me from a board meeting to a gallery opening. Two minutes to change the mood, same outfit.", context: "Aura Set", rating: 5, source: "Website" },
  { id: "r13", initials: "G.M.", avatar: av(10634555), text: "Sizing help over WhatsApp was spot on — sent my height, got a perfect XS recommendation.", context: "Sizing help", rating: 4, source: "Website" },
  { id: "r14", initials: "P.D.", avatar: av(19106363), text: "The Transforming Dress photographs even better in person. I tie it differently every time — endless compliments.", context: "Transforming Dress", rating: 5, source: "Instagram" },
  { id: "r15", initials: "E.S.", avatar: av(10288366), text: "International shipping was faster than most local stores here. Tracked the whole way, arrived beautifully pressed.", context: "Worldwide shipping", rating: 5, source: "Website" },
];

/* ------------------------------- Community ------------------------------- */

export interface CommunityPost {
  image: string;
  handle: string;
  productId?: string;
}

export const COMMUNITY: CommunityPost[] = [
  { image: px(19106363, 700, 880), handle: "@amira.wears", productId: "aya-signature-abaya" },
  { image: px(6071508, 700, 880), handle: "@themodest.edit", productId: "yasmin-coord-set" },
  { image: px(36129558, 700, 880), handle: "@colour.theory.ae" },
  { image: px(10288366, 700, 880), handle: "@studio.white", productId: "rania-studio-set" },
  { image: px(18543086, 700, 880), handle: "@muse.in.neutrals" },
  { image: px(9968534, 700, 880), handle: "@autumn.diary", productId: "mira-trench-coat" },
];

/* ---------------- Listing filters ---------------- */

export interface ColorFilter {
  label: string;
  hex: string;
  members: string[]; // colour names belonging to this group
}

export const COLOR_FILTERS: ColorFilter[] = [
  { label: "Black", hex: "#1b1917", members: ["Black", "Noir", "Graphite", "Soft Onyx", "Deep Ink"] },
  { label: "Brown", hex: "#6b4a35", members: ["Brown", "Chocolate", "Espresso", "Cocoa"] },
  { label: "Beige", hex: "#cbb69c", members: ["Sand", "Camel", "Oat", "Sahara", "City Sand", "Sandstone", "Champagne", "Butter"] },
  { label: "Nude", hex: "#d9bfa5", members: ["Nude"] },
  { label: "White", hex: "#f2efe9", members: ["White", "Ivory", "Soft White"] },
  { label: "Red", hex: "#6e2434", members: ["Cherry"] },
  { label: "Pink", hex: "#e3b7c4", members: ["Pink", "Dusty Rose"] },
  { label: "Yellow", hex: "#e2c94f", members: ["Yellow", "Lemon", "Gold"] },
  { label: "Blue", hex: "#4a6d8c", members: ["Blue", "Baby Blue", "Sky"] },
  { label: "Green", hex: "#5c6b54", members: ["Green", "Sage", "Olive"] },
  { label: "Terracotta", hex: "#b5674a", members: ["Terracotta"] },
];

export const SIZE_FILTERS: { label: string; value: Size | "2XL"; disabled?: boolean }[] = [
  { label: "XS", value: "XS" },
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "2XL", value: "2XL", disabled: true },
  { label: "One size", value: "OS" },
];

export const CATEGORY_FILTERS: { id: CategoryId; label: string }[] = [
  { id: "abayas", label: "Abayas" },
  { id: "dresses", label: "Dresses" },
  { id: "sets", label: "Co-ord Sets" },
  { id: "outerwear", label: "Outerwear" },
];

export type SortKey =
  | "featured"
  | "relevant"
  | "best-selling"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "date-asc"
  | "date-desc";

export const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "relevant", label: "Most relevant" },
  { id: "best-selling", label: "Best selling" },
  { id: "name-asc", label: "Alphabetically, A–Z" },
  { id: "name-desc", label: "Alphabetically, Z–A" },
  { id: "price-asc", label: "Price, low to high" },
  { id: "price-desc", label: "Price, high to low" },
  { id: "date-asc", label: "Date, old to new" },
  { id: "date-desc", label: "Date, new to old" },
];

/* ---------------- Size guide ---------------- */

export const SIZE_GUIDE: { size: Size; bust: number; waist: number; hip: number; length: number }[] = [
  { size: "XS", bust: 82, waist: 64, hip: 90, length: 138 },
  { size: "S", bust: 88, waist: 70, hip: 96, length: 140 },
  { size: "M", bust: 94, waist: 76, hip: 102, length: 142 },
  { size: "L", bust: 100, waist: 82, hip: 108, length: 144 },
  { size: "XL", bust: 108, waist: 90, hip: 116, length: 146 },
];
