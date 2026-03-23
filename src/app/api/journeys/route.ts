import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, getSupabaseAdminClient } from '@/lib/supabase/server';
import { UNIT_COUNTS } from '@/lib/constants';
import { JourneyType } from '@/types';

// GET /api/journeys — public list of active journeys with stats
export async function GET(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'recent';

  const { data: journeys, error } = await supabase
    .from('journeys')
    .select(`
      *,
      creator:users!journeys_created_by_fkey(id, name, avatar_url),
      journey_participants(count),
      journey_units(status)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: sort !== 'recent' ? true : false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Enrich with stats
  const enriched = (journeys || []).map((j) => {
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

  return NextResponse.json({ journeys: enriched });
}

// POST /api/journeys — create a new journey
export async function POST(request: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const admin = getSupabaseAdminClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Ensure user profile exists (anonymous sign-ins bypass the OAuth callback)
  await admin.from('users').upsert({
    id: user.id,
    name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Guest',
    email: user.email || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    is_guest: user.is_anonymous ?? false,
  }, { onConflict: 'id', ignoreDuplicates: true });

  const body = await request.json();
  const { title, dedication_name, type, description } = body as {
    title: string;
    dedication_name: string;
    type: JourneyType;
    description?: string;
  };

  // Validate
  if (!title?.trim() || !dedication_name?.trim() || !type) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (!['QURAN', 'YASEEN_40'].includes(type)) {
    return NextResponse.json({ error: 'Invalid journey type' }, { status: 400 });
  }

  // Create journey
  const { data: journey, error: journeyError } = await admin
    .from('journeys')
    .insert({
      title: title.trim(),
      dedication_name: dedication_name.trim(),
      type,
      description: description?.trim() || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (journeyError || !journey) {
    return NextResponse.json({ error: journeyError?.message || 'Failed to create journey' }, { status: 500 });
  }

  // Bulk-insert all units
  const unitCount = UNIT_COUNTS[type];
  const units = Array.from({ length: unitCount }, (_, i) => ({
    journey_id: journey.id,
    unit_number: i + 1,
    status: 'UNASSIGNED',
  }));

  const { error: unitsError } = await admin.from('journey_units').insert(units);
  if (unitsError) {
    // Clean up orphaned journey
    await admin.from('journeys').delete().eq('id', journey.id);
    return NextResponse.json({ error: 'Failed to create units' }, { status: 500 });
  }

  // Add creator as admin participant
  const { error: participantError } = await admin.from('journey_participants').insert({
    user_id: user.id,
    journey_id: journey.id,
    is_admin: true,
  });

  if (participantError) {
    return NextResponse.json({ error: 'Failed to add creator as participant' }, { status: 500 });
  }

  return NextResponse.json({ journey }, { status: 201 });
}
