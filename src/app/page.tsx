import Link from 'next/link';
import { getSupabaseAdminClient } from '@/lib/supabase/server';
import { JourneyWithStats } from '@/types';
import JourneyCard from '@/components/journey/JourneyCard';
import { BookOpen, Heart, Users, Plus } from 'lucide-react';
import { version } from '../../package.json';

export const dynamic = 'force-dynamic';

async function getJourneys(): Promise<JourneyWithStats[]> {
  const supabase = getSupabaseAdminClient();

  const { data: journeys, error } = await supabase
    .from('journeys')
    .select(`
      *,
      creator:users!journeys_created_by_fkey(id, name, avatar_url),
      journey_participants(count),
      journey_units(status)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error || !journeys) return [];

  return journeys.map((j) => {
    const units = j.journey_units as { status: string }[];
    const completed = units.filter((u) => u.status === 'COMPLETED').length;
    return {
      ...j,
      journey_units: undefined,
      journey_participants: undefined,
      participant_count: (j.journey_participants as { count: number }[])[0]?.count ?? 0,
      completed_count: completed,
      total_units: units.length,
    };
  });
}

export default async function HomePage() {
  const journeys = await getJourneys();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm text-emerald-700 border border-emerald-100">
          <Heart className="h-3.5 w-3.5" />
          Collective worship, shared reward
        </div>
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
          Complete the Quran
          <span className="text-emerald-600"> Together</span>
          <span className="ml-3 text-base font-normal text-slate-300">v{version}</span>
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-slate-500">
          Start a shared journey — complete the Quran or 40 Yaseen as a group,
          dedicated to your loved ones.
        </p>
        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/journeys/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Start a Journey
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
        {[
          { icon: BookOpen, label: 'Active Journeys', value: journeys.length },
          {
            icon: Users,
            label: 'Participants',
            value: journeys.reduce((a, j) => a + j.participant_count, 0),
          },
          {
            icon: Heart,
            label: 'Units Completed',
            value: journeys.reduce((a, j) => a + j.completed_count, 0),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-100 p-3 sm:p-4 text-center shadow-sm">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 mx-auto mb-1" />
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Journey list */}
      <section id="journeys">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-slate-900">Active Journeys</h2>
          <Link
            href="/journeys/new"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            + New journey
          </Link>
        </div>

        {journeys.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center bg-white">
            <BookOpen className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No journeys yet</h3>
            <p className="text-sm text-slate-400 mb-6">
              Be the first to start a shared Quran journey.
            </p>
            <Link
              href="/journeys/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create first journey
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} loginRedirect />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
