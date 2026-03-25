'use client';

import { JourneyUnit, UnitStatus } from '@/types';
import { JUZ_NAMES } from '@/lib/constants';
import { cn, getInitials } from '@/lib/utils';
import { Check } from 'lucide-react';

interface UnitTileProps {
  unit: JourneyUnit;
  type: string;
  currentUserId?: string;
  isAdmin?: boolean;
  onClick?: (unit: JourneyUnit) => void;
}

const statusStyles: Record<UnitStatus, string> = {
  UNASSIGNED: 'bg-void border-ink/[0.12] hover:border-brand/40 hover:bg-sawm-bg text-ink/50',
  ASSIGNED:   'bg-sawm-bg border-sawm/30 hover:border-sawm/50 text-sawm',
  COMPLETED:  'bg-quran-bg border-quran/30 text-quran',
};

export default function UnitTile({ unit, type, currentUserId, isAdmin, onClick }: UnitTileProps) {
  const isClickable = !!currentUserId && (unit.status === 'UNASSIGNED' || unit.assigned_to === currentUserId || isAdmin);
  const isMyUnit = unit.assigned_to === currentUserId;

  const label = type === 'QURAN'
    ? `${unit.unit_number}`
    : `${unit.unit_number}`;

  const sublabel = type === 'QURAN'
    ? JUZ_NAMES[unit.unit_number]
    : 'Yaseen';

  const assigneeName = unit.assigned_user?.name || null;

  return (
    <button
      onClick={() => isClickable && onClick?.(unit)}
      disabled={!isClickable}
      title={
        unit.status === 'UNASSIGNED'
          ? `Juz ${unit.unit_number} — Click to claim`
          : assigneeName
          ? `${isMyUnit ? 'Your unit' : assigneeName}`
          : undefined
      }
      className={cn(
        'relative flex flex-col items-center justify-center rounded-xl border p-2 transition-all duration-150',
        'aspect-square text-center select-none',
        statusStyles[unit.status],
        isClickable && 'cursor-pointer',
        !isClickable && unit.status !== 'UNASSIGNED' && 'cursor-default',
        isMyUnit && 'ring-2 ring-brand ring-offset-1',
      )}
    >
      {/* Completion checkmark */}
      {unit.status === 'COMPLETED' && (
        <div className="absolute top-1 right-1">
          <Check className="h-3 w-3 text-quran" strokeWidth={3} />
        </div>
      )}

      {/* Unit number */}
      <span className="text-sm font-bold leading-none">
        {type === 'QURAN' ? 'Juz' : ''}
        {label}
      </span>

      {/* Juz name or Yaseen */}
      {type === 'QURAN' && (
        <span className="mt-0.5 text-[9px] leading-tight text-center line-clamp-2 opacity-70 px-0.5">
          {sublabel}
        </span>
      )}

      {/* Assignee avatar */}
      {unit.status !== 'UNASSIGNED' && assigneeName && (
        <div className="mt-1 flex items-center justify-center">
          {unit.assigned_user?.avatar_url ? (
            <img
              src={unit.assigned_user.avatar_url}
              alt={assigneeName}
              className="h-4 w-4 rounded-full object-cover"
            />
          ) : (
            <div className="h-4 w-4 rounded-full bg-white/60 text-[8px] font-bold flex items-center justify-center text-ink/60">
              {getInitials(assigneeName)}
            </div>
          )}
        </div>
      )}
    </button>
  );
}
