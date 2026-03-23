export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
              ق
            </div>
            <span className="font-medium text-slate-600">QuranTogether</span>
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
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              AmanahDigital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
