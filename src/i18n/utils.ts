import hr from './hr.json';
import en from './en.json';
import de from './de.json';

export const languages = {
  hr: 'Hrvatski',
  en: 'English',
  de: 'Deutsch',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'hr';

const translations: Record<Lang, Record<string, string>> = { hr, en, de };

/**
 * Extract the language from a URL path.
 * Returns 'hr' for paths without a language prefix (default locale).
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) return lang as Lang;
  return defaultLang;
}

/**
 * Look up a translation by dot-notation key.
 * Falls back to Croatian if the key is missing in the target language.
 */
export function t(lang: Lang, key: string): string {
  return translations[lang]?.[key] ?? translations[defaultLang]?.[key] ?? key;
}

/**
 * Build a localized path. Croatian (default) has no prefix.
 * e.g. getLocalizedPath('en', '/about') => '/en/about'
 *      getLocalizedPath('hr', '/about') => '/about'
 */
export function getLocalizedPath(lang: Lang, path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return cleanPath;
  return `/${lang}${cleanPath}`;
}

/**
 * Get alternate language URLs for the current page (used for hreflang tags and language switcher).
 * When a site URL is provided, returns absolute URLs (required for hreflang SEO).
 */
export function getAlternateLinks(currentPath: string, siteUrl?: string): { lang: Lang; href: string }[] {
  const basePath = stripLangPrefix(currentPath);
  const base = siteUrl?.replace(/\/+$/, '') ?? '';

  const links = (Object.keys(languages) as Lang[]).map((lang) => ({
    lang,
    href: `${base}${getLocalizedPath(lang, basePath)}`,
  }));

  // Add x-default pointing to the default locale
  links.push({
    lang: 'x-default' as Lang,
    href: `${base}${getLocalizedPath(defaultLang, basePath)}`,
  });

  return links;
}

/**
 * Remove the language prefix from a path.
 * e.g. '/en/about' => '/about', '/about' => '/about'
 */
export function stripLangPrefix(path: string): string {
  const [, maybeLang, ...rest] = path.split('/');
  if (maybeLang in languages && maybeLang !== defaultLang) {
    return `/${rest.join('/')}` || '/';
  }
  return path;
}

/**
 * Build nav links for the given language.
 */
export function getNavLinks(lang: Lang) {
  return [
    { label: t(lang, 'nav.home'), href: getLocalizedPath(lang, '/') },
    { label: t(lang, 'nav.products'), href: getLocalizedPath(lang, '/products') },
    { label: t(lang, 'nav.about'), href: getLocalizedPath(lang, '/about') },
    { label: t(lang, 'nav.contact'), href: getLocalizedPath(lang, '/contact') },
  ];
}

/**
 * Static paths for [...lang] routes.
 * Returns params for all supported locales (undefined = default locale, no prefix).
 */
export function getLocalePaths() {
  return [
    { params: { lang: undefined } },
    ...Object.keys(languages)
      .filter((l) => l !== defaultLang)
      .map((l) => ({ params: { lang: l } })),
  ];
}

/**
 * Check if a nav link matches the current path.
 */
export function isActivePath(href: string, currentPath: string): boolean {
  const normalizedCurrent = currentPath.replace(/\/+$/, '') || '/';
  const normalizedHref = href.replace(/\/+$/, '') || '/';
  return normalizedCurrent === normalizedHref;
}
