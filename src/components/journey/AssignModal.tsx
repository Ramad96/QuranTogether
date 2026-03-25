'use client';

import { useState } from 'react';
import { JourneyUnit, JourneyParticipant } from '@/types';
import { JUZ_NAMES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Check, User } from 'lucide-react';

interface AssignModalProps {
  unit: JourneyUnit | null;
  journeyType: string;
  isOpen: boolean;
  onClose: () => void;
  participants: JourneyParticipant[];
  currentUserId: string;
  isAdmin: boolean;
  onAssign: (unitId: string, userId: string) => Promise<void>;
  onUnassign: (unitId: string) => Promise<void>;
  onMarkComplete: (unitId: string) => Promise<void>;
  onMarkIncomplete: (unitId: string) => Promise<void>;
}

export default function AssignModal({
  unit,
  journeyType,
  isOpen,
  onClose,
  participants,
  currentUserId,
  isAdmin,
  onAssign,
  onUnassign,
  onMarkComplete,
  onMarkIncomplete,
}: AssignModalProps) {
  const [loading, setLoading] = useState(false);

  if (!unit) return null;

  const isMyUnit = unit.assigned_to === currentUserId;
  const unitLabel = journeyType === 'QURAN'
    ? `Juz ${unit.unit_number} — ${JUZ_NAMES[unit.unit_number] || ''}`
    : `Yaseen ${unit.unit_number}`;

  const handleAction = async (action: () => Promise<void>) => {
    setLoading(true);
    try {
      await action();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={unitLabel}>
      <div className="space-y-4">
        {/* Status indicator */}
        <div className="rounded-xl bg-void p-3 text-sm border border-ink/[0.09]">
          {unit.status === 'UNASSIGNED' && (
            <p className="text-ink/60">This unit is available and waiting to be claimed.</p>
          )}
          {unit.status === 'ASSIGNED' && unit.assigned_user && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-sawm-bg text-sawm flex items-center justify-center text-xs font-semibold">
                {unit.assigned_user.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-ink/60">
                Assigned to <span className="font-medium text-ink">{unit.assigned_user.name}</span>
              </p>
            </div>
          )}
          {unit.status === 'COMPLETED' && (
            <div className="flex items-center gap-2 text-quran">
              <Check className="h-4 w-4" />
              <p className="font-medium">Completed by {unit.assigned_user?.name || 'someone'}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {/* Claim unit (unassigned) */}
          {unit.status === 'UNASSIGNED' && (
            <Button
              onClick={() => handleAction(() => onAssign(unit.id, currentUserId))}
              loading={loading}
              className="w-full"
            >
              <User className="h-4 w-4" />
              Claim this unit
            </Button>
          )}

          {/* My unit actions */}
          {isMyUnit && unit.status === 'ASSIGNED' && (
            <>
              <Button
                onClick={() => handleAction(() => onMarkComplete(unit.id))}
                loading={loading}
                className="w-full"
              >
                <Check className="h-4 w-4" />
                Mark as complete
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleAction(() => onUnassign(unit.id))}
                loading={loading}
                className="w-full text-ink/50"
              >
                Release unit
              </Button>
            </>
          )}

          {/* Mark incomplete */}
          {isMyUnit && unit.status === 'COMPLETED' && (
            <Button
              variant="ghost"
              onClick={() => handleAction(() => onMarkIncomplete(unit.id))}
              loading={loading}
              className="w-full text-ink/50"
            >
              Mark as incomplete
            </Button>
          )}

          {/* Admin actions */}
          {isAdmin && !isMyUnit && unit.status !== 'UNASSIGNED' && (
            <div className="border-t border-ink/[0.09] pt-3 mt-2">
              <p className="text-xs text-ink/40 mb-2 font-medium uppercase tracking-wide">Admin actions</p>
              {unit.status === 'ASSIGNED' && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => handleAction(() => onMarkComplete(unit.id))}
                    loading={loading}
                    className="w-full mb-2"
                  >
                    Mark as complete
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleAction(() => onUnassign(unit.id))}
                    loading={loading}
                    className="w-full text-ink/50"
                  >
                    Unassign unit
                  </Button>
                </>
              )}
              {unit.status === 'COMPLETED' && (
                <Button
                  variant="ghost"
                  onClick={() => handleAction(() => onMarkIncomplete(unit.id))}
                  loading={loading}
                  className="w-full text-ink/50"
                >
                  Mark as incomplete
                </Button>
              )}
            </div>
          )}

          {/* Admin: assign to a participant */}
          {isAdmin && (unit.status === 'UNASSIGNED' || (unit.status === 'ASSIGNED' && !isMyUnit)) && participants.length > 0 && (
            <div className="border-t border-ink/[0.09] pt-3 mt-2">
              <p className="text-xs text-ink/40 mb-2 font-medium uppercase tracking-wide">
                {unit.status === 'UNASSIGNED' ? 'Assign to participant' : 'Reassign to participant'}
              </p>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {participants
                  .filter((p) => p.user_id !== unit.assigned_to)
                  .map((p) => (
                    <button
                      key={p.user_id}
                      onClick={() => handleAction(() => onAssign(unit.id, p.user_id))}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-elevated transition-colors"
                    >
                      <div className="h-6 w-6 rounded-full bg-elevated flex items-center justify-center text-xs font-semibold text-ink/60 shrink-0">
                        {p.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-ink/70">{p.user?.name || 'Unknown'}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
