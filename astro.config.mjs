// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import products from './src/data/products.json' with { type: 'json' };
import collections from './src/data/collections.json' with { type: 'json' };

/**
 * Redirects from the old Shopify webshop URLs, so existing links and search results keep working.
 * GitHub Pages has no server-side redirects, so Astro generates small HTML pages that forward the visitor.
 */
const shopifyRedirects = {
  '/pages/about': '/about',
  '/pages/contact': '/contact',
  '/pages/politika-privatnosti': '/privacy-policy',
  '/pages/uvjeti-poslovanja': '/',
  '/policies/privacy-policy': '/privacy-policy',
  '/policies/terms-of-service': '/',
  '/cart': '/products',
  '/collections': '/products',
  '/collections/all': '/products',
  ...Object.fromEntries(collections.map((c) => [`/collections/${c.slug}`, `/products#${c.slug}`])),
  ...Object.fromEntries(products.map((p) => [`/products/${p.slug}`, `/products#${p.slug}`])),
};

// https://astro.build/config
export default defineConfig({
  site: 'https://drvenival.hr',

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'hr',
    locales: ['hr', 'en', 'de'],
    routing: {
      prefixDefaultLocale: false, // Croatian at /, English at /en/, German at /de/
    },
  },

  redirects: shopifyRedirects,
});
