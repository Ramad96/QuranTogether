'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Users } from 'lucide-react';

export default function JoinJourneyButton() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    setError('');
    const trimmed = value.trim();
    if (!trimmed) {
      setError('Please paste an invite link.');
      return;
    }

    try {
      // Accept full URLs or bare paths like /journeys/[id]?code=xxx
      const url = trimmed.startsWith('http') ? new URL(trimmed) : new URL(trimmed, window.location.origin);
      const pathParts = url.pathname.split('/').filter(Boolean);
      // Expect: journeys / [id]
      if (pathParts[0] !== 'journeys' || !pathParts[1]) {
        setError('That doesn\'t look like a valid invite link.');
        return;
      }
      router.push(`${url.pathname}${url.search}`);
      setOpen(false);
      setValue('');
    } catch {
      setError('That doesn\'t look like a valid invite link.');
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

      <Modal isOpen={open} onClose={() => { setOpen(false); setError(''); setValue(''); }} title="Join a Journey">
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
          <Button variant="secondary" size="sm" onClick={() => { setOpen(false); setError(''); setValue(''); }}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleJoin}>
            <Users className="h-4 w-4" />
            Join
          </Button>
        </div>
      </Modal>
    </>
  );
}
