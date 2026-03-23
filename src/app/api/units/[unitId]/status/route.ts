import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { UnitStatus } from '@/types';

// PATCH /api/units/[unitId]/status — mark unit complete or revert to assigned
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ unitId: string }> }
) {
  const { unitId } = await params;
  const supabase = await getSupabaseServerClient();
  const admin = getSupabaseAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status: UnitStatus };

  if (!status || !['ASSIGNED', 'COMPLETED'].includes(status)) {
    return NextResponse.json({ error: 'Status must be ASSIGNED or COMPLETED' }, { status: 400 });
  }

  // Fetch unit
  const { data: unit } = await admin
    .from('journey_units')
    .select('id, journey_id, assigned_to, status')
    .eq('id', unitId)
    .single();

  if (!unit) {
    return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
  }

  // Check participant
  const { data: participant } = await admin
    .from('journey_participants')
    .select('is_admin')
    .eq('user_id', user.id)
    .eq('journey_id', unit.journey_id)
    .single();

  if (!participant) {
    return NextResponse.json({ error: 'Not a participant of this journey' }, { status: 403 });
  }

  // Only the assigned user or an admin can change completion status
  if (unit.assigned_to !== user.id && !participant.is_admin) {
    return NextResponse.json({ error: 'You are not assigned to this unit' }, { status: 403 });
  }

  const { data: updated, error } = await admin
    .from('journey_units')
    .update({ status })
    .eq('id', unitId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ unit: updated });
}
