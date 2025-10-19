import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return d.toLocaleDateString('vi-VN');
}

export function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😕', '😐', '🙂', '😄'];
  return emojis[mood + 2] || '😐';
}

export function getResonanceLabel(resonance: number): string {
  const labels = ['None', 'Low', 'Medium', 'High'];
  return labels[resonance] || 'None';
}

export function getDomainColor(domain: string): string {
  const colors: Record<string, string> = {
    INNER: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    HEALTH: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    RELATIONSHIP: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    FINANCE: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  };
  return colors[domain] || 'bg-gray-100 text-gray-800';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
