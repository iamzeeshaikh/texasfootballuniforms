import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="surface-card p-10 text-center">
          <h1 className="text-5xl text-[var(--color-navy)] sm:text-6xl">Page Not Found</h1>
          <p className="mt-5">
            The football apparel page you requested could not be found. Browse the main
            catalog or head back to the homepage to continue.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/"
              className="rounded-full bg-[var(--color-navy)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white"
            >
              Home
            </Link>
            <Link
              href="/all-categories/"
              className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-red)]"
            >
              All Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
