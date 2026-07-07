import { AACBoard, AACCell, FitzgeraldCategory } from '@/types/aac';
import { DISCOVERED_LOCAL_IMAGES, normalizeImageKey } from '@/lib/localImageCatalog';

export interface MenuItemData {
  id?: string;
  text: string;
  textEn?: string;
  category?: FitzgeraldCategory;
  icon?: string;
  imageUrl?: string;
}

export interface MenuCategoryData {
  id: string;
  name: string;
  nameHe?: string;
  items: MenuItemData[];
}

export interface MenuData {
  businessName: string;
  businessNameHe?: string;
  categories: MenuCategoryData[];
  standaloneItems?: MenuItemData[];
}

const DEFAULT_CATEGORY_LABELS = {
  he: 'פריטים',
  en: 'Items',
  ar: 'عناصر',
  ru: 'Позиции',
};

const CATEGORY_MATCHERS = [
  /^(?:category|section|menu|group)\s*[:\-]\s*(.+)$/i,
  /^(?:קטגוריה|מדור|קבוצה)\s*[:\-]\s*(.+)$/,
  /^(?:قسم|فئة)\s*[:\-]\s*(.+)$/,
  /^(?:категория|раздел|группа)\s*[:\-]\s*(.+)$/i,
  /^#{1,6}\s*(.+)$/,
];

const createId = (prefix: string, value: string, index: number) => {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  return `${prefix}-${slug || index + 1}-${index + 1}`;
};

const normalizeLine = (line: string) => line.replace(/^[-•*]\s*/, '').trim();

const extractCategoryName = (line: string) => {
  const trimmedLine = line.trim();

  for (const matcher of CATEGORY_MATCHERS) {
    const match = trimmedLine.match(matcher);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  if (trimmedLine.endsWith(':')) {
    return trimmedLine.slice(0, -1).trim();
  }

  return null;
};

const inferCategoryIcon = (categoryName: string): string => {
  const lowerName = categoryName.toLowerCase();

  if (lowerName.includes('drink') || lowerName.includes('beverage') || lowerName.includes('שת') || lowerName.includes('משקה')) return '🥤';
  if (lowerName.includes('coffee') || lowerName.includes('קפה')) return '☕';
  if (lowerName.includes('tea') || lowerName.includes('תה')) return '🍵';
  if (lowerName.includes('dessert') || lowerName.includes('sweet') || lowerName.includes('קינוח') || lowerName.includes('מתוק')) return '🍰';
  if (lowerName.includes('ice cream') || lowerName.includes('גליד')) return '🍦';
  if (lowerName.includes('pizza') || lowerName.includes('פיצה')) return '🍕';
  if (lowerName.includes('salad') || lowerName.includes('סלט')) return '🥗';
  if (lowerName.includes('soup') || lowerName.includes('מרק')) return '🍲';
  if (lowerName.includes('sandwich') || lowerName.includes('כריך')) return '🥪';
  if (lowerName.includes('burger') || lowerName.includes('המבורגר')) return '🍔';
  if (lowerName.includes('pasta') || lowerName.includes('פסטה')) return '🍝';
  if (lowerName.includes('breakfast') || lowerName.includes('ארוחת בוקר')) return '🍳';
  if (lowerName.includes('fish') || lowerName.includes('דג')) return '🐟';
  if (lowerName.includes('meat') || lowerName.includes('בשר')) return '🥩';
  return '🍽️';
};

const inferItemIcon = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();

  if (lowerName.includes('coffee') || lowerName.includes('קפה')) return '☕';
  if (lowerName.includes('tea') || lowerName.includes('תה')) return '🍵';
  if (lowerName.includes('water') || lowerName.includes('מים')) return '💧';
  if (lowerName.includes('juice') || lowerName.includes('מיץ')) return '🧃';
  if (lowerName.includes('cake') || lowerName.includes('עוג')) return '🍰';
  if (lowerName.includes('cookie') || lowerName.includes('עוגי')) return '🍪';
  if (lowerName.includes('ice cream') || lowerName.includes('גליד')) return '🍦';
  if (lowerName.includes('pizza') || lowerName.includes('פיצה')) return '🍕';
  if (lowerName.includes('burger') || lowerName.includes('המבורגר')) return '🍔';
  if (lowerName.includes('sandwich') || lowerName.includes('כריך')) return '🥪';
  if (lowerName.includes('salad') || lowerName.includes('סלט')) return '🥗';
  if (lowerName.includes('pasta') || lowerName.includes('פסטה')) return '🍝';
  return '📦';
};

const buildStandaloneCategoryLabel = (language?: string) => {
  if (language === 'he' || language === 'en' || language === 'ar' || language === 'ru') {
    return DEFAULT_CATEGORY_LABELS[language];
  }

  return DEFAULT_CATEGORY_LABELS.en;
};

