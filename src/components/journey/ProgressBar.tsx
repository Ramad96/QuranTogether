import { getProgressPercentage } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({
  completed,
  total,
  showLabel = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percent = getProgressPercentage(completed, total);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5 text-sm">
          <span className="text-slate-600">
            <span className="font-semibold text-emerald-700">{completed}</span>
            <span className="text-slate-400"> / {total} completed</span>
          </span>
          <span className="font-semibold text-emerald-700">{percent}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-slate-100 overflow-hidden', heights[size])}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
