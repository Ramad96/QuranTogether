import { Metadata } from 'next';
import { Heart, BookOpen, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission — QuranTogether',
};

export default function MissionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-md">
          ق
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Our Mission</h1>
        <p className="mt-3 text-slate-500 text-lg">
          Bringing hearts together through collective worship.
        </p>
      </div>

      <div className="space-y-8 text-slate-600 leading-relaxed">
        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Honouring Our Loved Ones</h2>
          </div>
          <p>
            When someone we love passes away, or when we wish to make du'a for those who are ill or
            facing hardship, one of the greatest gifts we can offer is the recitation of the Quran.
            QuranTogether was built to make that gift a shared one — so that families, friends, and
            communities can come together, each contributing what they can, to complete the Quran or
            40 Yaseen as a collective act of love and remembrance.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Making Recitation Accessible</h2>
          </div>
          <p>
            Not everyone can complete the Quran alone — and that is perfectly fine. Our platform
            removes the barrier of needing to do everything yourself. By dividing the Quran into its
            30 Juz, or Yaseen into 40 readings, every participant can take on just their share.
            Together, the whole is completed. No portion is too small; every verse recited carries
            reward.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Strengthening Community</h2>
          </div>
          <p>
            Beyond the individual act of worship, QuranTogether is about community. It is about
            mosques organising Khatms for those who have passed, families coordinating across
            continents, and friends supporting one another in times of need. We believe technology
            should serve the Ummah — and this is our small contribution to that vision.
          </p>
        </div>

        <blockquote className="rounded-2xl bg-emerald-50 border border-emerald-100 px-6 py-5 text-center">
          <p className="text-emerald-800 font-medium italic">
            &ldquo;The believers in their mutual kindness, compassion, and sympathy are just like one body.
            When one of the limbs suffers, the whole body responds to it with wakefulness and fever.&rdquo;
          </p>
          <p className="mt-2 text-sm text-emerald-600">— Sahih al-Bukhari & Muslim</p>
        </blockquote>
      </div>
    </div>
  );
}
