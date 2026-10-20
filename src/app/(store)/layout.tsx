import Link from "next/link";
import { CartDrawer } from "@/components/store/CartDrawer";
import { Footer } from "@/components/store/Footer";
import { Header } from "@/components/store/Header";
import { StoreProvider } from "@/components/store/StoreContext";
import { getCategories, getFooterPages } from "@/services/catalog";
import { getSettings } from "@/services/settings";

// Content is managed live from the admin panel; cached per-tag and revalidated on every admin change.
export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, pages] = await Promise.all([getSettings(), getCategories(), getFooterPages()]);
  const navCategories = categories.map((c) => ({ name: c.name, slug: c.slug }));

  return (
    <StoreProvider
      value={{ currency: settings.currencySymbol, freeShippingThreshold: settings.shipping.freeShippingThreshold }}
    >
      {settings.announcement.enabled && settings.announcement.text && (
        <div className="bg-cocoa py-2.5 text-center text-[11px] tracking-[0.2em] text-ivory uppercase print:hidden">
          <Link href={settings.announcement.link || "/shop"} className="px-4 hover:text-blush-200">
            {settings.announcement.text}
          </Link>
        </div>
      )}
      <Header logo={settings.logo} storeName={settings.storeName} categories={navCategories} />
      <main>{children}</main>
      <Footer settings={settings} categories={navCategories} pages={pages} />
      <CartDrawer />
    </StoreProvider>
  );
}
