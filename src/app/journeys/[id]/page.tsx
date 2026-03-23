import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { JourneyDetail } from '@/types';
import { JOURNEY_TYPE_LABELS } from '@/lib/constants';
import { getInviteUrl, formatDate } from '@/lib/utils';
import JourneyGrid from '@/components/journey/JourneyGrid';
import ParticipantsList from '@/components/journey/ParticipantsList';
import CopyButton from '@/components/ui/CopyButton';
import JoinSection from './JoinSection';
import Badge from '@/components/ui/Badge';
import { Calendar, Heart } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { data: journey } = await admin
    .from('journeys')
    .select('title, dedication_name')
    .eq('id', id)
    .single();

  if (!journey) return { title: 'Journey — QuranTogether' };
  return {
    title: `${journey.title} — QuranTogether`,
    description: `Join the journey for ${journey.dedication_name}`,
  };
}

async function getJourneyDetail(id: string, userId?: string): Promise<JourneyDetail | null> {
  const admin = getSupabaseAdminClient();

  const { data: journey, error: journeyError } = await admin
    .from('journeys')
    .select(`*, creator:users!journeys_created_by_fkey(id, name, avatar_url, email)`)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (journeyError || !journey) return null;

  const { data: units } = await admin
    .from('journey_units')
    .select(`*, assigned_user:users!journey_units_assigned_to_fkey(id, name, avatar_url)`)
    .eq('journey_id', id)
    .order('unit_number', { ascending: true });

  const { data: participants } = await admin
    .from('journey_participants')
    .select(`*, user:users!journey_participants_user_id_fkey(id, name, avatar_url, email)`)
    .eq('journey_id', id);

  const allUnits = units || [];
  const allParticipants = participants || [];
  const completedCount = allUnits.filter((u) => u.status === 'COMPLETED').length;
  const currentUserParticipant = userId
    ? allParticipants.find((p) => p.user_id === userId)
    : null;

  return {
    ...journey,
    units: allUnits,
    participants: allParticipants,
    creator: journey.creator,
    participant_count: allParticipants.length,
    completed_count: completedCount,
    total_units: allUnits.length,
    current_user_is_admin: currentUserParticipant?.is_admin ?? false,
    current_user_is_participant: !!currentUserParticipant,
  };
}

export default async function JourneyPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { code: inviteCode } = await searchParams;

  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const journey = await getJourneyDetail(id, user?.id);

  if (!journey) notFound();

  const inviteUrl = getInviteUrl(journey.id, journey.invite_code);
  const typeLabel = JOURNEY_TYPE_LABELS[journey.type] || journey.type;

  // Participant stats for ParticipantsList
  const participantsWithStats = journey.participants.map((p) => {
    const userUnits = journey.units.filter((u) => u.assigned_to === p.user_id);
    return {
      ...p,
      stats: {
        assigned: userUnits.length,
        completed: userUnits.filter((u) => u.status === 'COMPLETED').length,
      },
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant={journey.type === 'QURAN' ? 'info' : 'success'}>
                {typeLabel}
              </Badge>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(journey.created_at)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {journey.title}
            </h1>

            <p className="flex items-center gap-1.5 text-slate-500">
              <Heart className="h-4 w-4 text-rose-400" />
              Dedicated to{' '}
              <span className="font-semibold text-slate-700">{journey.dedication_name}</span>
            </p>

            {journey.description && (
              <p className="mt-3 text-sm text-slate-500 max-w-2xl leading-relaxed">
                {journey.description}
              </p>
            )}
          </div>

          {/* Invite link */}
          <div className="flex items-center gap-2 shrink-0">
            <CopyButton text={inviteUrl} label="Copy invite link" />
          </div>
        </div>
      </div>

      {/* Join section — shown if not a participant */}
      {!journey.current_user_is_participant && (
        <JoinSection
          journeyId={journey.id}
          inviteCode={journey.invite_code}
          urlCode={inviteCode}
          isLoggedIn={!!user && !user.is_anonymous}
        />
      )}

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grid — takes 2/3 width */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                {journey.type === 'QURAN' ? 'All 30 Juz' : 'All 40 Yaseen'}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-slate-100 border border-slate-200" />
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-amber-100 border border-amber-200" />
                  Assigned
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded bg-emerald-100 border border-emerald-200" />
                  Done
                </span>
              </div>
            </div>
            <JourneyGrid
              initialJourney={journey}
              currentUserId={user?.id}
            />
          </div>
        </div>

        {/* Sidebar — participants */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
              Participants ({journey.participant_count})
            </h2>
            <ParticipantsList participants={participantsWithStats} />
          </div>

          {/* Creator info */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="text-xs text-emerald-600 font-medium mb-1">Journey by</p>
            <p className="text-sm font-semibold text-slate-900">{journey.creator?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