const tokenizeNormalizedText = (value: string) =>
  normalizeImageKey(value)
    .split(' ')
    .filter(Boolean);

const DESCRIPTOR_FRAGMENTS = new Set([
  'שחור',
  'לבן',
  'מריר',
  'מלוח',
  'בלגי',
  'איטלקי',
  'black',
  'white',
  'dark',
  'salted',
  'belgian',
  'italian',
]);

const LOCAL_COMPOSITE_ITEM_ENTRIES = DISCOVERED_LOCAL_IMAGES
  .map((entry) => {
    const alias = entry.aliases[0] ?? '';
    const normalized = normalizeImageKey(alias);
    const tokens = tokenizeNormalizedText(alias);

    return {
      alias,
      normalized,
      imageUrl: entry.imageUrl,
      tokens,
    };
  })
  .filter((entry) => entry.tokens.length > 1)
  .sort((first, second) => second.tokens.length - first.tokens.length);

const dedupeAndNormalizeItems = (items: MenuItemData[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const normalized = normalizeImageKey(item.text);
    if (!normalized || seen.has(normalized)) {
      return false;
    }

    seen.add(normalized);
    return true;
  });
};

const mergeCompositeLocalItems = (items: MenuItemData[]) => {
  const normalizedItems = items.map((item, index) => ({
    item,
    index,
    normalized: normalizeImageKey(item.text),
    tokens: tokenizeNormalizedText(item.text),
  }));

  const consumedIndexes = new Set<number>();
  const mergedItems: Array<{ item: MenuItemData; index: number }> = [];

  for (const entry of LOCAL_COMPOSITE_ITEM_ENTRIES) {
    if (normalizedItems.some((candidate) => candidate.normalized === entry.normalized)) {
      continue;
    }

    const availableCandidates = normalizedItems.filter((candidate) => !consumedIndexes.has(candidate.index));
    let matchedIndexes: number[] | null = null;

    for (let startIndex = 0; startIndex < availableCandidates.length; startIndex += 1) {
      const nextMatchedIndexes: number[] = [];
      let tokenCursor = 0;

      for (let candidateIndex = startIndex; candidateIndex < availableCandidates.length; candidateIndex += 1) {
        const candidate = availableCandidates[candidateIndex];
        const candidateTokenSlice = entry.tokens.slice(tokenCursor, tokenCursor + candidate.tokens.length);

        if (
          candidate.tokens.length === 0 ||
          candidateTokenSlice.length !== candidate.tokens.length ||
          candidate.tokens.some((token, tokenIndex) => candidateTokenSlice[tokenIndex] !== token)
        ) {
          if (nextMatchedIndexes.length > 0) {
            break;
          }

          continue;
        }

        nextMatchedIndexes.push(candidate.index);
        tokenCursor += candidate.tokens.length;

        if (tokenCursor === entry.tokens.length) {
          matchedIndexes = nextMatchedIndexes;
          break;
        }
      }

      if (matchedIndexes) {
        break;
      }
    }

    if (!matchedIndexes || matchedIndexes.length === 0) {
      continue;
    }

    matchedIndexes.forEach((index) => consumedIndexes.add(index));

    const sourceItem = normalizedItems.find((candidate) => candidate.index === matchedIndexes[0])?.item;
    mergedItems.push({
      index: Math.min(...matchedIndexes),
      item: {
        id: createId('item', entry.alias, Math.min(...matchedIndexes)),
        text: entry.alias,
        textEn: entry.alias,
        category: sourceItem?.category || 'people',
        icon: sourceItem?.icon || inferItemIcon(entry.alias),
        imageUrl: entry.imageUrl,
      },
    });
  }

  const filteredItems = normalizedItems
    .filter((candidate) => !consumedIndexes.has(candidate.index))
    .map((candidate) => ({ item: candidate.item, index: candidate.index }));

  return [...filteredItems, ...mergedItems]
    .sort((first, second) => first.index - second.index)
    .map((entry) => entry.item);
};

const dropDescriptorFragments = (items: MenuItemData[]) => {
  const normalizedItems = items.map((item) => ({
    item,
    normalized: normalizeImageKey(item.text),
    tokens: tokenizeNormalizedText(item.text),
  }));

  return normalizedItems
    .filter(({ normalized, tokens }) => {
      if (tokens.length !== 1 || !DESCRIPTOR_FRAGMENTS.has(normalized)) {
        return true;
      }

      return !normalizedItems.some((candidate) =>
        candidate.normalized !== normalized &&
        candidate.tokens.length > 1 &&
        candidate.tokens.includes(normalized),
      );
    })
    .map(({ item }) => item);
};

