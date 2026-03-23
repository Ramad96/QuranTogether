'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// Silently creates an anonymous session on first load so users
// can use all features without any login prompt.
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        supabase.auth.signInAnonymously();
      }
    });
  }, []);

  return <>{children}</>;
}
