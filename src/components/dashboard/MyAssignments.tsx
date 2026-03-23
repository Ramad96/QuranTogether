'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JourneyUnit } from '@/types';
import { getUnitLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Check, BookOpen } from 'lucide-react';

interface AssignmentWithJourney extends JourneyUnit {
  journey?: {
    id: string;
    title: string;
    type: string;
    dedication_name: string;
  };
}

interface MyAssignmentsProps {
  assignments: AssignmentWithJourney[];
}

export default function MyAssignments({ assignments }: MyAssignmentsProps) {
  const [units, setUnits] = useState(assignments);

  const handleToggleComplete = async (unit: AssignmentWithJourney) => {
    const newStatus = unit.status === 'COMPLETED' ? 'ASSIGNED' : 'COMPLETED';
    const res = await fetch(`/api/units/${unit.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setUnits((prev) =>
        prev.map((u) => (u.id === unit.id ? { ...u, status: newStatus } : u))
      );
    }
  };

  if (units.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
        <BookOpen className="h-10 w-10 text-slate-200 mx-auto mb-3" />
        <p className="text-sm text-slate-400">No units assigned yet.</p>
        <p className="text-xs text-slate-300 mt-1">Join a journey and claim your portion.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {units.map((unit) => (
        <div
          key={unit.id}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3.5 hover:border-slate-200 transition-colors"
        >
          {/* Status dot */}
          <div className={`h-2 w-2 rounded-full shrink-0 ${
            unit.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-amber-400'
          }`} />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-900">
                {getUnitLabel(unit.journey?.type || '', unit.unit_number)}
              </span>
              <Badge variant={unit.status === 'COMPLETED' ? 'success' : 'warning'}>
                {unit.status === 'COMPLETED' ? 'Done' : 'In progress'}
              </Badge>
            </div>
            {unit.journey && (
              <Link
                href={`/journeys/${unit.journey.id}`}
                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors truncate block"
              >
                {unit.journey.title}
              </Link>
            )}
          </div>

          {/* Action */}
          <Button
            variant={unit.status === 'COMPLETED' ? 'ghost' : 'primary'}
            size="sm"
            onClick={() => handleToggleComplete(unit)}
            className={unit.status === 'COMPLETED' ? 'text-slate-400' : ''}
          >
            <Check className="h-3.5 w-3.5" />
            {unit.status === 'COMPLETED' ? 'Undo' : 'Done'}
          </Button>
        </div>
      ))}
    </div>
  );
}
