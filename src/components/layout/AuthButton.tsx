'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { LogOut, ChevronDown } from 'lucide-react';

interface AuthButtonProps {
  user: User | null;
  profile: { id: string; name: string; avatar_url: string | null } | null;
}

export default function AuthButton({ user, profile }: AuthButtonProps) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const displayName = profile?.name || user.email?.split('@')[0] || 'User';

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="relative ml-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-elevated transition-colors"
      >
        {/* Avatar */}
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="h-7 w-7 rounded-full bg-brand/[0.12] text-brand flex items-center justify-center text-xs font-semibold">
            {getInitials(displayName)}
          </div>
        )}
        <span className="hidden sm:block text-sm text-ink/70 max-w-[120px] truncate">{displayName}</span>
        <ChevronDown className="h-3.5 w-3.5 text-ink/40" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-ink/[0.09] bg-surface py-1 shadow-lg">
            <div className="px-3 py-2 border-b border-ink/[0.09]">
              <p className="text-sm font-medium text-ink truncate">{displayName}</p>
              {user.email && <p className="text-xs text-ink/50 truncate">{user.email}</p>}
            </div>
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 text-sm text-ink/70 hover:bg-elevated"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