export const sanitizeMenuData = (menuData: MenuData): MenuData => {
  const sanitizeItems = (items: MenuItemData[]) =>
    dropDescriptorFragments(mergeCompositeLocalItems(dedupeAndNormalizeItems(items)));

  return {
    ...menuData,
    categories: menuData.categories.map((category) => ({
      ...category,
      items: sanitizeItems(category.items),
    })).filter((category) => category.items.length > 0),
    standaloneItems: sanitizeItems(menuData.standaloneItems ?? []),
  };
};

const parseMenuItemLine = (line: string, index: number): MenuItemData | null => {
  const cleanedLine = normalizeLine(line);
  if (!cleanedLine) {
    return null;
  }

  const parts = cleanedLine.split('|').map((part) => part.trim()).filter(Boolean);
  const text = parts[0];
  const textEn = parts[1] || parts[0];
  const icon = parts[2] || inferItemIcon(parts[0]);

  if (!text) {
    return null;
  }

  return {
    id: createId('item', text, index),
    text,
    textEn,
    category: 'people',
    icon,
  };
};

export const parseManualMenuText = (
  menuText: string,
  options?: { businessName?: string; language?: string }
): MenuData => {
  const lines = menuText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const categories: MenuCategoryData[] = [];
  const standaloneItems: MenuItemData[] = [];
  let currentCategory: MenuCategoryData | null = null;

  lines.forEach((line, index) => {
    const categoryName = extractCategoryName(line);
    if (categoryName) {
      currentCategory = {
        id: createId('category', categoryName, categories.length),
        name: categoryName,
        nameHe: categoryName,
        items: [],
      };
      categories.push(currentCategory);
      return;
    }

    const item = parseMenuItemLine(line, index);
    if (!item) {
      return;
    }

    if (currentCategory) {
      currentCategory.items.push(item);
      return;
    }

    standaloneItems.push(item);
  });

  if (categories.length === 0 && standaloneItems.length > 0) {
    categories.push({
      id: createId('category', buildStandaloneCategoryLabel(options?.language), 0),
      name: buildStandaloneCategoryLabel(options?.language),
      nameHe: buildStandaloneCategoryLabel(options?.language),
      items: standaloneItems,
    });
    standaloneItems.length = 0;
  }

  return {
    businessName: options?.businessName?.trim() || 'Manual Menu',
    businessNameHe: options?.businessName?.trim() || 'תפריט ידני',
    categories: categories.filter((category) => category.items.length > 0),
    standaloneItems,
  };
};

export const convertMenuToBoards = (menuData: MenuData): Record<string, AACBoard> => {
  const boards: Record<string, AACBoard> = {};

  const mainCells: AACCell[] = menuData.categories.map((category) => ({
    id: `cat-${category.id}`,
    text: category.nameHe || category.name,
    textEn: category.name,
    category: 'people' as FitzgeraldCategory,
    icon: inferCategoryIcon(category.nameHe || category.name),
    linkToBoardId: category.id,
  }));

  const standaloneCells: AACCell[] = (menuData.standaloneItems ?? []).map((item, index) => ({
    id: item.id || createId('main-item', item.text, index),
    text: item.text,
    textEn: item.textEn || item.text,
    category: item.category || 'people',
    icon: item.icon || inferItemIcon(item.text),
    imageUrl: item.imageUrl,
  }));

  boards.main = {
    id: 'main',
    name: menuData.businessNameHe || menuData.businessName || 'תפריט',
    nameEn: menuData.businessName || menuData.businessNameHe || 'Menu',
    cells: [...standaloneCells, ...mainCells],
    gridSize: {
      cols: Math.min(Math.max(Math.ceil(Math.sqrt(standaloneCells.length + mainCells.length)), 2), 4),
      rows: Math.max(1, Math.ceil((standaloneCells.length + mainCells.length) / 4)),
    },
  };

  menuData.categories.forEach((category, categoryIndex) => {
    const cells: AACCell[] = category.items.map((item, itemIndex) => ({
      id: item.id || createId('item', item.text, itemIndex),
      text: item.text,
      textEn: item.textEn || item.text,
      category: item.category || 'people',
      icon: item.icon || inferItemIcon(item.text),
      imageUrl: item.imageUrl,
    }));

    boards[category.id || createId('category', category.name, categoryIndex)] = {
      id: category.id || createId('category', category.name, categoryIndex),
      name: category.nameHe || category.name,
      nameEn: category.name,
      parentBoardId: 'main',
      cells,
      gridSize: {
        cols: Math.min(Math.max(Math.ceil(Math.sqrt(cells.length)), 2), 4),
        rows: Math.max(1, Math.ceil(cells.length / 4)),
      },
    };
  });

  return boards;
};
