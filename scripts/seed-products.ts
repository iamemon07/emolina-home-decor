/**
 * Demo catalogue: 3 products per category with illustrated placeholder images from /public/demo.
 * Replace them with real products/photos in the admin panel when you're ready.
 * Safe to re-run — products are matched by slug and skipped if they exist.
 *
 *   npm run seed:products
 */
import mongoose from "mongoose";
import { Category } from "../src/models/Category";
import { Product } from "../src/models/Product";

type Seed = {
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  price: number;
  discountPercent?: number;
  costPrice: number;
  /** [option name, stock] — a single "Standard" option hides the picker on the storefront. */
  options: [string, number][];
  colors: string[];
  material: string;
  dimensions: string;
  care: string;
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  soldCount?: number;
};

const CARE_CERAMIC = "Wipe with a soft, damp cloth.\nAvoid abrasive cleaners and sudden temperature changes.\nUse a liner or inner pot for fresh flowers and live plants.";
const CARE_WOOD = "Dust with a soft, dry cloth.\nKeep away from direct sunlight, heat and moisture.\nDo not use water or chemical sprays.";
const CARE_METAL = "Wipe with a dry, lint-free cloth.\nPolish gently with a brass/metal cleaner when needed.\nKeep dry to prevent tarnish.";
const CARE_TEXTILE = "Remove the cover and wash gently in cold water.\nDo not bleach. Dry in shade.\nIron on low heat on the reverse side.";
const CARE_GLASS = "Clean with glass cleaner and a microfibre cloth.\nHandle with care; hang on a secure hook or anchor.";
const CARE_CANDLE = "Trim the wick to 5 mm before every burn.\nBurn for 2–3 hours at a time for an even melt.\nNever leave a burning candle unattended.";

const STD = (stock: number): [string, number][] => [["Standard", stock]];

