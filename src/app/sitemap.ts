import type { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import { Page } from "@/models/Page";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop`, changeFrequency: "daily", priority: 0.9 },
  ];
  try {
    await connectDB();
    const [products, categories, pages] = await Promise.all([
      Product.find({ active: true }).select("slug updatedAt").lean(),
      Category.find({ active: true }).select("slug updatedAt").lean(),
      Page.find({ active: true }).select("slug updatedAt").lean(),
    ]);
    return [
      ...staticRoutes,
      ...categories.map((c) => ({ url: `${base}/shop?category=${c.slug}`, lastModified: c.updatedAt, priority: 0.8 })),
      ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
      ...pages.map((p) => ({ url: `${base}/pages/${p.slug}`, lastModified: p.updatedAt, priority: 0.4 })),
    ];
  } catch {
    return staticRoutes;
  }
}
