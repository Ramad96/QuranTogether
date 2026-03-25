import { Metadata } from 'next';
import LogoMark from '@/components/ui/LogoMark';

export const metadata: Metadata = {
  title: 'About Us — KhatamTogether',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <LogoMark size="lg" shadow className="mb-4" />
        <h1 className="text-3xl font-bold text-ink">About Us</h1>
        <p className="mt-3 text-ink/55 text-lg">
          KhatamTogether is built by{' '}
          <a
            href="https://amanahdigital.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-dark font-medium"
          >
            AmanahDigital
          </a>
          .
        </p>
      </div>

      <div className="space-y-6 text-ink/60 leading-relaxed">

        {/* Name definition card */}
        <div className="rounded-2xl bg-sawm-bg border border-brand/[0.18] p-6 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
          <div className="flex items-start gap-4">
            <LogoMark size="lg" />
            <div>
              <h2 className="text-lg font-semibold text-ink mb-1">
                What does <em>Khatam</em> mean?
              </h2>
              <p className="text-sm text-ink/70 mb-3">
                <strong className="text-ink/80">Khatam</strong> (Arabic: <span style={{ fontFamily: 'var(--font-lateef), serif' }} className="text-base">ختم</span>) — to seal, to complete, to bring to an end.
              </p>
              <p className="text-sm">
                In Islamic tradition, a <em>Khatam</em> refers to the completion of a full recitation of the
                Quran. It is an act of worship performed individually or collectively — in memory of
                the deceased, as supplication for the sick, or as a communal act of gratitude. The
                word carries a sense of wholeness: something brought full circle, sealed with
                intention and devotion.
              </p>
              <p className="text-sm mt-3">
                We chose the name <strong className="text-ink/80">KhatamTogether</strong> because it captures
                exactly what this platform is for — not just completing the Quran, but completing it
                <em> together</em>. Because a Khatam is always more meaningful when it is shared.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface border border-ink/[0.09] p-6 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
          <h2 className="text-lg font-semibold text-ink mb-3">Who We Are</h2>
          <p>
            AmanahDigital is a UK-based team of Muslim developers and designers dedicated to
            building digital tools that serve the Muslim community. We believe that technology,
            when guided by strong values, can strengthen the bonds of the Ummah and make acts of
            worship more accessible to everyone.
          </p>
          <p className="mt-3">
            The name <em>Amanah</em> — trust and responsibility — reflects our commitment to
            building products that are honest, purposeful, and genuinely useful. We do not build
            for profit alone; we build because we believe these tools can make a real difference
            in people&apos;s lives.
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-ink/[0.09] p-6 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
          <h2 className="text-lg font-semibold text-ink mb-3">Why We Built KhatamTogether</h2>
          <p>
            The idea for KhatamTogether came from a familiar experience — trying to coordinate a
            Khatm among family members scattered across different cities after a bereavement, with
            no easy way to track who had taken which Juz or whether the recitation had been
            completed. A WhatsApp group and a shared spreadsheet can only go so far.
          </p>
          <p className="mt-3">
            We wanted something simpler, more beautiful, and purpose-built for this act of
            worship. KhatamTogether is the result — a platform where anyone can start a journey,
            invite participants, and collectively complete the Quran or 40 Yaseen with full
            visibility of progress, all in one place.
          </p>
        </div>

        <div className="rounded-2xl bg-surface border border-ink/[0.09] p-6 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
          <h2 className="text-lg font-semibold text-ink mb-3">Our Values</h2>
          <ul className="space-y-2 text-sm">
            {[
              ['Sincerity', 'We build with the intention of benefiting the community, not just driving engagement.'],
              ['Accessibility', 'Worship should not be gated by technical barriers. KhatamTogether is free and simple to use.'],
              ['Privacy', 'We collect only what is necessary and never sell your data.'],
              ['Community', 'We listen to feedback and build with the people we serve, not just for them.'],
            ].map(([title, body]) => (
              <li key={title} className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand/[0.12] flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                </span>
                <span>
                  <strong className="text-ink/80">{title}:</strong> {body}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-sawm-bg border border-brand/[0.18] p-6 text-center">
          <p className="text-ink/70 font-medium mb-1">Get in touch</p>
          <p className="text-sm text-ink/55 mb-4">
            We&apos;d love to hear from you — whether it&apos;s feedback, a partnership enquiry, or just to say salaam.
          </p>
          <a
            href="https://amanahdigital.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors"
          >
            Visit AmanahDigital →
          </a>
        </div>
      </div>
    </div>
  );
}
