import { revalidateTag } from "next/cache";
import { isValidObjectId } from "mongoose";
import { adminRoute, ApiError, ok, readJson } from "@/lib/api";
import { productPatchSchema, productSchema } from "@/lib/validators";
import { Product } from "@/models/Product";
import { uniqueSlug } from "@/services/products";
import { TAGS } from "@/services/settings";

async function load(params: Promise<{ id: string }>) {
  const { id } = await params;
  if (!isValidObjectId(id)) throw new ApiError(400, "Invalid id");
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
}

export const GET = adminRoute<{ id: string }>(async (_req, { params }) => {
  return ok((await load(params)).toObject());
});

export const PUT = adminRoute<{ id: string }>(async (req, { params }) => {
  const product = await load(params);
  const data = productSchema.parse(await readJson(req));
  product.set({
    ...data,
    category: data.category || undefined,
    slug: await uniqueSlug(data.slug || data.name, String(product._id)),
  });
  await product.save(); // pre-save hook recomputes salePrice
  revalidateTag(TAGS.products);
  return ok(product.toObject());
});

/** Quick toggles: new arrival / best seller / featured / active / discount. */
export const PATCH = adminRoute<{ id: string }>(async (req, { params }) => {
  const product = await load(params);
  product.set(productPatchSchema.parse(await readJson(req)));
  await product.save();
  revalidateTag(TAGS.products);
  return ok(product.toObject());
});

export const DELETE = adminRoute<{ id: string }>(async (_req, { params }) => {
  const product = await load(params);
  await product.deleteOne();
  revalidateTag(TAGS.products);
  return ok({ id: String(product._id) });
});
