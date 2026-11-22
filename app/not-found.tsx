import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="eyebrow mb-6">Error 404</p>
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-[-0.05em] text-fg">
          Signal <span className="accent">lost.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-fg-2">The page you were looking for doesn&apos;t exist or has moved.</p>
        <Link
          href="/"
          className="mt-10 inline-flex h-12 items-center rounded-full bg-fg px-6 text-sm font-medium text-ink transition-shadow hover:shadow-[0_10px_40px_-10px_rgba(98,138,255,0.7)]"
        >
          Back to the portfolio
        </Link>
      </div>
    </main>
  );
}
