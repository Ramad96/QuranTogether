'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { JourneyUnit, JourneyDetail } from '@/types';
import { UNIT_COUNTS } from '@/lib/constants';
import UnitTile from './UnitTile';
import AssignModal from './AssignModal';
import ProgressBar from './ProgressBar';

interface JourneyGridProps {
  initialJourney: JourneyDetail;
  currentUserId?: string;
}

export default function JourneyGrid({ initialJourney, currentUserId }: JourneyGridProps) {
  const router = useRouter();
  const [selectedUnit, setSelectedUnit] = useState<JourneyUnit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = initialJourney.current_user_is_admin || false;
  const units = initialJourney.units;
  const totalUnits = UNIT_COUNTS[initialJourney.type] || initialJourney.total_units;
  const completedCount = units.filter((u) => u.status === 'COMPLETED').length;

  const handleUnitClick = (unit: JourneyUnit) => {
    setSelectedUnit(unit);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedUnit(null);
  };

  const handleAssign = useCallback(async (unitId: string, userId: string) => {
    const res = await fetch(`/api/units/${unitId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assign_to_user_id: userId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to assign');
    }
    router.refresh();
  }, [router]);

  const handleUnassign = useCallback(async (unitId: string) => {
    const res = await fetch(`/api/units/${unitId}/assign`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to unassign');
    }
    router.refresh();
  }, [router]);

  const handleMarkComplete = useCallback(async (unitId: string) => {
    const res = await fetch(`/api/units/${unitId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update');
    }
    router.refresh();
  }, [router]);

  const handleMarkIncomplete = useCallback(async (unitId: string) => {
    const res = await fetch(`/api/units/${unitId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ASSIGNED' }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update');
    }
    router.refresh();
  }, [router]);

  return (
    <>
      <div className="mb-8 rounded-2xl bg-surface border border-ink/[0.09] p-5 shadow-[0_2px_16px_rgba(28,22,16,0.10)]">
        <h2 className="text-sm font-semibold text-ink/55 uppercase tracking-wide mb-4">
          Overall Progress
        </h2>
        <ProgressBar completed={completedCount} total={totalUnits} size="lg" />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {units.map((unit) => (
          <UnitTile
            key={unit.id}
            unit={unit}
            type={initialJourney.type}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onClick={handleUnitClick}
          />
        ))}
      </div>

      <AssignModal
        unit={selectedUnit}
        journeyType={initialJourney.type}
        isOpen={modalOpen}
        onClose={handleClose}
        participants={initialJourney.participants}
        currentUserId={currentUserId || ''}
        isAdmin={isAdmin}
        onAssign={handleAssign}
        onUnassign={handleUnassign}
        onMarkComplete={handleMarkComplete}
        onMarkIncomplete={handleMarkIncomplete}
      />
    </>
  );
}
