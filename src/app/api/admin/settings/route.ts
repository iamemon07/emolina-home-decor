import { revalidateTag } from "next/cache";
import { z } from "zod";
import { adminRoute, ok, readJson } from "@/lib/api";
import { Settings } from "@/models/Settings";
import { loadSettings, TAGS } from "@/services/settings";

const s = (max = 2000) => z.string().trim().max(max);
const n = z.coerce.number().min(0).max(1_000_000);
const wallet = z.object({ enabled: z.boolean(), number: s(30), accountType: s(30), instructions: s(1000) });

const settingsSchema = z
  .object({
    storeName: s(100).min(1),
    tagline: s(200),
    logo: s(1000),
    currencySymbol: s(5).min(1),
    email: s(200),
    phone: s(50),
    whatsapp: s(50),
    address: s(500),
    social: z.object({ facebook: s(500), instagram: s(500), tiktok: s(500), youtube: s(500) }),
    announcement: z.object({ enabled: z.boolean(), text: s(300), link: s(500) }),
    home: z.object({
      categoriesTitle: s(100),
      newArrivalsTitle: s(100),
      newArrivalsSubtitle: s(200),
      bestSellersTitle: s(100),
      bestSellersSubtitle: s(200),
      storyTitle: s(150),
      storyText: s(3000),
      storyImage: s(1000),
      features: z.array(z.object({ title: s(60), text: s(150) })).max(6),
    }),
    shipping: z.object({
      insideCityLabel: s(60),
      outsideCityLabel: s(60),
      insideFee: n,
      outsideFee: n,
      freeShippingThreshold: n,
      minDays: z.coerce.number().int().min(0).max(60),
      maxDays: z.coerce.number().int().min(0).max(60),
      weekendDays: z.array(z.number().int().min(0).max(6)).max(6),
    }),
    payments: z.object({
      cod: z.object({ enabled: z.boolean(), instructions: s(1000) }),
      bkash: wallet,
      nagad: wallet,
      rocket: wallet,
      bank: z.object({ enabled: z.boolean(), details: s(2000) }),
    }),
    invoice: z.object({ footerNote: s(1000) }),
    seo: z.object({ title: s(160), description: s(320) }),
    footerAbout: s(1000),
  })
  .partial();

export const GET = adminRoute(async () => ok(await loadSettings()));

export const PUT = adminRoute(async (req) => {
  const data = settingsSchema.parse(await readJson(req));
  await loadSettings(); // ensure the singleton exists
  const doc = await Settings.findOneAndUpdate({ key: "site" }, { $set: data }, { new: true, runValidators: true }).lean();
  revalidateTag(TAGS.settings);
  return ok(doc);
});