const CATALOGUE: Record<string, Seed[]> = {
  "vases-planters": [
    {
      name: "Terracotta Ribbed Ceramic Vase",
      sku: "EM-VAS-001",
      shortDescription: "A hand-glazed ribbed vase in warm terracotta — beautiful with dried pampas or on its own.",
      description:
        "Thrown and glazed by hand, this ribbed vase brings earthy texture to shelves, consoles and dining tables.\n\nThe matte terracotta finish pairs perfectly with dried flowers, pampas grass or a single green stem. Each piece has small natural variations that make it one of a kind.",
      price: 1850,
      discountPercent: 10,
      costPrice: 850,
      options: [["Small", 8], ["Medium", 10], ["Large", 4]],
      colors: ["Terracotta", "Matte White"],
      material: "Hand-glazed Ceramic",
      dimensions: "Small H 18 cm · Medium H 26 cm · Large H 34 cm",
      care: CARE_CERAMIC,
      tags: ["vase", "ceramic", "boho", "living room", "gift"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 52,
    },
    {
      name: "Sage Speckle Planter with Stand",
      sku: "EM-VAS-002",
      shortDescription: "A speckled stoneware planter on a slim wooden stand — lifts your favourite plant into view.",
      description:
        "A soft sage planter with a hand-speckled glaze, set on a mid-century style mango-wood stand.\n\nIncludes a drainage hole and saucer. Perfect for snake plants, monsteras and ZZ plants in living rooms and bedrooms.",
      price: 2650,
      costPrice: 1300,
      options: [["Medium", 6], ["Large", 3]],
      colors: ["Sage"],
      material: "Stoneware & Mango Wood",
      dimensions: "Medium Ø 20 cm · Large Ø 26 cm (stand H 40 cm)",
      care: CARE_CERAMIC,
      tags: ["planter", "indoor plants", "stand", "living room"],
      isNewArrival: true,
      soldCount: 18,
    },
    {
      name: "Clay Bud Vase Trio",
      sku: "EM-VAS-003",
      shortDescription: "Three petite bud vases in earthy tones — made for single stems and windowsills.",
      description:
        "A set of three mini vases in different shapes and complementary earthy glazes.\n\nGroup them together on a windowsill or scatter them along a dining table for an effortless centrepiece.",
      price: 1250,
      discountPercent: 15,
      costPrice: 520,
      options: STD(15),
      colors: ["Earth Mix"],
      material: "Glazed Ceramic",
      dimensions: "H 10–14 cm each",
      care: CARE_CERAMIC,
      tags: ["bud vase", "set", "dining", "gift"],
      isBestSeller: true,
      soldCount: 37,
    },
  ],
  "wall-decor": [
    {
      name: "Abstract Earth Tones Framed Print Set",
      sku: "EM-WAL-001",
      shortDescription: "A gallery-ready set of three abstract prints in soft earth tones, framed in natural wood.",
      description:
        "Three coordinating abstract prints in clay, sage and sand — designed to hang together as a gallery wall.\n\nPrinted on archival matte paper and framed in solid wood with a shatter-resistant front. Hanging hooks pre-installed.",
      price: 3950,
      discountPercent: 10,
      costPrice: 1900,
      options: [["A4 (set of 3)", 6], ["A3 (set of 3)", 4]],
      colors: ["Natural Wood", "Black"],
      material: "Archival Paper, Solid Wood Frame",
      dimensions: "A4 21 × 30 cm · A3 30 × 42 cm (each frame)",
      care: CARE_WOOD,
      tags: ["wall art", "frames", "gallery wall", "living room"],
      isNewArrival: true,
      isFeatured: true,
      soldCount: 24,
    },
    {
      name: "Handwoven Macramé Wall Hanging",
      sku: "EM-WAL-002",
      shortDescription: "Soft cotton macramé on a driftwood dowel — instant warmth for bedrooms and nooks.",
      description:
        "Knotted by hand from soft, undyed cotton rope and hung from a natural driftwood dowel.\n\nAdds texture above a bed, sofa or reading corner.",
      price: 1650,
      costPrice: 700,
      options: STD(9),
      colors: ["Natural"],
      material: "Cotton Rope, Driftwood",
      dimensions: "W 50 cm × L 80 cm",
      care: "Dust gently or shake out.\nSpot clean with a damp cloth; do not machine wash.",
      tags: ["macrame", "boho", "bedroom", "handmade"],
      soldCount: 15,
    },
    {
      name: "Rattan Sunburst Wall Accent",
      sku: "EM-WAL-003",
      shortDescription: "A handwoven rattan sunburst that makes any wall feel bright and breezy.",
      description: "Woven by artisans from natural rattan cane. Lightweight and easy to hang on a single nail.",
      price: 2250,
      discountPercent: 20,
      costPrice: 950,
      options: [["Ø 40 cm", 5], ["Ø 60 cm", 3]],
      colors: ["Natural"],
      material: "Natural Rattan",
      dimensions: "Ø 40 cm or Ø 60 cm",
      care: CARE_WOOD,
      tags: ["rattan", "wall accent", "boho", "entryway"],
      isBestSeller: true,
      soldCount: 29,
    },
  ],
  lighting: [
    {
      name: "Linen Shade Ceramic Table Lamp",
      sku: "EM-LIT-001",
      shortDescription: "A sculpted ceramic base with a soft linen shade — calm, warm light for bedside and console.",
      description:
        "A rounded ceramic base topped with a tapered natural-linen shade that diffuses a soft, warm glow.\n\nE27 holder, 1.5 m fabric cord with inline switch. Bulb not included (we recommend a 2700K warm LED).",
      price: 4250,
      discountPercent: 10,
      costPrice: 2100,
      options: STD(7),
      colors: ["Olive", "Clay", "Ivory"],
      material: "Ceramic Base, Linen Shade",
      dimensions: "H 48 cm · Shade Ø 30 cm",
      care: "Unplug before cleaning.\nDust the shade with a soft brush; wipe the base with a dry cloth.",
      tags: ["table lamp", "bedside", "lighting", "warm light"],
      isNewArrival: true,
      isBestSeller: true,
      isFeatured: true,
      soldCount: 33,
    },
    {
      name: "Brass Lantern Candle Holder",
      sku: "EM-LIT-002",
      shortDescription: "An antique-brass lantern with glass panels — beautiful indoors, on balconies and for festive nights.",
      description: "Holds a pillar candle or LED string lights. Glass panels protect the flame from breezes.",
      price: 2450,
      costPrice: 1150,
      options: [["Small", 6], ["Large", 4]],
      colors: ["Antique Brass"],
      material: "Metal & Glass",
      dimensions: "Small H 25 cm · Large H 38 cm",
      care: CARE_METAL,
      tags: ["lantern", "candle holder", "balcony", "festive"],
      soldCount: 12,
    },
    {
      name: "Woven Rattan Pendant Shade",
      sku: "EM-LIT-003",
      shortDescription: "A handwoven rattan pendant that casts beautiful patterned light across the room.",
      description: "Fits a standard E27 ceiling holder. Easy to install over a dining table or in a reading corner.",
      price: 3150,
      costPrice: 1450,
      options: [["Ø 30 cm", 5], ["Ø 45 cm", 3]],
      colors: ["Natural"],
      material: "Natural Rattan",
      dimensions: "Ø 30 cm or Ø 45 cm",
      care: CARE_WOOD,
      tags: ["pendant", "ceiling light", "rattan", "dining"],
      isNewArrival: true,
      soldCount: 9,
    },
  ],
  "cushions-throws": [
    {
      name: "Textured Bouclé Cushion Cover",
      sku: "EM-CUS-001",
      shortDescription: "Soft, nubby bouclé in calm neutrals — the easiest way to refresh your sofa.",
      description: "A cosy bouclé cover with a hidden zip. Insert not included.\n\nMix and match colours for a layered, lived-in look.",
      price: 950,
      discountPercent: 10,
      costPrice: 380,
      options: [['16" × 16"', 12], ['18" × 18"', 15], ['20" × 20"', 8]],
      colors: ["Oat", "Sage", "Terracotta"],
      material: "Polyester Bouclé",
      dimensions: '16", 18" or 20" square',
      care: CARE_TEXTILE,
      tags: ["cushion", "sofa", "boucle", "living room"],
      isBestSeller: true,
      soldCount: 64,
    },
    {
      name: "Handloom Cotton Throw Blanket",
      sku: "EM-CUS-002",
      shortDescription: "A soft handloom throw with tasselled edges — drape it over sofas, beds and armchairs.",
      description: "Woven on traditional handlooms from breathable cotton. Lightweight enough for every season.",
      price: 2350,
      costPrice: 1100,
      options: STD(10),
      colors: ["Ivory & Rust", "Olive Stripe"],
      material: "100% Handloom Cotton",
      dimensions: "130 × 170 cm",
      care: CARE_TEXTILE,
      tags: ["throw", "blanket", "handloom", "bedroom"],
      isNewArrival: true,
      soldCount: 17,
    },
    {
      name: "Block-Print Cushion Cover Set of 2",
      sku: "EM-CUS-003",
      shortDescription: "Hand block-printed cotton covers with a timeless floral motif.",
      description: "Each cover is printed by hand, so every set is slightly unique. Hidden zip, insert not included.",
      price: 1450,
      discountPercent: 15,
      costPrice: 600,
      options: [['16" × 16"', 8], ['18" × 18"', 8]],
      colors: ["Indigo", "Clay"],
      material: "Cotton",
      dimensions: '16" or 18" square',
      care: CARE_TEXTILE,
      tags: ["block print", "cushion", "set", "handmade"],
      soldCount: 22,
    },
  ],
  tableware: [
    {
      name: "Stoneware Dinner Plate Set of 4",
      sku: "EM-TAB-001",
      shortDescription: "Reactive-glaze stoneware plates — rustic, sturdy and made for everyday dining.",
      description: "Each plate has a unique reactive glaze. Microwave and dishwasher safe.",
      price: 2850,
      costPrice: 1350,
      options: STD(10),
      colors: ["Speckled Oat", "Forest Green"],
      material: "Stoneware",
      dimensions: "Ø 27 cm each",
      care: "Dishwasher and microwave safe.\nAvoid sudden temperature changes.",
      tags: ["plates", "dinnerware", "dining", "set"],
      isBestSeller: true,
      soldCount: 26,
    },
    {
      name: "Hand-Painted Ceramic Mug",
      sku: "EM-TAB-002",
      shortDescription: "A chunky hand-painted mug for slow mornings and evening chai.",
      description: "Holds 350 ml. Dishwasher safe; hand-washing keeps the painted details vibrant for longer.",
      price: 650,
      costPrice: 260,
      options: [["Single", 20], ["Set of 2", 10]],
      colors: ["Olive", "Terracotta", "Cream"],
      material: "Ceramic",
      dimensions: "H 10 cm · 350 ml",
      care: CARE_CERAMIC,
      tags: ["mug", "coffee", "tea", "gift"],
      isNewArrival: true,
      soldCount: 41,
    },
    {
      name: "Acacia Wood Serving Board",
      sku: "EM-TAB-003",
      shortDescription: "A solid acacia board for serving, styling and hosting.",
      description: "Rich wood grain with a leather hanging loop. Food safe, finished with natural oil.",
      price: 1550,
      discountPercent: 10,
      costPrice: 680,
      options: [["Medium", 8], ["Large", 5]],
      colors: ["Natural Acacia"],
      material: "Acacia Wood",
      dimensions: "Medium 35 × 20 cm · Large 45 × 25 cm",
      care: "Hand wash only and dry immediately.\nOil occasionally with food-safe mineral oil.",
      tags: ["serving board", "kitchen", "hosting", "wood"],
      soldCount: 14,
    },
  ],
  "candles-fragrance": [
    {
      name: "Sandalwood & Amber Soy Candle",
      sku: "EM-CAN-001",
      shortDescription: "A warm, woody soy candle in a reusable ceramic jar — about 40 hours of burn time.",
      description: "Hand-poured soy wax with a cotton wick. Notes of sandalwood, amber and a hint of vanilla.",
      price: 1250,
      costPrice: 520,
      options: [["Medium (200 g)", 14], ["Large (350 g)", 8]],
      colors: ["Clay Jar", "Olive Jar"],
      material: "Soy Wax, Ceramic Jar",
      dimensions: "Medium H 9 cm · Large H 12 cm",
      care: CARE_CANDLE,
      tags: ["candle", "scented", "gift", "bedroom"],
      isBestSeller: true,
      isFeatured: true,
      soldCount: 58,
    },
    {
      name: "Jasmine Reed Diffuser",
      sku: "EM-CAN-002",
      shortDescription: "A long-lasting reed diffuser with a fresh jasmine and white tea scent.",
      description: "Lasts 8–10 weeks. Flip the reeds once a week to refresh the fragrance.",
      price: 1450,
      discountPercent: 10,
      costPrice: 600,
      options: STD(12),
      colors: ["Amber Glass"],
      material: "Glass Bottle, Rattan Reeds",
      dimensions: "100 ml · H 18 cm with reeds",
      care: "Keep away from children and pets.\nPlace on a protected surface; oils may mark wood.",
      tags: ["diffuser", "fragrance", "living room", "gift"],
      isNewArrival: true,
      soldCount: 20,
    },
    {
      name: "Marble Pillar Candle Holder Set",
      sku: "EM-CAN-003",
      shortDescription: "Two solid marble pillar holders — elegant on dining tables and mantels.",
      description: "Cut from solid marble with a felt base to protect your surfaces. Candles not included.",
      price: 1950,
      costPrice: 900,
      options: STD(6),
      colors: ["White Marble", "Green Marble"],
      material: "Marble",
      dimensions: "H 8 cm & 12 cm · Ø 9 cm",
      care: "Wipe with a damp cloth.\nAvoid acidic cleaners which can etch marble.",
      tags: ["candle holder", "marble", "dining", "set"],
      soldCount: 7,
    },
  ],
  mirrors: [
    {
      name: "Arched Wooden Frame Mirror",
      sku: "EM-MIR-001",
      shortDescription: "A tall arched mirror in a solid wood frame — opens up hallways and bedrooms.",
      description: "Hang on the wall or lean against it. Comes with sturdy D-rings and wall anchors.",
      price: 6950,
      discountPercent: 10,
      costPrice: 3600,
      options: [["60 × 90 cm", 4], ["60 × 150 cm", 2]],
      colors: ["Natural Oak", "Walnut"],
      material: "Solid Wood, Glass",
      dimensions: "60 × 90 cm or 60 × 150 cm",
      care: CARE_GLASS,
      tags: ["mirror", "arched", "bedroom", "entryway"],
      isNewArrival: true,
      isFeatured: true,
      soldCount: 11,
    },
    {
      name: "Round Brass Rim Wall Mirror",
      sku: "EM-MIR-002",
      shortDescription: "A slim brass-rimmed round mirror — timeless above a console or vanity.",
      description: "Thin metal rim in a brushed-brass finish with a hanging bracket.",
      price: 3850,
      costPrice: 1800,
      options: [["Ø 50 cm", 6], ["Ø 70 cm", 3]],
      colors: ["Brushed Brass", "Matte Black"],
      material: "Metal Frame, Glass",
      dimensions: "Ø 50 cm or Ø 70 cm",
      care: CARE_GLASS,
      tags: ["mirror", "round", "brass", "bathroom"],
      isBestSeller: true,
      soldCount: 19,
    },
    {
      name: "Rattan Scalloped Mirror",
      sku: "EM-MIR-003",
      shortDescription: "A playful scalloped rattan frame for a breezy, coastal feel.",
      description: "Handwoven rattan frame around a round mirror. Lightweight and easy to hang.",
      price: 2950,
      discountPercent: 15,
      costPrice: 1300,
      options: STD(5),
      colors: ["Natural"],
      material: "Rattan, Glass",
      dimensions: "Ø 55 cm overall",
      care: CARE_GLASS,
      tags: ["mirror", "rattan", "boho"],
      soldCount: 8,
    },
  ],
  "decor-accents": [
    {
      name: "Marble & Wood Bookends",
      sku: "EM-ACC-001",
      shortDescription: "A heavy pair of marble and acacia bookends to keep your shelves styled and tidy.",
      description: "Weighted marble bases with acacia wood tops. Sold as a pair.",
      price: 1750,
      costPrice: 780,
      options: STD(8),
      colors: ["White Marble"],
      material: "Marble, Acacia Wood",
      dimensions: "H 15 cm × W 10 cm each",
      care: "Wipe marble with a damp cloth and wood with a dry cloth.",
      tags: ["bookends", "shelf styling", "study", "gift"],
      soldCount: 13,
    },
    {
      name: "Abstract Ceramic Sculpture",
      sku: "EM-ACC-002",
      shortDescription: "A minimal ceramic sculpture that adds an artful moment to any shelf or coffee table.",
      description: "Hand-shaped with a soft matte finish. Pairs beautifully with books and a small vase.",
      price: 1950,
      discountPercent: 10,
      costPrice: 850,
      options: STD(6),
      colors: ["Sand", "Charcoal"],
      material: "Ceramic",
      dimensions: "H 22 cm",
      care: CARE_CERAMIC,
      tags: ["sculpture", "coffee table", "minimal", "art"],
      isNewArrival: true,
      soldCount: 10,
    },
    {
      name: "Woven Seagrass Storage Basket",
      sku: "EM-ACC-003",
      shortDescription: "A handwoven basket for throws, toys or plants — storage that looks good.",
      description: "Woven from natural seagrass with sturdy handles. Doubles as a plant basket.",
      price: 1650,
      costPrice: 700,
      options: [["Medium", 8], ["Large", 5]],
      colors: ["Natural"],
      material: "Seagrass",
      dimensions: "Medium Ø 30 × H 30 cm · Large Ø 38 × H 40 cm",
      care: CARE_WOOD,
      tags: ["basket", "storage", "living room", "handmade"],
      isBestSeller: true,
      soldCount: 27,
    },
  ],
};

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB\n");

  let created = 0;
  for (const [catSlug, items] of Object.entries(CATALOGUE)) {
    const cat = await Category.findOne({ slug: catSlug }).lean();
    if (!cat) {
      console.log(`• Category "${catSlug}" not found — run \`npm run seed\` first. Skipping its products.`);
      continue;
    }
    console.log(`${cat.name}`);
    for (const [i, p] of items.entries()) {
      const slug = slugify(p.name);
      if (await Product.exists({ slug })) {
        console.log(`  • ${p.name} (already exists)`);
        continue;
      }
      // Each product gets its own placeholder as the cover and the next one as the hover image.
      const images = [`/demo/${catSlug}-${(i % 3) + 1}.jpg`, `/demo/${catSlug}-${((i + 1) % 3) + 1}.jpg`];
      // Product.save() runs the pre-save hook that computes salePrice.
      await new Product({
        name: p.name,
        slug,
        sku: p.sku,
        shortDescription: p.shortDescription,
        description: p.description,
        category: cat._id,
        images,
        price: p.price,
        discountPercent: p.discountPercent ?? 0,
        costPrice: p.costPrice,
        variants: p.options.map(([size, stock]) => ({ size, stock })),
        colors: p.colors,
        material: p.material,
        dimensions: p.dimensions,
        care: p.care,
        tags: p.tags,
        isNewArrival: p.isNewArrival ?? false,
        isBestSeller: p.isBestSeller ?? false,
        isFeatured: p.isFeatured ?? false,
        active: true,
        soldCount: p.soldCount ?? 0,
      }).save();
      created++;
      console.log(`  ✓ ${p.name} — ৳${p.price}${p.discountPercent ? ` (−${p.discountPercent}%)` : ""}`);
    }
  }

  console.log(`\n🌿 Done. ${created} product(s) created.`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✗ Failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
