import type { Lang } from '../i18n/utils';

export interface Product {
  slug: string;
  title: string;
  featured: boolean;
  collectionSlug: string;
  images: string[]; // first is the featured image
}

export interface Collection {
  slug: string;
  title: Record<Lang, string>;
  enabled: boolean;
}

/** Color map for the product title underline feature. */
export const colorMap: Record<string, string> = {
  Žuta: '#EAB308',
  Plava: '#3B82F6',
  Narančasta: '#F97316',
  Crvena: '#EF4444',
  Bijela: '#D1D5DB',
  Zelena: '#22C55E',
  Roza: '#EC4899',
  Ljubičasta: '#A855F7',
  Drvena: '#92400E',
  Tamnoplava: '#1E3A5F',
  Tirkizna: '#06B6D4',
  Lavanda: '#C084FC',
};
