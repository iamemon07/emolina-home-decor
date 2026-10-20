import "server-only";
import { unstable_cache } from "next/cache";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import { Settings } from "@/models/Settings";
import type { SettingsDTO } from "@/types";

export const TAGS = {
  settings: "settings",
  products: "products",
  categories: "categories",
  banners: "banners",
  pages: "pages",
} as const;

/** Reads the settings singleton, creating it with defaults on first run. Uncached. */
export async function loadSettings(): Promise<SettingsDTO> {
  await connectDB();
  let doc = await Settings.findOne({ key: "site" }).lean();
  if (!doc) {
    await Settings.create({ key: "site" });
    doc = await Settings.findOne({ key: "site" }).lean();
  }
  return serialize<SettingsDTO>(doc);
}

export const getSettings = unstable_cache(loadSettings, ["site-settings"], {
  tags: [TAGS.settings],
  revalidate: 3600,
});
