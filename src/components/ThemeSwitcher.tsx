'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'qt-theme';

function applyTheme(t: Theme) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = t === 'dark' || (t === 'system' && prefersDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem(STORAGE_KEY, t);
}

const options: { value: Theme; icon: React.FC<{ className?: string }>; label: string }[] = [
  { value: 'light',  icon: Sun,     label: 'Light mode' },
  { value: 'system', icon: Monitor, label: 'System preference' },
  { value: 'dark',   icon: Moon,    label: 'Dark mode' },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Theme | null) || 'system';
    setTheme(saved);
    setMounted(true);

    // Keep in sync when OS preference changes (only matters for 'system' mode)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if ((localStorage.getItem(STORAGE_KEY) || 'system') === 'system') {
        document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleSelect = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  // Render placeholder during SSR / before mount to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center rounded-lg border border-ink/[0.12] bg-elevated p-0.5 gap-0.5">
        {options.map(({ value, icon: Icon, label }) => (
          <div key={value} className="rounded-md p-1.5 text-ink/30">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            <span className="sr-only">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Theme switcher"
      className="flex items-center rounded-lg border border-ink/[0.12] bg-elevated p-0.5 gap-0.5"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => handleSelect(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={cn(
            'rounded-md p-1.5 transition-colors',
            theme === value
              ? 'bg-surface text-brand shadow-sm'
              : 'text-ink/40 hover:text-ink/70'
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
}
