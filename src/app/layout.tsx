import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

// Fonts are self-hosted (latin subset from Google Fonts) so builds don't depend on fetching from Google.
const cormorant = localFont({
  src: [
    { path: "./fonts/CormorantGaramond-Variable.woff2", weight: "400 600", style: "normal" },
    { path: "./fonts/CormorantGaramond-Italic-Variable.woff2", weight: "400 600", style: "italic" },
  ],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = localFont({
  src: "./fonts/Jost-Variable.woff2",
  weight: "300 600",
  variable: "--font-jost",
  display: "swap",
});
const script = localFont({
  src: "./fonts/GreatVibes-Regular.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "Emoline Home Decor — Where Every Corner Feels Like Home", template: "%s · Emoline Home Decor" },
  description: "Curated home decor — vases, wall art, lighting, cushions, planters and tableware to make every corner feel like home.",
  icons: { icon: "/brand/logo.png", apple: "/brand/logo.png" },
};

export const viewport: Viewport = { themeColor: "#f7f4ee" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} ${script.variable}`}>
      <body className="min-h-screen">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: "#fdfbf7", color: "#2e3b32", border: "1px solid #e4dccd", fontFamily: "var(--font-jost)" },
          }}
        />
      </body>
    </html>
  );
}
