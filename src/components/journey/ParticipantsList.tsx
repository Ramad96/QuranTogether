import { JourneyParticipant } from '@/types';
import { getInitials } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { Crown } from 'lucide-react';

interface ParticipantsListProps {
  participants: (JourneyParticipant & {
    stats?: { assigned: number; completed: number };
  })[];
}

export default function ParticipantsList({ participants }: ParticipantsListProps) {
  if (participants.length === 0) {
    return (
      <p className="text-sm text-ink/40 text-center py-4">
        No participants yet — be the first!
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {participants.map((p) => {
        const name = p.user?.name || 'Unknown';
        const completed = p.stats?.completed || 0;
        const assigned = p.stats?.assigned || 0;

        return (
          <div
            key={p.user_id}
            className="flex items-center gap-3 rounded-xl p-3 bg-void hover:bg-elevated transition-colors"
          >
            {/* Avatar */}
            {p.user?.avatar_url ? (
              <img
                src={p.user.avatar_url}
                alt={name}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-brand/[0.12] text-brand flex items-center justify-center text-xs font-semibold shrink-0">
                {getInitials(name)}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-ink truncate">{name}</span>
                {p.is_admin && (
                  <Crown className="h-3 w-3 text-sawm shrink-0" />
                )}
              </div>
              <p className="text-xs text-ink/40">
                {assigned} unit{assigned !== 1 ? 's' : ''}
                {assigned > 0 && ` · ${completed} done`}
              </p>
            </div>

            {/* Badge */}
            {completed > 0 && (
              <Badge variant="success">
                {completed} ✓
              </Badge>
            )}
          </div>
        );
      })}
    </div>
  );
}
