import type { Collection, Product } from './types';
import productsData from './products.json';
import collectionsData from './collections.json';

const enabledCollectionSlugs = new Set(
  (collectionsData as Collection[]).filter((c) => c.enabled).map((c) => c.slug),
);

export const products = productsData as Product[];

/** Products that should be visible on the site (their collection is enabled). */
export const visibleProducts = products.filter((p) => enabledCollectionSlugs.has(p.collectionSlug));

export function getProductsByCollection(collectionSlug: string): Product[] {
  return visibleProducts.filter((p) => p.collectionSlug === collectionSlug);
}

export function getFeaturedProducts(): Product[] {
  return visibleProducts.filter((p) => p.featured);
}
