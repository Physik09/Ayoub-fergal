import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} DH`;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AF-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  const slug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || `product-${Date.now().toString(36)}`;
}

export function getDeliveryEstimate(city: string): string {
  const estimates: Record<string, string> = {
    Casablanca: '1-2 jours',
    Rabat: '1-2 jours',
    Mohammedia: '1-2 jours',
    Marrakech: '2-3 jours',
    Fès: '2-3 jours',
    Tanger: '2-3 jours',
    Meknès: '2-3 jours',
    'El Jadida': '2-3 jours',
    Tétouan: '2-3 jours',
    Safi: '2-3 jours',
    'Beni Mellal': '2-3 jours',
    Kénitra: '2-3 jours',
    Agadir: '3-5 jours',
    Oujda: '3-5 jours',
    Laâyoune: '5-7 jours',
  };
  return estimates[city] || '3-5 jours';
}
