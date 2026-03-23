import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

// GET /api/participants/[journeyId] — participants with per-user stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ journeyId: string }> }
) {
  const { journeyId } = await params;
  const supabase = await getSupabaseServerClient();

  const { data: participants, error } = await supabase
    .from('journey_participants')
    .select(`
      *,
      user:users!journey_participants_user_id_fkey(id, name, avatar_url, email)
    `)
    .eq('journey_id', journeyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Get unit stats per user
  const { data: units } = await supabase
    .from('journey_units')
    .select('assigned_to, status')
    .eq('journey_id', journeyId)
    .neq('status', 'UNASSIGNED');

  const statsMap: Record<string, { assigned: number; completed: number }> = {};
  (units || []).forEach((unit) => {
    if (!unit.assigned_to) return;
    if (!statsMap[unit.assigned_to]) {
      statsMap[unit.assigned_to] = { assigned: 0, completed: 0 };
    }
    statsMap[unit.assigned_to].assigned++;
    if (unit.status === 'COMPLETED') {
      statsMap[unit.assigned_to].completed++;
    }
  });

  const enriched = (participants || []).map((p) => ({
    ...p,
    stats: statsMap[p.user_id] || { assigned: 0, completed: 0 },
  }));

  return NextResponse.json({ participants: enriched });
}
