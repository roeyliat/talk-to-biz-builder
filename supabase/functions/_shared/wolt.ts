type RawWoltMenuItem = {
  text: string;
  description?: string;
  imageUrl?: string;
};

type RawWoltMenuCategory = {
  nameHe: string;
  items: RawWoltMenuItem[];
};

export type RawWoltMenuData = {
  businessNameHe: string;
  categories: RawWoltMenuCategory[];
};

const normalizeWhitespace = (value: string) =>
  value
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));

const stripHtmlTags = (value: string) =>
  normalizeWhitespace(decodeHtmlEntities(value.replace(/<[^>]+>/g, ' ')));

const extractBusinessName = (html: string) => {
  const headingMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawText = stripHtmlTags(headingMatch?.[1] ?? titleMatch?.[1] ?? 'תפריט');

  return normalizeWhitespace(rawText.split('|')[0] ?? rawText) || 'תפריט';
};

const extractSectionBlocks = (html: string) => {
  const marker = 'data-test-id="MenuSection"';
  const sections: string[] = [];
  let searchIndex = 0;

  while (true) {
    const startIndex = html.indexOf(marker, searchIndex);
    if (startIndex === -1) break;

    const nextIndex = html.indexOf(marker, startIndex + marker.length);
    sections.push(html.slice(startIndex, nextIndex === -1 ? html.length : nextIndex));
    searchIndex = startIndex + marker.length;
  }

  return sections;
};

const extractCategoryName = (sectionHtml: string) => {
  const match = sectionHtml.match(/data-test-id="MenuSectionTitle"[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i);
  return stripHtmlTags(match?.[1] ?? '');
};

const extractItems = (sectionHtml: string): RawWoltMenuItem[] => {
  const items: RawWoltMenuItem[] = [];

  const itemBlocks = sectionHtml.matchAll(
    /<div[^>]*data-test-id="horizontal-item-card"[^>]*>([\s\S]*?)<\/div>/gi,
  );

  for (const itemBlock of itemBlocks) {
    const cardHtml = itemBlock[1] ?? '';
    const headingMatch = cardHtml.match(/<h3[^>]*data-test-id="horizontal-item-card-header"[^>]*>([\s\S]*?)<\/h3>/i);
    const descriptionMatch = cardHtml.match(/<p[^>]*class="du2tpot"[^>]*>([\s\S]*?)<\/p>/i);
    const imageMatch = cardHtml.match(/data-test-id="horizontal-item-card-image"[^>]*src="([^"]+)"/i);

    const text = stripHtmlTags(headingMatch?.[1] ?? '');
    if (!text) continue;

    const description = stripHtmlTags(descriptionMatch?.[1] ?? '');
    const imageUrl = normalizeWhitespace(decodeHtmlEntities(imageMatch?.[1] ?? '')) || undefined;

    items.push({
      text,
      description: description || undefined,
      imageUrl,
    });
  }

  return items;
};

export const isWoltHost = (host: string) => /(^|\.)wolt\.com$/i.test(host);

export const extractWoltMenuDataFromHtml = (html: string): RawWoltMenuData | null => {
  const categories = extractSectionBlocks(html)
    .map((sectionHtml) => ({
      nameHe: extractCategoryName(sectionHtml),
      items: extractItems(sectionHtml),
    }))
    .filter((category) => category.nameHe && category.items.length > 0);

  if (categories.length === 0) {
    return null;
  }

  return {
    businessNameHe: extractBusinessName(html),
    categories,
  };
};