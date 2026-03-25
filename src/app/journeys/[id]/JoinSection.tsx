'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Users, LogIn } from 'lucide-react';

interface JoinSectionProps {
  journeyId: string;
  inviteCode: string;
  urlCode?: string;
  isLoggedIn: boolean;
}

export default function JoinSection({ journeyId, inviteCode, isLoggedIn }: JoinSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="mb-6 rounded-2xl border border-brand/[0.18] bg-sawm-bg p-5">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-brand/[0.12] flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-brand" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-ink text-sm">Want to participate?</p>
            <p className="text-sm text-ink/55 mt-0.5">
              Sign in to claim units and join this shared recitation.
            </p>
            <div className="mt-3">
              <Link
                href={`/auth/login?redirectTo=${encodeURIComponent(`/journeys/${journeyId}`)}`}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-on-brand hover:bg-brand-dark transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign in to join
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleJoin = async () => {
    setLoading(true);
    setError('');
    try {
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
    <div className="mb-6 rounded-2xl border border-brand/[0.18] bg-sawm-bg p-5">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-brand/[0.12] flex items-center justify-center shrink-0">
          <Users className="h-4 w-4 text-brand" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-ink text-sm">Join this journey</p>
          <p className="text-sm text-ink/55 mt-0.5">
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
