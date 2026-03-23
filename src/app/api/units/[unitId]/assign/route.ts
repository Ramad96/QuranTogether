import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';

// POST /api/units/[unitId]/assign — assign a unit to a user
export async function POST(
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
  const { assign_to_user_id } = body as { assign_to_user_id: string };

  if (!assign_to_user_id) {
    return NextResponse.json({ error: 'assign_to_user_id is required' }, { status: 400 });
  }

  // Fetch the unit
  const { data: unit, error: unitError } = await admin
    .from('journey_units')
    .select('id, journey_id, status, assigned_to')
    .eq('id', unitId)
    .single();

  if (unitError || !unit) {
    return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
  }

  // Check requester is a participant
  const { data: requesterParticipant } = await admin
    .from('journey_participants')
    .select('is_admin')
    .eq('user_id', user.id)
    .eq('journey_id', unit.journey_id)
    .single();

  if (!requesterParticipant) {
    return NextResponse.json({ error: 'Not a participant of this journey' }, { status: 403 });
  }

  // If assigning to someone else, requester must be admin
  if (assign_to_user_id !== user.id && !requesterParticipant.is_admin) {
    return NextResponse.json({ error: 'Only admins can assign units to others' }, { status: 403 });
  }

  // Unit must be unassigned (unless admin is reassigning)
  if (unit.status !== 'UNASSIGNED' && !requesterParticipant.is_admin) {
    return NextResponse.json({ error: 'Unit is already assigned' }, { status: 409 });
  }

  // Target user must be a participant
  const { data: targetParticipant } = await admin
    .from('journey_participants')
    .select('user_id')
    .eq('user_id', assign_to_user_id)
    .eq('journey_id', unit.journey_id)
    .single();

  if (!targetParticipant) {
    return NextResponse.json({ error: 'Target user is not a participant' }, { status: 400 });
  }

  const { data: updated, error: updateError } = await admin
    .from('journey_units')
    .update({
      assigned_to: assign_to_user_id,
      status: 'ASSIGNED',
    })
    .eq('id', unitId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ unit: updated });
}

// DELETE /api/units/[unitId]/assign — unassign a unit
export async function DELETE(
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

  const { data: unit } = await admin
    .from('journey_units')
    .select('id, journey_id, assigned_to, status')
    .eq('id', unitId)
    .single();

  if (!unit) {
    return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
  }

  // Only the assigned user or an admin can unassign
  const { data: participant } = await admin
    .from('journey_participants')
    .select('is_admin')
    .eq('user_id', user.id)
    .eq('journey_id', unit.journey_id)
    .single();

  if (!participant) {
    return NextResponse.json({ error: 'Not a participant' }, { status: 403 });
  }

  if (unit.assigned_to !== user.id && !participant.is_admin) {
    return NextResponse.json({ error: 'Cannot unassign another user\'s unit' }, { status: 403 });
  }

  const { data: updated, error } = await admin
    .from('journey_units')
    .update({ assigned_to: null, status: 'UNASSIGNED' })
    .eq('id', unitId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ unit: updated });
}
