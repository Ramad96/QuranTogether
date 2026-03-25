import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-brand mb-4">404</p>
        <h1 className="text-2xl font-bold text-ink mb-2">Page not found</h1>
        <p className="text-ink/55 mb-6">
          This journey or page doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors"
        >
          Back to journeys
        </Link>
      </div>
    </div>
  );
}
