import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

// POST /auth/guest — create an anonymous session with a display name
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, redirectTo } = body as { name: string; redirectTo?: string };

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Failed to create guest session' }, { status: 500 });
  }

  const admin = getSupabaseAdminClient();
  await admin.from('users').upsert({
    id: data.user.id,
    name: name.trim(),
    email: null,
    avatar_url: null,
    is_guest: true,
  }, { onConflict: 'id' });

  return NextResponse.json({
    user: { id: data.user.id, name: name.trim() },
    redirectTo: redirectTo || '/',
  });
}
