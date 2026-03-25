import { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Users, Share2, MessageCircle } from 'lucide-react';
import LogoMark from '@/components/ui/LogoMark';

export const metadata: Metadata = {
  title: 'Get Involved — KhatamTogether',
};

const steps = [
  {
    icon: Plus,
    title: 'Start a Journey',
    description:
      'Create a shared Quran or 40 Yaseen journey dedicated to a loved one. Set a title, add a personal message, and share the invite link with your family, friends, or community.',
    action: { label: 'Start a journey', href: '/journeys/new' },
  },
  {
    icon: Users,
    title: 'Join an Existing Journey',
    description:
      'Browse active journeys on the home page and join one. Claim the Juz or Yaseen reading that suits you, complete it, and mark it as done — it takes just a minute to contribute.',
    action: { label: 'View journeys', href: '/' },
  },
  {
    icon: Share2,
    title: 'Spread the Word',
    description:
      'Know someone who has recently lost a loved one, or a mosque looking to organise a Khatm? Share KhatamTogether with them. The more participants, the more powerful the collective act of worship.',
    action: null,
  },
  {
    icon: MessageCircle,
    title: 'Give Us Feedback',
    description:
      'KhatamTogether is built by a small team who care deeply about getting this right. If you have suggestions, encounter any issues, or simply want to share how it has helped your community, we would love to hear from you.',
    action: { label: 'Contact AmanahDigital', href: 'https://amanahdigital.co.uk', external: true },
  },
];

export default function GetInvolvedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <LogoMark size="lg" shadow className="mb-4" />
        <h1 className="text-3xl font-bold text-ink">How Can I Get Involved?</h1>
        <p className="mt-3 text-ink/55 text-lg">
          There are many ways to contribute — big and small.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map(({ icon: Icon, title, description, action }, i) => (
          <div key={title} className="rounded-2xl bg-surface border border-ink/[0.09] p-6 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sawm-bg">
                <Icon className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-brand bg-sawm-bg rounded-full px-2 py-0.5">
                    0{i + 1}
                  </span>
                  <h2 className="font-semibold text-ink">{title}</h2>
                </div>
                <p className="text-sm text-ink/60 leading-relaxed">{description}</p>
                {action && (
                  <div className="mt-3">
                    {action.external ? (
                      <a
                        href={action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark"
                      >
                        {action.label} →
                      </a>
                    ) : (
                      <Link
                        href={action.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark"
                      >
                        {action.label} →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
