import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import AuthButton from './AuthButton';

export default async function Navbar() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('id, name, avatar_url')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-sm group-hover:bg-emerald-700 transition-colors">
            ق
          </div>
          <span className="font-semibold text-slate-900 hidden sm:block">QuranTogether</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Journeys
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/journeys/new"
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors ml-1"
          >
            + New
          </Link>
          <AuthButton user={user} profile={profile} />
        </div>
      </div>
    </nav>
  );
}
