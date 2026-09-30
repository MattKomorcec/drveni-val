import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  t,
  getLocalizedPath,
  getAlternateLinks,
  stripLangPrefix,
  getNavLinks,
  isActivePath,
  getLocalePaths,
  languages,
} from './utils';
import hr from './hr.json';
import en from './en.json';
import de from './de.json';

describe('getLangFromUrl', () => {
  it('returns hr for root path', () => {
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe('hr');
  });

  it('returns hr for paths without language prefix', () => {
    expect(getLangFromUrl(new URL('https://example.com/about'))).toBe('hr');
    expect(getLangFromUrl(new URL('https://example.com/contact'))).toBe('hr');
  });

  it('returns en for /en/ paths', () => {
    expect(getLangFromUrl(new URL('https://example.com/en/'))).toBe('en');
    expect(getLangFromUrl(new URL('https://example.com/en/about'))).toBe('en');
  });

  it('returns de for /de/ paths', () => {
    expect(getLangFromUrl(new URL('https://example.com/de/'))).toBe('de');
    expect(getLangFromUrl(new URL('https://example.com/de/contact'))).toBe('de');
  });

  it('returns hr for unknown language prefix', () => {
    expect(getLangFromUrl(new URL('https://example.com/fr/about'))).toBe('hr');
  });
});

describe('t', () => {
  it('returns the correct translation for Croatian', () => {
    expect(t('hr', 'nav.products')).toBe('Radovi');
  });

  it('returns the correct translation for English', () => {
    expect(t('en', 'nav.products')).toBe('Our work');
  });

  it('returns the correct translation for German', () => {
    expect(t('de', 'nav.products')).toBe('Unsere Werke');
  });

  it('falls back to Croatian when key is missing in target language', () => {
    // hero.title contains <br> tags only in Croatian, if EN/DE don't have it, it falls back
    const result = t('hr', 'hero.title');
    expect(result).toContain('Unesite');
  });

  it('returns the key itself when missing from all languages', () => {
    expect(t('hr', 'nonexistent.key')).toBe('nonexistent.key');
    expect(t('en', 'nonexistent.key')).toBe('nonexistent.key');
  });
});

describe('getLocalizedPath', () => {
  it('returns path without prefix for Croatian (default)', () => {
    expect(getLocalizedPath('hr', '/about')).toBe('/about/');
    expect(getLocalizedPath('hr', '/')).toBe('/');
  });

  it('adds /en/ prefix for English', () => {
    expect(getLocalizedPath('en', '/about')).toBe('/en/about/');
    expect(getLocalizedPath('en', '/')).toBe('/en/');
  });

  it('adds /de/ prefix for German', () => {
    expect(getLocalizedPath('de', '/about')).toBe('/de/about/');
    expect(getLocalizedPath('de', '/')).toBe('/de/');
  });

  it('handles paths without leading slash', () => {
    expect(getLocalizedPath('en', 'about')).toBe('/en/about/');
  });

  it('keeps the hash after the trailing slash', () => {
    expect(getLocalizedPath('hr', '/products#skure')).toBe('/products/#skure');
    expect(getLocalizedPath('en', '/products#skure')).toBe('/en/products/#skure');
  });
});

describe('stripLangPrefix', () => {
  it('removes /en/ prefix', () => {
    expect(stripLangPrefix('/en/about')).toBe('/about');
  });

  it('removes /de/ prefix', () => {
    expect(stripLangPrefix('/de/contact')).toBe('/contact');
  });

  it('does not strip Croatian (default) prefix', () => {
    expect(stripLangPrefix('/about')).toBe('/about');
  });

  it('handles root paths', () => {
    expect(stripLangPrefix('/en/')).toBe('/');
  });
});

