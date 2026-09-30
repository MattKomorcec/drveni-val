import { describe, it, expect } from 'vitest';
import { getProductsByCollection, getFeaturedProducts, visibleProducts, products } from './products';
import { collections } from './collections';
import { colorMap } from './types';
import { languages } from '../i18n/utils';
import collectionsData from './collections.json';

describe('getProductsByCollection', () => {
  it('returns only products belonging to the given collection', () => {
    const skure = getProductsByCollection('skure');
    expect(skure.length).toBeGreaterThan(0);
    expect(skure.every((p) => p.collectionSlug === 'skure')).toBe(true);
  });

  it('returns an empty array for a nonexistent collection', () => {
    expect(getProductsByCollection('nonexistent')).toEqual([]);
  });

  it('hides products from disabled collections', () => {
    expect(getProductsByCollection('satovi')).toEqual([]);
  });
});

describe('getFeaturedProducts', () => {
  it('returns only featured, visible products', () => {
    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    for (const p of featured) {
      expect(p.featured).toBe(true);
      expect(visibleProducts).toContain(p);
    }
  });
});

describe('data integrity', () => {
  it('every product references an existing collection', () => {
    const collectionSlugs = new Set(collectionsData.map((c) => c.slug));
    for (const p of products) {
      expect(collectionSlugs.has(p.collectionSlug), `product "${p.slug}" has invalid collectionSlug "${p.collectionSlug}"`).toBe(true);
    }
  });

  it('every visible product belongs to a listed collection', () => {
    const collectionSlugs = new Set(collections.map((c) => c.slug));
    for (const p of visibleProducts) {
      expect(collectionSlugs.has(p.collectionSlug)).toBe(true);
    }
  });

  it('every product has a title and at least one image', () => {
    for (const p of products) {
      expect(p.title, `product "${p.slug}" missing title`).toBeTruthy();
      expect(p.images.length, `product "${p.slug}" has no images`).toBeGreaterThan(0);
    }
  });

  it('every collection has a title in every language', () => {
    for (const c of collectionsData) {
      for (const lang of Object.keys(languages)) {
        expect(c.title[lang as keyof typeof c.title], `collection "${c.slug}" missing ${lang} title`).toBeTruthy();
      }
    }
  });

  it('all product slugs are unique', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('all collection slugs are unique', () => {
    const slugs = collectionsData.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('colorMap', () => {
  it('all values are valid hex color codes', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    for (const [key, value] of Object.entries(colorMap)) {
      expect(value, `colorMap["${key}"] = "${value}" is not a valid hex color`).toMatch(hexPattern);
    }
  });
});
