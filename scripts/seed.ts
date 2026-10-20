/**
 * One-time setup: creates the owner admin, default settings, categories, content pages
 * and the hero banner. Safe to re-run — existing records are left untouched.
 *
 *   npm run seed
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "../src/models/Admin";
import { Banner } from "../src/models/Banner";
import { Category } from "../src/models/Category";
import { Page } from "../src/models/Page";
import { Settings } from "../src/models/Settings";

const CATEGORIES = [
  { name: "Vases & Planters", slug: "vases-planters", description: "Ceramic vases, planters and pots to bring life to every shelf.", image: "/demo/vases-planters-1.jpg", sortOrder: 1 },
  { name: "Wall Decor", slug: "wall-decor", description: "Frames, wall art and hangings that turn blank walls into stories.", image: "/demo/wall-decor-1.jpg", sortOrder: 2 },
  { name: "Lighting", slug: "lighting", description: "Table lamps, lanterns and warm-glow pieces for cosy evenings.", image: "/demo/lighting-1.jpg", sortOrder: 3 },
  { name: "Cushions & Throws", slug: "cushions-throws", description: "Soft textures and colour for sofas, beds and reading nooks.", image: "/demo/cushions-throws-1.jpg", sortOrder: 4 },
  { name: "Tableware", slug: "tableware", description: "Plates, mugs, serveware and table linen for everyday hosting.", image: "/demo/tableware-1.jpg", sortOrder: 5 },
  { name: "Candles & Fragrance", slug: "candles-fragrance", description: "Scented candles, diffusers and holders to set the mood.", image: "/demo/candles-fragrance-1.jpg", sortOrder: 6 },
  { name: "Mirrors", slug: "mirrors", description: "Arched, round and statement mirrors that open up any room.", image: "/demo/mirrors-1.jpg", sortOrder: 7 },
  { name: "Decor Accents", slug: "decor-accents", description: "Sculptures, trays, bookends and the little finishing touches.", image: "/demo/decor-accents-1.jpg", sortOrder: 8 },
];

const PAGES = [
  {
    slug: "about",
    title: "About Us",
    content: `## Where Every Corner Feels Like Home

Emoline Home Decor was born from a simple belief — your home should feel like you.

We handpick vases, wall art, lighting, cushions and the little finishing touches that turn a house into a home. Every piece is chosen for its craft, texture and warmth, and packed with care so it reaches you just as beautiful as it left us.

## Our Promise
- Handpicked, quality pieces
- Honest pricing
- Careful, protective packaging on every order
- Free replacement if anything arrives damaged
- Friendly styling help, before and after your order`,
  },
  {
    slug: "shipping-policy",
    title: "Shipping & Delivery",
    content: `## Delivery Time
Orders are delivered within 2–5 working days from the order date. Fridays and public holidays are not counted. Large or made-to-order pieces may take longer — we will let you know when we confirm your order.

## Delivery Charges
Delivery charges depend on your location and are shown at checkout. Enjoy free delivery on orders above the free-delivery threshold.

## Packaging
Fragile items (ceramics, glass, mirrors) are bubble-wrapped and boxed individually.

## Order Confirmation
After you place an order, our team will call you to confirm before dispatch.`,
  },
  {
    slug: "return-exchange",
    title: "Returns & Damage Policy",
    content: `## Arrived Damaged?
Home decor can be delicate. If any item arrives broken or damaged, message us within 48 hours of delivery with photos and an unboxing video, and we will send a free replacement or a full refund.

## Change of Mind
You can return unused items in their original packaging within 3 days of delivery. Delivery charges for change-of-mind returns are borne by the customer.

## Not Eligible
- Candles, diffusers and other opened fragrance products
- Custom or made-to-order pieces
- Items damaged after delivery

## How to Request
Contact us by phone, WhatsApp or Facebook with your order number.`,
  },
  {
    slug: "care-guide",
    title: "Care Guide",
    content: `## Ceramics & Glass
- Wipe with a soft, damp cloth; avoid abrasive cleaners
- Decorative vases are not always watertight — use a liner for fresh flowers

## Wood & Rattan
- Dust regularly with a dry cloth
- Keep away from direct sunlight, heat and damp walls

## Metal
- Wipe with a dry cloth; polish brass gently to keep its glow

## Cushions & Throws
- Remove covers and wash gently in cold water; dry in shade

## Candles
- Trim the wick to 5 mm before each burn and never leave a burning candle unattended`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `We collect only the information needed to process and deliver your order — your name, phone number, email and address.

We never sell or share your personal information with third parties except our delivery partners, who need your address and phone number to deliver your parcel.

For any privacy questions, please contact us.`,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    content: `By placing an order on our website you agree to these terms.

## Pricing
All prices are in BDT and include applicable taxes. Prices may change without prior notice.

## Orders
We reserve the right to cancel orders in case of stock unavailability, pricing errors or suspected fraud. You will be notified and refunded where applicable.

## Handmade Pieces
Many of our products are handcrafted, so small variations in colour, glaze, grain and size are natural and make each piece unique. Actual colours may also vary slightly from images due to screen settings and lighting.`,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("<db_username>")) {
    throw new Error("Set MONGODB_URI in .env.local (replace <db_username> and <db_password>) before seeding.");
  }
  await mongoose.connect(uri);
  console.log("✓ Connected to MongoDB");

  const email = (process.env.ADMIN_EMAIL || "admin@emoline.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe@123";
  if (!(await Admin.exists({ email }))) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Emoline Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "owner",
    });
    console.log(`✓ Owner admin created: ${email}`);
  } else {
    console.log(`• Admin ${email} already exists`);
  }

  if (!(await Settings.exists({ key: "site" }))) {
    await Settings.create({ key: "site" });
    console.log("✓ Default site settings created");
  }

  for (const c of CATEGORIES) {
    const res = await Category.updateOne({ slug: c.slug }, { $setOnInsert: c }, { upsert: true });
    if (res.upsertedCount) console.log(`✓ Category: ${c.name}`);
  }

  for (const p of PAGES) {
    const res = await Page.updateOne({ slug: p.slug }, { $setOnInsert: p }, { upsert: true });
    if (res.upsertedCount) console.log(`✓ Page: ${p.title}`);
  }

  if (!(await Banner.exists({}))) {
    await Banner.create({
      title: "Emoline Home Decor — Where Every Corner Feels Like Home",
      image: "/brand/banner.png",
      link: "/shop",
      placement: "hero",
      showOverlayText: false,
      sortOrder: 0,
    });
    console.log("✓ Hero banner created");
  }

  console.log("\n🌿 Seed complete. Log in at /admin/login");
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error("✗ Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
