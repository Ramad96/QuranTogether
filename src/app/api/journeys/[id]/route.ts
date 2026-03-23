import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// GET /api/journeys/[id] — full journey detail with units and participants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch journey with creator info
  const { data: journey, error: journeyError } = await supabase
    .from('journeys')
    .select(`*, creator:users!journeys_created_by_fkey(id, name, avatar_url, email)`)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (journeyError || !journey) {
    return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
  }

  // Fetch units with assigned user info
  const { data: units, error: unitsError } = await supabase
    .from('journey_units')
    .select(`*, assigned_user:users!journey_units_assigned_to_fkey(id, name, avatar_url)`)
    .eq('journey_id', id)
    .order('unit_number', { ascending: true });

  if (unitsError) {
    return NextResponse.json({ error: unitsError.message }, { status: 500 });
  }

  // Fetch participants with user info
  const { data: participants, error: participantsError } = await supabase
    .from('journey_participants')
    .select(`*, user:users!journey_participants_user_id_fkey(id, name, avatar_url, email)`)
    .eq('journey_id', id);

  if (participantsError) {
    return NextResponse.json({ error: participantsError.message }, { status: 500 });
  }

  const completedCount = (units || []).filter((u) => u.status === 'COMPLETED').length;
  const totalUnits = (units || []).length;

  const currentUserParticipant = user
    ? (participants || []).find((p) => p.user_id === user.id)
    : null;

  return NextResponse.json({
    journey: {
      ...journey,
      units: units || [],
      participants: participants || [],
      participant_count: (participants || []).length,
      completed_count: completedCount,
      total_units: totalUnits,
      current_user_is_admin: currentUserParticipant?.is_admin ?? false,
      current_user_is_participant: !!currentUserParticipant,
    },
  });
}
