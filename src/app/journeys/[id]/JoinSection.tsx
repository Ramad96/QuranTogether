'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Users } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

interface JoinSectionProps {
  journeyId: string;
  inviteCode: string;
  urlCode?: string;
}

export default function JoinSection({ journeyId, inviteCode }: JoinSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) throw new Error('Failed to start session. Please try again.');
      }

      const res = await fetch(`/api/journeys/${journeyId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_code: inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
          <Users className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-slate-900 text-sm">Join this journey</p>
          <p className="text-sm text-slate-500 mt-0.5">
            Join to claim units and participate in this shared recitation.
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-3">
            <Button onClick={handleJoin} loading={loading} size="sm">
              <Users className="h-4 w-4" />
              Join Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
