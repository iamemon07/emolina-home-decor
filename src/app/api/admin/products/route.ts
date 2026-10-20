import { revalidateTag } from "next/cache";
import type { FilterQuery } from "mongoose";
import { adminRoute, ok, readJson } from "@/lib/api";
import { escapeRegex } from "@/lib/utils";
import { productSchema } from "@/lib/validators";
import { Product, type ProductDoc } from "@/models/Product";
import { uniqueSlug } from "@/services/products";
import { TAGS } from "@/services/settings";

export const GET = adminRoute(async (req) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const filter: FilterQuery<ProductDoc> = {};
  if (q) filter.$or = [{ name: new RegExp(escapeRegex(q), "i") }, { sku: new RegExp(escapeRegex(q), "i") }];
  const docs = await Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 }).limit(500).lean();
  return ok(docs);
});

export const POST = adminRoute(async (req) => {
  const data = productSchema.parse(await readJson(req));
  const product = new Product({
    ...data,
    category: data.category || undefined,
    slug: await uniqueSlug(data.slug || data.name),
  });
  await product.save();
  revalidateTag(TAGS.products);
  return ok(product.toObject(), { status: 201 });
});
