import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import AuthButton from './AuthButton';
import MobileMenu from './MobileMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LogoMark from '@/components/ui/LogoMark';

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
    <nav className="sticky top-0 z-40 border-b border-ink/[0.09] bg-void/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark size="sm" />
          <span
            className="font-semibold text-ink hidden sm:block relative"
            title="Complete the Quran together — khatam means to seal or finish a full recitation"
          >
            KhatamTogether
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/mission"
              className="rounded-lg px-3 py-1.5 text-sm text-ink/60 hover:bg-elevated hover:text-ink transition-colors"
            >
              Our Mission
            </Link>
            <Link
              href="/get-involved"
              className="rounded-lg px-3 py-1.5 text-sm text-ink/60 hover:bg-elevated hover:text-ink transition-colors"
            >
              Get Involved
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-3 py-1.5 text-sm text-ink/60 hover:bg-elevated hover:text-ink transition-colors"
            >
              About
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-1.5 text-sm text-ink/60 hover:bg-elevated hover:text-ink transition-colors"
              >
                Dashboard
              </Link>
            )}
            {user ? (
              <Link
                href="/journeys/new"
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors ml-1"
              >
                + New
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors ml-1"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Theme switcher — visible on both mobile and desktop */}
          <ThemeSwitcher />

          {/* Mobile: sign in button (when not logged in) */}
          {!user && (
            <Link
              href="/auth/login"
              className="md:hidden rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Auth avatar dropdown */}
          <AuthButton user={user} profile={profile} />

          {/* Mobile burger menu */}
          <MobileMenu user={user} />
        </div>
      </div>
    </nav>
  );
}
