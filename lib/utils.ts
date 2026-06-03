import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US',
  };
  return date.toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPrice(price: number, currency: string = 'UZS'): string {
  if (currency === 'UZS') {
    return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
