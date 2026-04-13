'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Users, Link2, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { JourneyWithStats } from '@/types';
import { JOURNEY_TYPE_SHORT } from '@/lib/constants';
import ProgressBar from '@/components/journey/ProgressBar';
import Badge from '@/components/ui/Badge';

type Tab = 'browse' | 'link';

export default function JoinJourneyButton() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('browse');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [journeys, setJourneys] = useState<JourneyWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!open || tab !== 'browse') return;
    let cancelled = false;
    setLoading(true);

    async function fetchJourneys() {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from('journeys')
        .select(`
          *,
          creator:users!journeys_created_by_fkey(id, name, avatar_url),
          journey_participants(count),
          journey_units(status)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (cancelled) return;

      type RawJourney = JourneyWithStats & {
        journey_units: { status: string }[];
        journey_participants: { count: number }[];
      };
      const rows = (data ?? []) as unknown as RawJourney[];
      const mapped: JourneyWithStats[] = rows.map((j) => {
        const completed = j.journey_units.filter((u) => u.status === 'COMPLETED').length;
        return {
          ...j,
          journey_units: undefined,
          journey_participants: undefined,
          participant_count: j.journey_participants[0]?.count ?? 0,
          completed_count: completed,
          total_units: j.journey_units.length,
        };
      });
      setJourneys(mapped);
      setLoading(false);
    }

    fetchJourneys();
    return () => { cancelled = true; };
  }, [open, tab]);

  const handleClose = () => {
    setOpen(false);
    setError('');
    setValue('');
  };

  const handleJoin = () => {
    setError('');
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please paste an invite link.');
      return;
    }

    try {
      const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, window.location.origin);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts[0] !== 'journeys' || !pathParts[1]) {
        setError("That doesn't look like a valid invite link.");
        return;
      }
      router.push(`${url.pathname}${url.search}`);
      handleClose();
    } catch {
      setError("That doesn't look like a valid invite link.");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-ink/[0.15] bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-elevated transition-colors shrink-0"
      >
        <Users className="h-4 w-4" />
        Join a Journey
      </button>

      <Modal
        isOpen={open}
        onClose={handleClose}
        title="Join a Journey"
        className="max-w-lg"
      >
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-elevated mb-5">
          <button
            onClick={() => setTab('browse')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === 'browse'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink/50 hover:text-ink/70'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse Journeys
          </button>
          <button
            onClick={() => setTab('link')}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === 'link'
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink/50 hover:text-ink/70'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            Invite Link
          </button>
        </div>

        {/* Browse tab */}
        {tab === 'browse' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin text-ink/30" />
              </div>
            ) : journeys.length === 0 ? (
              <div className="py-10 text-center">
                <BookOpen className="h-8 w-8 text-ink/20 mx-auto mb-2" />
                <p className="text-sm text-ink/40">No active journeys found.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto -mx-1 px-1">
                {journeys.map((journey) => (
                  <a
                    key={journey.id}
                    href={`/journeys/${journey.id}`}
                    onClick={handleClose}
                    className="group flex items-center gap-3 rounded-xl border border-ink/[0.09] bg-elevated p-3 hover:border-brand/[0.22] hover:bg-surface transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Badge variant={journey.type === 'QURAN' ? 'info' : 'success'} className="shrink-0 text-[10px] px-1.5 py-0">
                          {JOURNEY_TYPE_SHORT[journey.type] || journey.type}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium text-ink truncate group-hover:text-brand transition-colors">
                        {journey.title}
                      </p>
                      <p className="text-xs text-ink/45 mt-0.5">
                        For <span className="font-medium">{journey.dedication_name}</span>
                        {' · '}
                        <span>{journey.participant_count} participant{journey.participant_count !== 1 ? 's' : ''}</span>
                      </p>
                      <div className="mt-2">
                        <ProgressBar
                          completed={journey.completed_count}
                          total={journey.total_units}
                          size="sm"
                        />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink/25 group-hover:text-brand shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Invite link tab */}
        {tab === 'link' && (
          <div>
            <p className="text-sm text-ink/55 mb-4">
              Paste the invite link shared with you to join a journey.
            </p>
            <input
              type="text"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="https://khatamtogether.com/journeys/…"
              autoFocus
              className="w-full rounded-xl border border-ink/[0.15] bg-elevated px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-brand/50"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={handleClose}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleJoin}>
                <Users className="h-4 w-4" />
                Join
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
