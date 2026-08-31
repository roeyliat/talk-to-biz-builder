import type { FitzgeraldCategory } from '@/types/aac';

/**
 * AAC Fitzgerald-style card colors (5 bands):
 *   green  = verbs
 *   yellow = nouns / people (default for content nouns)
 *   pink   = adjectives / descriptors
 *   blue   = greetings, polite phrases, full questions
 *   white  = closed function-word list only
 *
 * Classification order: verb → blue (greeting/question) → white → pink → yellow.
 */

export type AacCardColor = 'green' | 'yellow' | 'pink' | 'blue' | 'white';

const WHITE_FUNCTION_WORDS = new Set([
  'כן',
  'לא',
  'אני',
  'אתה',
  'את',
  'הוא',
  'היא',
  'אנחנו',
  'אתם',
  'הן',
  'עם',
  'בלי',
  'של',
  'אל',
  'ל',
  'ב',
  'מ',
]);

const ALWAYS_VERBS = new Set(['רוצה', 'אוכל']);

const GREETING_OR_POLITE = new Set([
  'שלום',
  'היי',
  'הי',
  'בוקר טוב',
  'ערב טוב',
  'לילה טוב',
  'תודה',
  'תודה רבה',
  'בבקשה',
  'סליחה',
  'נעים מאוד',
  'להתראות',
  'יום טוב',
]);

const QUESTION_STARTERS = [
  'איפה',
  'מה',
  'כמה',
  'האם',
  'למה',
  'מתי',
  'איך',
  'מי',
  'אפשר',
  'מדוע',
];

/** Closed adjective / descriptor list (pink). */
const DESCRIPTOR_WORDS = new Set([
  'טעים',
  'לא טעים',
  'גדול',
  'גדולה',
  'קטן',
  'קטנה',
  'בינוני',
  'בינונית',
  'חם',
  'חמה',
  'חמים',
  'קר',
  'קרה',
  'מתוק',
  'מתוקה',
  'מלוח',
  'מלוחה',
  'חריף',
  'חריפה',
  'טרי',
  'טריה',
  'יקר',
  'יקרה',
  'זול',
  'זולה',
  'דחוף',
  'כואב',
  'נקי',
  'מלוכלך',
  'דק',
  'עבה',
  'ממולא',
  'צמחוני',
  'טבעוני',
  'אישית',
  'משפחתית',
  'רגיל',
  'רגילה',
  'ללא תוספות',
]);

const normalizeHebrew = (value: string) =>
  value
    .trim()
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[^\u0590-\u05FF\s?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isInfinitiveVerb = (token: string) => {
  // Single-letter "ל" is a white function word, never a verb.
  if (token.length < 2 || !token.startsWith('ל')) {
    return false;
  }
  if (WHITE_FUNCTION_WORDS.has(token)) {
    return false;
  }
  // Polite farewell "להתראות" is greeting/social, not an action verb.
  if (GREETING_OR_POLITE.has(token)) {
    return false;
  }
  return true;
};

const isVerbToken = (token: string) =>
  ALWAYS_VERBS.has(token) || isInfinitiveVerb(token);

const isVerbPhrase = (normalized: string) => {
  if (!normalized) {
    return false;
  }
  if (ALWAYS_VERBS.has(normalized) || isInfinitiveVerb(normalized)) {
    return true;
  }
  // Multi-word: any verb token (e.g. "אני רוצה") wins as verb before blue/white.
  return normalized.split(' ').some(isVerbToken);
};

const isGreetingOrPolite = (normalized: string) => {
  if (GREETING_OR_POLITE.has(normalized)) {
    return true;
  }
  return [...GREETING_OR_POLITE].some(
    (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
  );
};

const isFullQuestion = (normalized: string, original: string) => {
  if (original.includes('?') || normalized.endsWith('?')) {
    return true;
  }
  return QUESTION_STARTERS.some(
    (starter) => normalized === starter || normalized.startsWith(`${starter} `),
  );
};

const isWhiteFunctionWord = (normalized: string) =>
  WHITE_FUNCTION_WORDS.has(normalized);

const isDescriptorPhrase = (normalized: string) => {
  if (DESCRIPTOR_WORDS.has(normalized)) {
    return true;
  }
  return [...DESCRIPTOR_WORDS].some(
    (phrase) => normalized === phrase || normalized.startsWith(`${phrase} `),
  );
};

/**
 * Select AAC card color for a Hebrew label/phrase.
 * Order: verb → greeting/polite/question → white list → descriptor → yellow noun default.
 */
export const selectAacCardColor = (text: string): AacCardColor => {
  const original = text.trim();
  const normalized = normalizeHebrew(original);

  if (!normalized) {
    return 'yellow';
  }

  if (isVerbPhrase(normalized)) {
    return 'green';
  }

  if (isGreetingOrPolite(normalized) || isFullQuestion(normalized, original)) {
    return 'blue';
  }

  if (isWhiteFunctionWord(normalized)) {
    return 'white';
  }

  if (isDescriptorPhrase(normalized)) {
    return 'pink';
  }

  return 'yellow';
};

/**
 * Map Hebrew text to Fitzgerald category used when generating AAC board cells.
 * Aligns with selectAacCardColor so automatic boards get the correct Figma surfaces:
 *   green verbs → verbs (verb template)
 *   blue greetings/questions → questions (question template)
 *   white function words → social (communication template)
 *   pink adjectives → descriptors (descriptor template)
 *   yellow nouns → people (noun template)
 */
export const selectAacCategory = (text: string): FitzgeraldCategory => {
  const color = selectAacCardColor(text);
  switch (color) {
    case 'green':
      return 'verbs';
    case 'blue':
      return 'questions';
    case 'white':
      return 'social';
    case 'pink':
      return 'descriptors';
    case 'yellow':
    default:
      return 'people';
  }
};
