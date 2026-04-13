'use client';

import { useState, useEffect } from 'react';
import { X, Share, MoreVertical, Plus, BookOpen } from 'lucide-react';

type Platform = 'ios' | 'android' | 'other';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'other';
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true);
}

export default function AddToHomeScreen() {
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<Platform>('other');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed');
    if (dismissed) return;
    const p = detectPlatform();
    if (p === 'other') return; // Only show on mobile
    setPlatform(p);
    setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('pwa-banner-dismissed', '1');
    setVisible(false);
    setShowInstructions(false);
  };

  if (!visible) return null;

  return (
    <>
      {/* Bottom banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-lg flex items-center gap-3 rounded-2xl border border-ink/[0.12] bg-surface shadow-[0_8px_32px_rgba(28,22,16,0.18)] px-4 py-3">
          {/* Icon */}
          <div className="shrink-0 h-10 w-10 rounded-xl bg-[#0f5c2e] flex items-center justify-center shadow-sm">
            <BookOpen className="h-5 w-5 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-ink leading-tight">Add to Home Screen</p>
            <p className="text-xs text-ink/50 mt-0.5 leading-tight">Access KhatamTogether like an app</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => setShowInstructions(true)}
            className="shrink-0 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-on-brand hover:bg-brand-dark transition-colors"
          >
            Add
          </button>
          <button
            onClick={dismiss}
            className="shrink-0 rounded-lg p-1.5 text-ink/40 hover:bg-elevated hover:text-ink/60 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Instructions modal */}
      {showInstructions && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 pb-[max(16px,env(safe-area-inset-bottom))]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setShowInstructions(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-sm rounded-2xl border border-ink/[0.09] bg-surface p-5 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-base font-semibold text-ink">Add to Home Screen</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="-mt-0.5 -mr-1 rounded-lg p-1.5 text-ink/40 hover:bg-elevated hover:text-ink/60 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {platform === 'ios' && (
              <ol className="space-y-3.5">
                <Step n={1} icon={<Share className="h-4 w-4" />} iconBg="bg-blue-500">
                  Tap the <strong>Share</strong> button at the bottom of Safari
                </Step>
                <Step n={2} icon={<Plus className="h-4 w-4" />} iconBg="bg-[#0f5c2e]">
                  Scroll down and tap <strong>Add to Home Screen</strong>
                </Step>
                <Step n={3} icon={<BookOpen className="h-4 w-4" />} iconBg="bg-brand">
                  Tap <strong>Add</strong> — KhatamTogether will appear on your home screen
                </Step>
              </ol>
            )}

            {platform === 'android' && (
              <ol className="space-y-3.5">
                <Step n={1} icon={<MoreVertical className="h-4 w-4" />} iconBg="bg-ink/70">
                  Tap the <strong>⋮ menu</strong> in the top-right corner of Chrome
                </Step>
                <Step n={2} icon={<Plus className="h-4 w-4" />} iconBg="bg-[#0f5c2e]">
                  Tap <strong>Add to Home screen</strong>
                </Step>
                <Step n={3} icon={<BookOpen className="h-4 w-4" />} iconBg="bg-brand">
                  Tap <strong>Add</strong> — KhatamTogether will appear on your home screen
                </Step>
              </ol>
            )}

            <button
              onClick={dismiss}
              className="mt-5 w-full rounded-xl border border-ink/[0.12] py-2 text-sm text-ink/60 hover:bg-elevated transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  n,
  icon,
  iconBg,
  children,
}: {
  n: number;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-elevated text-xs font-bold text-ink/60 border border-ink/[0.10]">
        {n}
      </div>
      <div className="flex items-start gap-2 pt-0.5 flex-1">
        <span className={`shrink-0 flex items-center justify-center h-6 w-6 rounded-md ${iconBg} text-white`}>
          {icon}
        </span>
        <p className="text-sm text-ink/70 leading-snug">{children}</p>
      </div>
    </li>
  );
}
