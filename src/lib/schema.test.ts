import { describe, it, expect } from 'vitest';
import { businessSchema, faqSchema, itemListSchema } from './schema';
import { t } from '../i18n/utils';

describe('faqSchema', () => {
  it('includes every FAQ question with its answer', () => {
    const faq = faqSchema('en') as { mainEntity: { name: string; acceptedAnswer: { text: string } }[] };
    expect(faq.mainEntity).toHaveLength(4);
    expect(faq.mainEntity[2].name).toBe(t('en', 'faq.q3'));
    expect(faq.mainEntity[2].acceptedAnswer.text).toBe(t('en', 'faq.a3'));
  });

  it('has the same number of questions in every language', () => {
    const count = (lang: 'hr' | 'en' | 'de') => (faqSchema(lang).mainEntity as unknown[]).length;
    expect(count('hr')).toBe(count('en'));
    expect(count('hr')).toBe(count('de'));
  });
});

describe('businessSchema', () => {
  it('describes the studio with address and contact details', () => {
    const business = businessSchema('hr', 'https://drvenival.hr/image.jpg');
    expect(business['@type']).toBe('Store');
    expect(business.address).toMatchObject({ postalCode: '51250', addressLocality: 'Novi Vinodolski' });
    expect(business.telephone).toBe('+385918889310');
    expect(business.description).toBe(t('hr', 'page.home.description'));
  });
});

describe('itemListSchema', () => {
  it('numbers the items from 1', () => {
    const list = itemListSchema('Radovi', [
      { name: 'A', url: 'https://drvenival.hr/products/#a', image: 'https://drvenival.hr/a.webp' },
      { name: 'B', url: 'https://drvenival.hr/products/#b', image: 'https://drvenival.hr/b.webp' },
    ]) as { numberOfItems: number; itemListElement: { position: number }[] };
    expect(list.numberOfItems).toBe(2);
    expect(list.itemListElement.map((i) => i.position)).toEqual([1, 2]);
  });
});
