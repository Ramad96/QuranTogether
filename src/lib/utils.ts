import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUnitLabel(type: string, unitNumber: number): string {
  if (type === 'QURAN') {
    return `Juz ${unitNumber}`;
  }
  return `Yaseen ${unitNumber}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getProgressPercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getInviteUrl(journeyId: string, inviteCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  return `${baseUrl}/journeys/${journeyId}?code=${inviteCode}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
