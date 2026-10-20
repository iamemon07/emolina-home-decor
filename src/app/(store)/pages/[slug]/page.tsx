import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/RichText";
import { getPage } from "@/services/catalog";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page?.title ?? "Page not found" };
}

export default async function ContentPage({ params }: { params: Params }) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="eyebrow mb-3 text-center">Emoline Home Decor</p>
      <h1 className="heading-display mb-12 text-center text-5xl">{page.title}</h1>
      <RichText content={page.content} />
    </div>
  );
}
