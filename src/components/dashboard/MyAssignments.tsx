'use client';

import { useState } from 'react';
import Link from 'next/link';
import { JourneyUnit } from '@/types';
import { getUnitLabel } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Check, BookOpen, ChevronDown } from 'lucide-react';

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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

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

  const toggleCollapse = (journeyId: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(journeyId)) next.delete(journeyId);
      else next.add(journeyId);
      return next;
    });
  };

  if (units.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/[0.15] p-8 text-center">
        <BookOpen className="h-10 w-10 text-ink/20 mx-auto mb-3" />
        <p className="text-sm text-ink/40">No units assigned yet.</p>
        <p className="text-xs text-ink/30 mt-1">Join a journey and claim your portion.</p>
      </div>
    );
  }

  // Sort: incomplete first, completed last, then by unit number within each group
  const sorted = [...units].sort((a, b) => {
    const aComplete = a.status === 'COMPLETED' ? 1 : 0;
    const bComplete = b.status === 'COMPLETED' ? 1 : 0;
    if (aComplete !== bComplete) return aComplete - bComplete;
    return a.unit_number - b.unit_number;
  });

  // Group units by journey
  const groups = sorted.reduce<{ journey: AssignmentWithJourney['journey']; units: AssignmentWithJourney[] }[]>(
    (acc, unit) => {
      const journeyId = unit.journey?.id ?? 'unknown';
      const existing = acc.find((g) => g.journey?.id === journeyId);
      if (existing) {
        existing.units.push(unit);
      } else {
        acc.push({ journey: unit.journey, units: [unit] });
      }
      return acc;
    },
    []
  );

  // Journeys with incomplete units first
  const sortedGroups = [...groups].sort((a, b) => {
    const aDone = a.units.every((u) => u.status === 'COMPLETED') ? 1 : 0;
    const bDone = b.units.every((u) => u.status === 'COMPLETED') ? 1 : 0;
    return aDone - bDone;
  });

  return (
    <div className="space-y-3">
      {sortedGroups.map(({ journey, units: groupUnits }) => {
        const journeyId = journey?.id ?? 'unknown';
        const isCollapsed = collapsed.has(journeyId);
        const completedCount = groupUnits.filter((u) => u.status === 'COMPLETED').length;
        const allDone = completedCount === groupUnits.length;

        return (
          <div key={journeyId} className="rounded-2xl border border-ink/[0.09] bg-surface overflow-hidden">
            {/* Group header */}
            <button
              onClick={() => toggleCollapse(journeyId)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 hover:bg-elevated transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                {journey ? (
                  <p className="text-sm font-semibold text-ink truncate">{journey.title}</p>
                ) : (
                  <p className="text-sm font-semibold text-ink/40">Unknown Journey</p>
                )}
                <p className="text-xs text-ink/40 mt-0.5">
                  {completedCount}/{groupUnits.length} done
                  {allDone && <span className="ml-1.5 text-brand font-medium">· Complete</span>}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-ink/40 shrink-0 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
              />
            </button>

            {/* Units list */}
            {!isCollapsed && (
              <div className="border-t border-ink/[0.09] divide-y divide-ink/[0.06]">
                {groupUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-elevated transition-colors"
                  >
                    {/* Status dot */}
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      unit.status === 'COMPLETED' ? 'bg-quran' : 'bg-sawm'
                    }`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-ink">
                          {getUnitLabel(unit.journey?.type || '', unit.unit_number)}
                        </span>
                        <Badge variant={unit.status === 'COMPLETED' ? 'success' : 'warning'}>
                          {unit.status === 'COMPLETED' ? 'Done' : 'In progress'}
                        </Badge>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      variant={unit.status === 'COMPLETED' ? 'ghost' : 'primary'}
                      size="sm"
                      onClick={() => handleToggleComplete(unit)}
                      className={unit.status === 'COMPLETED' ? 'text-ink/40' : ''}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {unit.status === 'COMPLETED' ? 'Undo' : 'Done'}
                    </Button>
                  </div>
                ))}
                {journey && (
                  <div className="px-4 py-2">
                    <Link
                      href={`/journeys/${journey.id}`}
                      className="text-xs text-brand hover:text-brand-dark font-medium transition-colors"
                    >
                      View journey →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
