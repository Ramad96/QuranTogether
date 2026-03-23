'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Users, LogIn } from 'lucide-react';

interface JoinSectionProps {
  journeyId: string;
  inviteCode: string;
  urlCode?: string;  // Code from URL params (auto-join flow)
  isLoggedIn: boolean;
}

export default function JoinSection({
  journeyId,
  inviteCode,
  urlCode,
  isLoggedIn,
}: JoinSectionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-join if code matches
  const codeToUse = urlCode && urlCode === inviteCode ? inviteCode : inviteCode;

  const handleJoin = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/journeys/${journeyId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_code: codeToUse }),
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
            {isLoggedIn
              ? 'Join to claim units and participate in this shared recitation.'
              : 'Sign in or join as a guest to participate in this journey.'}
          </p>

          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-3 flex items-center gap-2">
            {isLoggedIn ? (
              <Button onClick={handleJoin} loading={loading} size="sm">
                <Users className="h-4 w-4" />
                Join Journey
              </Button>
            ) : (
              <Link
                href={`/auth/login?redirectTo=/journeys/${journeyId}?code=${inviteCode}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <LogIn className="h-4 w-4" />
                Sign in to join
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
