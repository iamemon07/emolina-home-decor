import { EMPTY_PRODUCT, ProductForm } from "@/components/admin/ProductForm";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import { Category } from "@/models/Category";

export default async function NewProductPage() {
  await connectDB();
  const categories = serialize<{ _id: string; name: string }[]>(await Category.find().select("name").sort({ sortOrder: 1 }).lean());
  return <ProductForm initial={EMPTY_PRODUCT} categories={categories} />;
}
