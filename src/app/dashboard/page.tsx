import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { JourneyWithStats } from '@/types';
import JourneyCard from '@/components/journey/JourneyCard';
import MyAssignments from '@/components/dashboard/MyAssignments';
import { Plus, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — QuranTogether',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login?redirectTo=/dashboard');

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('id, name, email, avatar_url, is_guest')
    .eq('id', user.id)
    .single();

  // Fetch journeys this user participates in
  const { data: participations } = await supabase
    .from('journey_participants')
    .select('journey_id, is_admin')
    .eq('user_id', user.id);

  const journeyIds = (participations || []).map((p) => p.journey_id);

  let journeys: JourneyWithStats[] = [];
  if (journeyIds.length > 0) {
    const { data: rawJourneys } = await supabase
      .from('journeys')
      .select(`
        *,
        creator:users!journeys_created_by_fkey(id, name, avatar_url),
        journey_participants(count),
        journey_units(status)
      `)
      .in('id', journeyIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    journeys = (rawJourneys || []).map((j) => {
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

  // Fetch units assigned to this user
  const { data: rawAssignments } = await supabase
    .from('journey_units')
    .select(`*, journey:journeys!journey_units_journey_id_fkey(id, title, type, dedication_name)`)
    .eq('assigned_to', user.id)
    .neq('status', 'UNASSIGNED')
    .order('updated_at', { ascending: false });

  const assignments = rawAssignments || [];

  const displayName = profile?.name || user.email?.split('@')[0] || 'Friend';
  const totalCompleted = assignments.filter((a) => a.status === 'COMPLETED').length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {displayName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {journeys.length > 0
              ? `You&apos;re part of ${journeys.length} journey${journeys.length !== 1 ? 's' : ''} · ${totalCompleted} unit${totalCompleted !== 1 ? 's' : ''} completed`
              : 'Join or start a journey to get started.'}
          </p>
        </div>
        <Link
          href="/journeys/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Journey
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Journeys', value: journeys.length },
          { label: 'Units Assigned', value: assignments.length },
          { label: 'Completed', value: totalCompleted },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white border border-slate-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* My Journeys — wider */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">My Journeys</h2>
          </div>

          {journeys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-14 text-center bg-white">
              <BookOpen className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 mb-4">You haven&apos;t joined any journeys yet.</p>
              <Link
                href="/"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Browse journeys →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {journeys.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} compact={false} />
              ))}
            </div>
          )}
        </div>

        {/* My Assignments */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">My Assignments</h2>
          <MyAssignments assignments={assignments} />
        </div>
      </div>

      {/* Guest upgrade prompt */}
      {profile?.is_guest && (
        <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-100 p-5">
          <p className="text-sm font-medium text-amber-800 mb-1">Save your progress</p>
          <p className="text-sm text-amber-700 mb-3">
            Link your email address to keep your progress and access your journeys from any device.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
          >
            Link email account
          </Link>
        </div>
      )}
    </div>
  );
}
