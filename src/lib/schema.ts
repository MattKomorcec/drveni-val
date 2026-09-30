import { type Lang, t } from '../i18n/utils';

/**
 * schema.org structured data (JSON-LD) for search engines and AI assistants.
 * Every page gets the business and website entities; pages can add their own nodes.
 */

export const SITE = 'https://drvenival.hr';
export const BUSINESS_ID = `${SITE}/#business`;
export const WEBSITE_ID = `${SITE}/#website`;

export type SchemaNode = Record<string, unknown>;

export function businessSchema(lang: Lang, image: string): SchemaNode {
  return {
    '@type': 'Store',
    '@id': BUSINESS_ID,
    name: 'Drveni Val',
    legalName: 'Drveni val, obrt za izradu suvenira',
    description: t(lang, 'page.home.description'),
    url: `${SITE}/`,
    logo: `${SITE}/images/android-chrome-512x512.png`,
    image,
    telephone: '+385918889310',
    email: 'drvenival@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kralja Tomislava 3a',
      postalCode: '51250',
      addressLocality: 'Novi Vinodolski',
      addressCountry: 'HR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 45.1281648, longitude: 14.7873561 },
    hasMap: 'https://maps.app.goo.gl/vkM8cY1ng6xi3JL6A',
    founder: { '@type': 'Person', name: 'Željka Komorčec' },
    sameAs: ['https://www.facebook.com/drvenival', 'https://www.instagram.com/drveni_val/'],
    taxID: '17926688610',
  };
}

export function websiteSchema(): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE}/`,
    name: 'Drveni Val',
    inLanguage: ['hr', 'en', 'de'],
    publisher: { '@id': BUSINESS_ID },
  };
}

export function webPageSchema(url: string, title: string, description: string, lang: Lang): SchemaNode {
  return {
    '@type': 'WebPage',
    '@id': url,
    url,
    name: title,
    ...(description && { description }),
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': BUSINESS_ID },
  };
}

/** FAQ keys come in pairs: faq.q1/faq.a1, faq.q2/faq.a2, ... (same texts as the FAQ component). */
export function faqSchema(lang: Lang): SchemaNode {
  const questions: SchemaNode[] = [];
  // t() returns the key itself when a translation is missing, which marks the end of the list
  for (let i = 1; t(lang, `faq.q${i}`) !== `faq.q${i}`; i++) {
    questions.push({
      '@type': 'Question',
      name: t(lang, `faq.q${i}`),
      acceptedAnswer: { '@type': 'Answer', text: t(lang, `faq.a${i}`) },
    });
  }
  return { '@type': 'FAQPage', mainEntity: questions };
}

export function itemListSchema(name: string, items: { name: string; url: string; image: string }[]): SchemaNode {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
      image: item.image,
    })),
  };
}
