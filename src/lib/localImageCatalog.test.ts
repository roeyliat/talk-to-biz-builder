import { describe, expect, it } from 'vitest';
import {
  DISCOVERED_LOCAL_IMAGES,
  findLocalImageUrl,
  findWholeWordLocalImageMatch,
  normalizeImageKey,
} from './localImageCatalog';

const expectResolvedAssetName = (value: string | undefined, fileName: string) => {
  expect(value).toBeTruthy();
  const resolvedValue = decodeURIComponent(value ?? '').toLowerCase();
  const expectedValue = fileName.toLowerCase();
  expect(resolvedValue).toContain(expectedValue);
};

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

    expectResolvedAssetName(result, 'שוקולד בלגי');
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

    expectResolvedAssetName(result, 'קרמל מלוח עם שברי אפרופו');
  });

  it('does not resolve local images from partial-word overlaps', () => {
    const result = findLocalImageUrl('שוקולדי');

    expect(result).toBeUndefined();
  });

  it('discovers uppercase extension files like טעמים.PNG', () => {
    const discoveredFlavors = DISCOVERED_LOCAL_IMAGES.find((entry) => entry.aliases[0] === 'טעמים');

    expect(discoveredFlavors?.imageUrl).toBeTruthy();
  });

  it('matches exact sorbet filenames and common OCR typo variants', () => {
    expect(findLocalImageUrl('סורבה תות')).toBeTruthy();
    expect(findLocalImageUrl('סרובה תות')).toBeTruthy();
  });
});