describe('getAlternateLinks', () => {
  it('returns links for all languages plus x-default', () => {
    const links = getAlternateLinks('/about');
    expect(links).toHaveLength(4); // hr, en, de, x-default
    expect(links.map((l) => l.lang)).toContain('hr');
    expect(links.map((l) => l.lang)).toContain('en');
    expect(links.map((l) => l.lang)).toContain('de');
    expect(links.map((l) => l.lang)).toContain('x-default');
  });

  it('generates correct relative paths without siteUrl', () => {
    const links = getAlternateLinks('/about');
    const hrLink = links.find((l) => l.lang === 'hr');
    const enLink = links.find((l) => l.lang === 'en');
    expect(hrLink?.href).toBe('/about/');
    expect(enLink?.href).toBe('/en/about/');
  });

  it('generates absolute URLs when siteUrl is provided', () => {
    const links = getAlternateLinks('/about', 'https://drvenival.hr');
    const hrLink = links.find((l) => l.lang === 'hr');
    const enLink = links.find((l) => l.lang === 'en');
    expect(hrLink?.href).toBe('https://drvenival.hr/about/');
    expect(enLink?.href).toBe('https://drvenival.hr/en/about/');
  });

  it('strips existing language prefix before generating links', () => {
    const links = getAlternateLinks('/en/about');
    const hrLink = links.find((l) => l.lang === 'hr');
    expect(hrLink?.href).toBe('/about/');
  });

  it('x-default points to the default locale (Croatian)', () => {
    const links = getAlternateLinks('/en/about', 'https://drvenival.hr');
    const xDefault = links.find((l) => l.lang === 'x-default');
    expect(xDefault?.href).toBe('https://drvenival.hr/about/');
  });
});

describe('getNavLinks', () => {
  it('returns 4 nav links', () => {
    const links = getNavLinks('hr');
    expect(links).toHaveLength(4);
  });

  it('includes home, products, about, contact', () => {
    const links = getNavLinks('hr');
    const labels = links.map((l) => l.label);
    expect(labels).toContain('Početna');
    expect(labels).toContain('Radovi');
    expect(labels).toContain('O meni');
    expect(labels).toContain('Kontakt');
  });

  it('localizes paths for English', () => {
    const links = getNavLinks('en');
    const aboutLink = links.find((l) => l.label === 'About me');
    expect(aboutLink?.href).toBe('/en/about/');
  });
});

describe('isActivePath', () => {
  it('returns true for exact match', () => {
    expect(isActivePath('/about', '/about')).toBe(true);
  });

  it('returns true ignoring trailing slashes', () => {
    expect(isActivePath('/about/', '/about')).toBe(true);
    expect(isActivePath('/about', '/about/')).toBe(true);
  });

  it('returns false for different paths', () => {
    expect(isActivePath('/about', '/contact')).toBe(false);
  });

  it('handles root path', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/', '/about')).toBe(false);
  });
});

describe('getLocalePaths', () => {
  it('returns one entry per language', () => {
    const paths = getLocalePaths();
    expect(paths).toHaveLength(Object.keys(languages).length);
  });

  it('has undefined param for default locale (hr)', () => {
    const paths = getLocalePaths();
    expect(paths[0].params.lang).toBeUndefined();
  });

  it('has string params for non-default locales', () => {
    const paths = getLocalePaths();
    const nonDefault = paths.filter((p) => p.params.lang !== undefined);
    expect(nonDefault.map((p) => p.params.lang).sort()).toEqual(['de', 'en']);
  });
});

describe('i18n translation parity', () => {
  const hrKeys = Object.keys(hr).sort();
  const enKeys = Object.keys(en).sort();
  const deKeys = Object.keys(de).sort();

  it('all three language files have the same number of keys', () => {
    expect(enKeys.length).toBe(hrKeys.length);
    expect(deKeys.length).toBe(hrKeys.length);
  });

  it('English has all the same keys as Croatian', () => {
    const missingInEn = hrKeys.filter((k) => !enKeys.includes(k));
    expect(missingInEn).toEqual([]);
  });

  it('German has all the same keys as Croatian', () => {
    const missingInDe = hrKeys.filter((k) => !deKeys.includes(k));
    expect(missingInDe).toEqual([]);
  });

  it('no extra keys in English that are not in Croatian', () => {
    const extraInEn = enKeys.filter((k) => !hrKeys.includes(k));
    expect(extraInEn).toEqual([]);
  });

  it('no extra keys in German that are not in Croatian', () => {
    const extraInDe = deKeys.filter((k) => !hrKeys.includes(k));
    expect(extraInDe).toEqual([]);
  });
});
