import Link from 'next/link';
import { Users, BookOpen, ArrowRight } from 'lucide-react';
import { JourneyWithStats } from '@/types';
import { JOURNEY_TYPE_SHORT } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import ProgressBar from './ProgressBar';
import Badge from '@/components/ui/Badge';

interface JourneyCardProps {
  journey: JourneyWithStats;
  showJoinButton?: boolean;
  compact?: boolean;
  loginRedirect?: boolean;
}

export default function JourneyCard({ journey, showJoinButton = true, compact = false, loginRedirect = false }: JourneyCardProps) {
  const typeLabel = JOURNEY_TYPE_SHORT[journey.type] || journey.type;
  const journeyHref = `/journeys/${journey.id}`;
  const href = loginRedirect ? `/auth/login?redirectTo=${encodeURIComponent(journeyHref)}` : journeyHref;

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={journey.type === 'QURAN' ? 'info' : 'success'} className="shrink-0">
              {typeLabel}
            </Badge>
          </div>
          <h3 className="font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
            {journey.title}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
            <span>For</span>
            <span className="font-medium text-slate-700">{journey.dedication_name}</span>
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 shrink-0 mt-1 transition-colors" />
      </div>

      {!compact && (
        <>
          <div className="mb-3">
            <ProgressBar
              completed={journey.completed_count}
              total={journey.total_units}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{journey.participant_count} participant{journey.participant_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{formatDate(journey.created_at)}</span>
            </div>
          </div>
        </>
      )}
    </Link>
  );
}
