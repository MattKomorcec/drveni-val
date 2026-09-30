# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

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
- `astro.config.mjs` generates redirect pages for old Shopify URLs.
- Deployment: GitHub Pages via `.github/workflows/deploy.yml` on push to `main`, custom domain `drvenival.hr`.
  All asset paths are root-relative, so the site must be served from a domain root.

## Conventions

- All customer-facing content is in Croatian first; keep EN and DE in sync when changing texts.
- The contact form in `ContactPage.astro` has no submit handler yet (GitHub Pages has no backend). The decision on a
  form service is pending.
- Vanilla JS in `<script>` tags only, no UI frameworks.
