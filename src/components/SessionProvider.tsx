'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

// Silently creates an anonymous session on first load so users
// can use all features without any login prompt.
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        await supabase.auth.signInAnonymously();
      }
    };
    init();
  }, []);

  return <>{children}</>;
}
