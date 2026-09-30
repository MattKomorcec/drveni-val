# Drveni Val — web

Website for **Drveni Val**, a small studio in Novi Vinodolski (Croatia) making handmade souvenirs from driftwood.
The site is a showcase only (no webshop). It is built with [Astro](https://astro.build) and Tailwind CSS 4, and
hosted on GitHub Pages at https://drvenival.hr.

Languages: Croatian (default, `/`), English (`/en/`), German (`/de/`).

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:4321
npm test          # unit tests (vitest)
npm run build     # static build into dist/
npm run preview   # serve the build locally
```

Node version is in `.nvmrc`.

## Editing content

- **Texts** (all languages): `src/i18n/hr.json`, `en.json`, `de.json`. All three files must have the same keys (a test checks this).
- **Products**: `src/data/products.json`. Photos go in `src/assets/images/products/` (referenced as
  `/images/products/...`) and are converted to WebP automatically. The first image is the one shown on the card.
  Set `"featured": true` to show a product on the homepage.
- **Product groups**: `src/data/collections.json`. Set `"enabled": false` to hide a whole group.
- **Privacy policy**: `src/components/PrivacyContentHR.astro`, `PrivacyContentEN.astro`, `PrivacyContentDE.astro`.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes the site to GitHub Pages.

One-time setup on GitHub:

1. Repository **Settings → Pages → Build and deployment → Source**: select **GitHub Actions**.
2. **Settings → Pages → Custom domain**: enter `drvenival.hr`, then enable **Enforce HTTPS** once the certificate is ready.

DNS records at the domain registrar (replace the records that point to Shopify):

| Type  | Name  | Value                   |
| ----- | ----- | ----------------------- |
| A     | @     | 185.199.108.153         |
| A     | @     | 185.199.109.153         |
| A     | @     | 185.199.110.153         |
| A     | @     | 185.199.111.153         |
| CNAME | www   | `<github-user>.github.io` |

Keep any existing MX/TXT records for email.

The site uses root-relative paths (`/images/...`), so it needs its own domain. It does not work under
`<github-user>.github.io/<repo>/`.

## Search engines

- Sitemap: https://drvenival.hr/sitemap-index.xml (submit in Google Search Console and Bing Webmaster Tools).
- Structured data (business details, FAQ, product list) is in `src/lib/schema.ts`. Keep the address and phone there
  in sync with the contact page.

## Old Shopify URLs

`astro.config.mjs` generates redirect pages for the old Shopify URLs (`/pages/about`, `/collections/...`,
`/products/<handle>`, ...), so existing links and search results keep working.
