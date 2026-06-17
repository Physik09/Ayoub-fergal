export const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'El Jadida',
  'Tétouan',
  'Safi',
  'Mohammedia',
  'Beni Mellal',
  'Kénitra',
  'Laâyoune',
] as const;

export const MOROCCAN_REGIONS = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Marrakech-Safi',
  'Fès-Meknès',
  'Tanger-Tétouan-Al Hoceïma',
  'Souss-Massa',
  'Oriental',
  'Béni Mellal-Khénifra',
  'Drâa-Tafilalet',
  'Laâyoune-Sakia El Hamra',
  'Dakhla-Oued Ed-Dahab',
  'Guelmim-Oued Noun',
] as const;

export const DELIVERY_FEES: Record<string, number> = {
  Casablanca: 25,
  Rabat: 30,
  Marrakech: 35,
  Fès: 35,
  Tanger: 35,
  Agadir: 40,
  Meknès: 35,
  Oujda: 45,
  'El Jadida': 30,
  Tétouan: 35,
  Safi: 35,
  Mohammedia: 25,
  'Beni Mellal': 35,
  Kénitra: 30,
  Laâyoune: 55,
};

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const PRODUCT_COLORS = [
  { name: 'Noir', hex: '#000000' },
  { name: 'Blanc', hex: '#FFFFFF' },
  { name: 'Gris', hex: '#808080' },
  { name: 'Marine', hex: '#000080' },
  { name: 'Kaki', hex: '#C3B091' },
  { name: 'Bordeaux', hex: '#800020' },
] as const;

export const FREE_DELIVERY_THRESHOLD = 500;

export const APP_NAME = 'Ayoub Fergal';

export const BRAND_GOLD = '#C9A227';
export const BRAND_BLACK = '#0A0A0A';
