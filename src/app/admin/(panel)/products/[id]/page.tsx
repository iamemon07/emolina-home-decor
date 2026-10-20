import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type { ProductDTO } from "@/types";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDB();
  const [doc, cats] = await Promise.all([
    Product.findById(id).lean(),
    Category.find().select("name").sort({ sortOrder: 1 }).lean(),
  ]);
  if (!doc) notFound();
  const p = serialize<ProductDTO & { category?: string }>(doc);

  const initial: ProductFormValues = {
    name: p.name,
    slug: p.slug,
    sku: p.sku ?? "",
    shortDescription: p.shortDescription ?? "",
    description: p.description ?? "",
    category: (p.category as unknown as string) ?? "",
    images: p.images ?? [],
    price: p.price,
    discountPercent: p.discountPercent ?? 0,
    costPrice: p.costPrice ?? 0,
    variants: p.variants ?? [],
    colors: p.colors ?? [],
    material: p.material ?? "",
    dimensions: p.dimensions ?? "",
    care: p.care ?? "",
    tags: p.tags ?? [],
    isNewArrival: p.isNewArrival,
    isBestSeller: p.isBestSeller,
    isFeatured: p.isFeatured,
    active: p.active,
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
  };

  return <ProductForm initial={initial} productId={id} categories={serialize(cats)} />;
}
