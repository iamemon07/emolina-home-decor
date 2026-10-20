import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <Image src="/brand/logo.png" alt="Emoline Home Decor" width={120} height={120} className="rounded-full" />
      <p className="eyebrow mt-8">404</p>
      <h1 className="heading-display mt-2 text-5xl">This page has wandered off</h1>
      <p className="mt-3 text-sm text-muted">Let&apos;s get you back to something beautiful.</p>
      <Link href="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}
