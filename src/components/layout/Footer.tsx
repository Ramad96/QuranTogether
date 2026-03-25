import LogoMark from '@/components/ui/LogoMark';

export default function Footer() {
  return (
    <footer className="border-t border-ink/[0.09] bg-surface mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-ink/40">
          <div className="flex items-center gap-2">
            <LogoMark size="xs" />
            <span className="font-medium text-ink/60">KhatamTogether</span>
          </div>
          <p>A platform for collective remembrance and shared worship.</p>
          <p className="text-xs">
            &ldquo;Indeed, We have sent down the Quran and indeed, We will be its guardian.&rdquo; — Al-Hijr 15:9
          </p>
          <p className="text-xs mt-1">
            Powered by{' '}
            <a
              href="https://amanahdigital.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-dark font-medium"
            >
              AmanahDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
