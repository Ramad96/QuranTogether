import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';

// POST /api/journeys/[id]/join — join a journey using invite_code
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const admin = getSupabaseAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No session found. Please refresh and try again.' }, { status: 401 });
  }

  const body = await request.json();
  const { invite_code } = body as { invite_code: string };

  // Validate journey exists with matching invite_code
  const { data: journey, error } = await admin
    .from('journeys')
    .select('id, invite_code, is_active')
    .eq('id', id)
    .eq('invite_code', invite_code)
    .eq('is_active', true)
    .single();

  if (error || !journey) {
    return NextResponse.json({ error: 'Invalid invite link or journey not found' }, { status: 404 });
  }

  // Check if already a participant
  const { data: existing } = await admin
    .from('journey_participants')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('journey_id', id)
    .single();

  if (existing) {
    return NextResponse.json({ message: 'Already a participant' }, { status: 200 });
  }

  // Add as participant
  const { error: joinError } = await admin.from('journey_participants').insert({
    user_id: user.id,
    journey_id: id,
    is_admin: false,
  });

  if (joinError) {
    return NextResponse.json({ error: joinError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Joined successfully' }, { status: 201 });
}
