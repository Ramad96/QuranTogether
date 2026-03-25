import { Metadata } from 'next';
import Link from 'next/link';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { JourneyWithStats } from '@/types';
import JourneyCard from '@/components/journey/JourneyCard';
import MyAssignments from '@/components/dashboard/MyAssignments';
import { Plus, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard — KhatamTogether',
};

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = getSupabaseAdminClient();

  // Fetch user profile
  const { data: profile } = user ? await admin
    .from('users')
    .select('id, name, email, avatar_url, is_guest')
    .eq('id', user.id)
    .single() : { data: null };

  // Fetch journeys this user participates in
  const { data: participations } = user ? await admin
    .from('journey_participants')
    .select('journey_id, is_admin')
    .eq('user_id', user.id) : { data: null };

  const journeyIds = (participations || []).map((p) => p.journey_id);

  let journeys: JourneyWithStats[] = [];
  if (journeyIds.length > 0) {
    const { data: rawJourneys } = await admin
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
  const { data: rawAssignments } = user ? await admin
    .from('journey_units')
    .select(`*, journey:journeys!journey_units_journey_id_fkey(id, title, type, dedication_name)`)
    .eq('assigned_to', user.id)
    .neq('status', 'UNASSIGNED')
    .order('updated_at', { ascending: false }) : { data: null };

  const assignments = rawAssignments || [];

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Friend';
  const totalCompleted = assignments.filter((a) => a.status === 'COMPLETED').length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Welcome, {displayName}
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {journeys.length > 0
              ? `You're part of ${journeys.length} journey${journeys.length !== 1 ? 's' : ''} · ${totalCompleted} unit${totalCompleted !== 1 ? 's' : ''} completed`
              : 'Join or start a journey to get started.'}
          </p>
        </div>
        <Link
          href="/journeys/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Journey
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: 'Journeys', value: journeys.length },
          { label: 'Units Assigned', value: assignments.length },
          { label: 'Completed', value: totalCompleted },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-surface border border-ink/[0.09] p-3 sm:p-4 text-center shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
            <p className="text-xl sm:text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-ink/40 mt-0.5 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* My Journeys — wider */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-ink">My Journeys</h2>
          </div>

          {journeys.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink/[0.15] py-14 text-center bg-surface">
              <BookOpen className="h-10 w-10 text-ink/20 mx-auto mb-3" />
              <p className="text-sm text-ink/40 mb-4">You haven&apos;t joined any journeys yet.</p>
              <Link
                href="/"
                className="text-sm font-medium text-brand hover:text-brand-dark"
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
          <h2 className="text-lg font-semibold text-ink mb-4">My Assignments</h2>
          <MyAssignments assignments={assignments} />
        </div>
      </div>

    </div>
  );
}
