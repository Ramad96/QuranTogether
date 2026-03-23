'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Plus } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface MobileMenuProps {
  user: User | null;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={close} />
          <div className="absolute right-0 top-full z-40 mt-1 w-56 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg">
            <Link
              href="/mission"
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={close}
            >
              Our Mission
            </Link>
            <Link
              href="/get-involved"
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={close}
            >
              Get Involved
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={close}
            >
              About
            </Link>
            {user && (
              <>
                <div className="my-1 border-t border-slate-100" />
                <Link
                  href="/dashboard"
                  className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={close}
                >
                  Dashboard
                </Link>
                <Link
                  href="/journeys/new"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                  onClick={close}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Journey
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
