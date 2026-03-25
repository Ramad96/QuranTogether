import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'neutral';
  className?: string;
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-elevated text-ink/60',
    success: 'bg-quran-bg text-quran',
    warning: 'bg-sawm-bg text-sawm',
    info: 'bg-salah-bg text-salah',
    neutral: 'bg-elevated text-ink/50',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
