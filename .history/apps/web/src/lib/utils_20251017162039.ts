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

export function getDomainGradient(domain: string): string {
  const gradients: Record<string, string> = {
    INNER: 'from-purple-500 to-pink-500',
    HEALTH: 'from-green-500 to-emerald-500',
    RELATIONSHIP: 'from-blue-500 to-cyan-500',
    FINANCE: 'from-amber-500 to-orange-500',
  };
  return gradients[domain] || 'from-gray-500 to-gray-600';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function randomGradient(): string {
  const gradients = [
    'from-purple-600 via-blue-500 to-pink-500',
    'from-orange-500 via-pink-500 to-purple-600',
    'from-blue-600 via-cyan-500 to-teal-500',
    'from-pink-500 via-red-500 to-yellow-500',
    'from-indigo-600 via-purple-500 to-pink-500',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}
