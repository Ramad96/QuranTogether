'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Mail, User } from 'lucide-react';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const [mode, setMode] = useState<'magic' | 'guest'>('magic');
  const [email, setEmail] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const supabase = getSupabaseBrowserClient();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send login link');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/auth/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: guestName, redirectTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.redirectTo;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to join as guest');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <Mail className="h-7 w-7 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Check your email</h2>
        <p className="text-sm text-slate-500">
          We&apos;ve sent a magic link to <strong>{email}</strong>.<br />
          Click the link to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 gap-1">
        <button
          type="button"
          onClick={() => setMode('magic')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'magic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('guest')}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'guest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Join as guest
        </button>
      </div>

      {mode === 'magic' ? (
        <form onSubmit={handleMagicLink} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            <Mail className="h-4 w-4" />
            Send magic link
          </Button>
        </form>
      ) : (
        <form onSubmit={handleGuestJoin} className="space-y-3">
          <p className="text-sm text-slate-500">
            Join with just your name — no account needed.
          </p>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Your name"
              required
              maxLength={50}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            Join as {guestName || 'Guest'}
          </Button>
          <p className="text-xs text-slate-400 text-center">
            You can link your email later to keep your progress.
          </p>
        </form>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white text-xl font-bold shadow-md">
            ق
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to join or create journeys</p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
