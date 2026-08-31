import { describe, expect, it } from 'vitest';
import { selectAacCardColor, selectAacCategory } from './aacColorSelection';
import { getAacCardSurfaceClass } from './aacCardTemplate';

describe('selectAacCardColor — 5 Fitzgerald bands', () => {
  it.each([
    // green — verbs (check first)
    ['רוצה', 'green'],
    ['אוכל', 'green'],
    ['להזמין', 'green'],
    ['לטעום', 'green'],
    ['לשלם', 'green'],
    ['אני רוצה', 'green'],

    // blue — greetings / polite / full questions only
    ['שלום', 'blue'],
    ['תודה', 'blue'],
    ['בבקשה', 'blue'],
    ['איפה השירותים?', 'blue'],
    ['כמה עולה', 'blue'],

    // white — closed function list only
    ['כן', 'white'],
    ['לא', 'white'],
    ['אני', 'white'],
    ['עם', 'white'],
    ['ל', 'white'],

    // pink — adjectives / descriptors
    ['טעים', 'pink'],
    ['גדול', 'pink'],
    ['קר', 'pink'],

    // yellow — nouns (default; never green)
    ['גלידה', 'yellow'],
    ['שוקולד', 'yellow'],
    ['מלצר', 'yellow'],
  ] as const)('"%s" → %s', (text, expected) => {
    expect(selectAacCardColor(text)).toBe(expected);
  });

  it('never treats closed-list "ל" as an infinitive verb', () => {
    expect(selectAacCardColor('ל')).toBe('white');
  });

  it('prefers verb over polite when both appear', () => {
    expect(selectAacCardColor('רוצה תודה')).toBe('green');
  });

  it('does not default nouns to green', () => {
    expect(selectAacCardColor('פיסטוק')).toBe('yellow');
    expect(selectAacCardColor('תות')).toBe('yellow');
  });
});

describe('selectAacCategory', () => {
  it.each([
    ['רוצה', 'verbs'],
    ['להזמין', 'verbs'],
    ['אוכל', 'verbs'],
    ['שלום', 'questions'],
    ['תודה', 'questions'],
    ['איפה השירותים?', 'questions'],
    ['כן', 'social'],
    ['אני', 'social'],
    ['טעים', 'descriptors'],
    ['גדול', 'descriptors'],
    ['גלידה', 'people'],
    ['שוקולד', 'people'],
  ] as const)('"%s" → %s', (text, expected) => {
    expect(selectAacCategory(text)).toBe(expected);
  });

  it('stays aligned with selectAacCardColor bands and Figma surfaces', () => {
    const samples = [
      'רוצה',
      'תודה',
      'כן',
      'גלידה',
      'להזמין',
      'בבקשה',
      'טעים',
      'קר',
      'מלצר',
    ];
    for (const text of samples) {
      const color = selectAacCardColor(text);
      const category = selectAacCategory(text);
      if (color === 'green') expect(category).toBe('verbs');
      else if (color === 'blue') expect(category).toBe('questions');
      else if (color === 'white') expect(category).toBe('social');
      else if (color === 'pink') expect(category).toBe('descriptors');
      else expect(category).toBe('people');

      expect(getAacCardSurfaceClass(category)).toBeTruthy();
    }
  });
});
