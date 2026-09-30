# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static showcase website for **Drveni Val** (https://drvenival.hr), a Croatian artisan studio in Novi Vinodolski making
handmade driftwood souvenirs. There is no webshop: no prices, cart or checkout. Products are shown on one showcase
page, and visitors are pointed to the physical studio or the contact page.

The site was extracted from an earlier Astro + Cloudflare + Stripe webshop port (kept separately, in
`../drveni-val-new/astro/`) in case the shop comes back.

## Commands

```bash
npm install
npm run dev       # http://localhost:4321
npm test          # vitest: src/**/*.test.ts
npm run build     # static output in dist/
```

## Architecture

- Astro 6, static output (no adapter), Tailwind CSS 4 via `@tailwindcss/vite`. Theme tokens (colors, fonts,
  animations) live in `src/styles/global.css` under `@theme`.
- Fonts are self-hosted with `@fontsource-variable/*`, imported in `src/layouts/BaseLayout.astro`. Do not add Google
  Fonts or other third-party requests without updating the privacy policy.
- i18n: `hr` (default, no prefix), `en`, `de`. Pages live in `src/pages/[...lang]/` and use `getLocalePaths()`.
  UI strings are in `src/i18n/*.json` (flat dot-notation keys, identical key sets enforced by tests); use
  `t(lang, key)` and `getLocalizedPath(lang, path)` from `src/i18n/utils.ts`.
- Data: `src/data/products.json` (slug, title, featured, collectionSlug, images) and `src/data/collections.json`
  (slug, per-language title, enabled). Products in disabled collections are hidden.
- `src/pages/[...lang]/products.astro` is the showcase page, with a `<dialog>` photo viewer. `ProductCard` opens the
  viewer, or links to `/products#<slug>` when given `href` (homepage featured products).
- Privacy policy content is one component per language: `src/components/PrivacyContent{HR,EN,DE}.astro`.
- `astro.config.mjs` generates redirect pages for old Shopify URLs and the sitemap (`@astrojs/sitemap`, with
  hreflang). `trailingSlash: 'always'`: `getLocalizedPath()` always returns paths ending in `/`.
- Content images (photos) live in `src/assets/images/` and are rendered with `src/components/Img.astro`, which
  resolves a `'/images/...'` path via `src/lib/images.ts` and outputs responsive WebP. Pass `displayWidth` (largest
  CSS width). Small decorative PNGs (waves), favicons and SVGs stay in `public/`.
- SEO: `BaseLayout.astro` renders canonical, hreflang, Open Graph tags and JSON-LD structured data (business,
  website, page) from `src/lib/schema.ts`. Pages add nodes via the `schema` prop (FAQ on home, item list on
  products). Use `noindex` for pages that should stay out of search.
- Deployment: GitHub Pages via `.github/workflows/deploy.yml` on push to `main`, custom domain `drvenival.hr`.
  All asset paths are root-relative, so the site must be served from a domain root.

## Conventions

- All customer-facing content is in Croatian first; keep EN and DE in sync when changing texts.
- There is no contact form (GitHub Pages has no backend). The contact page lists email and phone. Adding a form
  later needs a third-party form service and an update to the privacy policy.
- Vanilla JS in `<script>` tags only, no UI frameworks.
