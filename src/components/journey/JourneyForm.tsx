'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { JOURNEY_TYPE_LABELS } from '@/lib/constants';
import { BookOpen, Heart } from 'lucide-react';

export default function JourneyForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    dedication_name: '',
    type: 'QURAN' as 'QURAN' | 'YASEEN_40',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        return;
      }

      router.push(`/journeys/${data.journey.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Journey Type */}
      <div>
        <label className="block text-sm font-medium text-ink/70 mb-2">
          Journey Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['QURAN', 'YASEEN_40'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((f) => ({ ...f, type }))}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                form.type === type
                  ? 'border-brand bg-sawm-bg text-brand'
                  : 'border-ink/[0.15] bg-void text-ink/60 hover:border-ink/[0.25]'
              }`}
            >
              {type === 'QURAN' ? (
                <BookOpen className="h-6 w-6" />
              ) : (
                <Heart className="h-6 w-6" />
              )}
              <span>{JOURNEY_TYPE_LABELS[type]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink/70 mb-1.5">
          Journey Title
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={form.type === 'QURAN' ? 'Quran Completion for Adam' : '40 Yaseen for Grandma'}
          required
          maxLength={100}
          className="w-full rounded-xl border border-ink/[0.15] bg-void px-4 py-2.5 text-sm text-ink placeholder-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/[0.12] transition-colors"
        />
      </div>

      {/* Dedication */}
      <div>
        <label htmlFor="dedication_name" className="block text-sm font-medium text-ink/70 mb-1.5">
          Dedicated To
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 text-sm">For</span>
          <input
            id="dedication_name"
            type="text"
            value={form.dedication_name}
            onChange={(e) => setForm((f) => ({ ...f, dedication_name: e.target.value }))}
            placeholder="Adam"
            required
            maxLength={100}
            className="w-full rounded-xl border border-ink/[0.15] bg-void pl-12 pr-4 py-2.5 text-sm text-ink placeholder-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/[0.12] transition-colors"
          />
        </div>
        <p className="mt-1 text-xs text-ink/40">Who is this journey dedicated to?</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink/70 mb-1.5">
          Message <span className="text-ink/40 font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="A personal message or dua for this journey..."
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-ink/[0.15] bg-void px-4 py-2.5 text-sm text-ink placeholder-ink/30 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/[0.12] transition-colors resize-none"
        />
        <p className="mt-1 text-xs text-ink/40 text-right">{form.description.length}/500</p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Create Journey
      </Button>
    </form>
  );
}
