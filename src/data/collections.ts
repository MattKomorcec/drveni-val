import type { Collection } from './types';
import collectionsData from './collections.json';
import { getProductsByCollection } from './products';

const allCollections = collectionsData as Collection[];

/** Only collections that are enabled and have at least one visible product. */
export const collections = allCollections.filter(
  (c) => c.enabled && getProductsByCollection(c.slug).length > 0,
);
