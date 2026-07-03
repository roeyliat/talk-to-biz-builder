import { describe, expect, it } from 'vitest';
import {
  findLocalImageUrl,
  findWholeWordLocalImageMatch,
  normalizeImageKey,
} from './localImageCatalog';

describe('findWholeWordLocalImageMatch', () => {
  const customEntries = [
    {
      alias: normalizeImageKey('קרמל'),
      imageUrl: '/aac-local/קרמל.png',
      tokens: ['קרמל'],
    },
    {
      alias: normalizeImageKey('קרמל מלוח עם שברי אפרופו'),
      imageUrl: encodeURI('/aac-local/קרמל מלוח עם שברי אפרופו.png'),
      tokens: ['קרמל', 'מלוח', 'עם', 'שברי', 'אפרופו'],
    },
    {
      alias: normalizeImageKey('שוקולד בלגי'),
      imageUrl: encodeURI('/aac-local/שוקולד בלגי.png'),
      tokens: ['שוקולד', 'בלגי'],
    },
  ];

  it('returns an exact local match first', () => {
    const result = findWholeWordLocalImageMatch(normalizeImageKey('שוקולד בלגי'), customEntries);

    expect(result).toBe(encodeURI('/aac-local/שוקולד בלגי.png'));
  });

  it('matches a local filename when it appears as full words inside a longer requested flavor', () => {
    const result = findWholeWordLocalImageMatch(normalizeImageKey('קרמל מלוח'), customEntries);

    expect(result).toBe(encodeURI('/aac-local/קרמל מלוח עם שברי אפרופו.png'));
  });

  it('prefers the most specific whole-word local match', () => {
    const result = findWholeWordLocalImageMatch(normalizeImageKey('שוקולד בלגי לבן'), customEntries);

    expect(result).toBe(encodeURI('/aac-local/שוקולד בלגי.png'));
  });

  it('does not match partial words', () => {
    const result = findWholeWordLocalImageMatch(normalizeImageKey('קרמלי'), customEntries);

    expect(result).toBeUndefined();
  });
});

describe('findLocalImageUrl', () => {
  it('uses the built-in local catalog before any cloud fallback', () => {
    const result = findLocalImageUrl('קרמל מלוח');

    expect(result).toBe(encodeURI('/aac-local/קרמל מלוח עם שברי אפרופו.png'));
  });

  it('does not resolve local images from partial-word overlaps', () => {
    const result = findLocalImageUrl('שוקולדי');

    expect(result).toBeUndefined();
  });
});
