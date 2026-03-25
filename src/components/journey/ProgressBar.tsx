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
          <span className="text-ink/60">
            <span className="font-semibold text-brand">{completed}</span>
            <span className="text-ink/40"> / {total} completed</span>
          </span>
          <span className="font-semibold text-brand">{percent}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-ink/[0.08] overflow-hidden', heights[size])}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
