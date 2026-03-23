'use client';

import { useState, useEffect, useCallback } from 'react';
import { JourneyUnit, JourneyParticipant, JourneyDetail } from '@/types';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import UnitTile from './UnitTile';
import AssignModal from './AssignModal';

interface JourneyGridProps {
  initialJourney: JourneyDetail;
  currentUserId?: string;
}

export default function JourneyGrid({ initialJourney, currentUserId }: JourneyGridProps) {
  const [units, setUnits] = useState<JourneyUnit[]>(initialJourney.units);
  const [participants] = useState<JourneyParticipant[]>(initialJourney.participants);
  const [selectedUnit, setSelectedUnit] = useState<JourneyUnit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin = initialJourney.current_user_is_admin || false;
  const isParticipant = initialJourney.current_user_is_participant || false;

  // Supabase Realtime subscription
  useEffect(() => {
    if (!currentUserId) return;
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`journey-${initialJourney.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'journey_units',
          filter: `journey_id=eq.${initialJourney.id}`,
        },
        async (payload: { new: { id: string } }) => {
          // Fetch the updated unit with assigned_user info
          const { data: updatedUnit } = await supabase
            .from('journey_units')
            .select('*, assigned_user:users!journey_units_assigned_to_fkey(id, name, avatar_url)')
            .eq('id', payload.new.id)
            .single();

          if (updatedUnit) {
            setUnits((prev) =>
              prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialJourney.id, currentUserId]);

  const handleUnitClick = (unit: JourneyUnit) => {
    setSelectedUnit(unit);
    setModalOpen(true);
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
    const { unit } = await res.json();
    // Fetch with user info
    const supabase = getSupabaseBrowserClient();
    const { data } = await supabase
      .from('journey_units')
      .select('*, assigned_user:users!journey_units_assigned_to_fkey(id, name, avatar_url)')
      .eq('id', unit.id)
      .single();
    if (data) setUnits((prev) => prev.map((u) => (u.id === data.id ? data : u)));
  }, []);

  const handleUnassign = useCallback(async (unitId: string) => {
    const res = await fetch(`/api/units/${unitId}/assign`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to unassign');
    }
    const { unit } = await res.json();
    setUnits((prev) => prev.map((u) => (u.id === unit.id ? { ...u, assigned_to: null, status: 'UNASSIGNED', assigned_user: null } : u)));
  }, []);

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
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, status: 'COMPLETED' } : u)));
  }, []);

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
    setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, status: 'ASSIGNED' } : u)));
  }, []);

  // Grid layout: 5 columns for Quran (6 rows = 30), 5 cols for Yaseen (8 rows = 40)
  return (
    <>
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
        onClose={() => { setModalOpen(false); setSelectedUnit(null); }}
        participants={participants}
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
