const normalizeImageKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const imageModulePaths = Object.keys(
  import.meta.glob('../assets/aac-local/*.{png,jpg,jpeg,webp,svg,avif}'),
);

const extractFilename = (filePath: string) => {
  const lastSegment = filePath.split('/').pop() ?? filePath;
  return lastSegment.replace(/\.[^.]+$/, '');
};

const extractFileBasename = (filePath: string) => filePath.split('/').pop() ?? filePath;

const toStablePublicImageUrl = (filePath: string) => encodeURI(`/aac-local/${extractFileBasename(filePath)}`);

const buildAliasMap = (entries: Array<{ imageUrl: string; aliases: string[] }>) => {
  const aliasMap = new Map<string, string>();

  entries.forEach(({ imageUrl, aliases }) => {
    aliases.forEach((alias) => {
      const normalized = normalizeImageKey(alias);
      if (normalized && !aliasMap.has(normalized)) {
        aliasMap.set(normalized, imageUrl);
      }
    });
  });

  return aliasMap;
};

const tokenizeNormalizedKey = (value: string) =>
  normalizeImageKey(value)
    .split(' ')
    .filter(Boolean);

const DISCOVERED_LOCAL_IMAGES = imageModulePaths.map((filePath) => ({
  imageUrl: toStablePublicImageUrl(filePath),
  aliases: [extractFilename(filePath)],
}));

const stableDiscoveredImageMap = new Map(
  DISCOVERED_LOCAL_IMAGES.map((entry) => [normalizeImageKey(entry.aliases[0] ?? ''), entry.imageUrl]),
);

const findDiscoveredImageUrl = (...aliases: string[]) =>
  aliases
    .map((alias) => normalizeImageKey(alias))
    .find(Boolean)
    ? DISCOVERED_LOCAL_IMAGES.find((entry) => {
        const normalizedAliases = entry.aliases.map((alias) => normalizeImageKey(alias));
        return aliases.some((alias) => normalizedAliases.includes(normalizeImageKey(alias)));
      })?.imageUrl
    : undefined;

const LOCAL_IMAGE_ENTRIES = [
  {
    imageUrl: findDiscoveredImageUrl('גלידה', 'ice-cream') ?? '/aac-local/ice-cream.svg',
    aliases: ['ice cream', 'icecream', 'גלידה', 'gelato', 'sundae'],
  },
  {
    imageUrl: findDiscoveredImageUrl('שוקולד', 'chocolate') ?? '/aac-local/chocolate.svg',
    aliases: ['chocolate', 'שוקולד', 'שוקולד ציפס', 'שוקולד צ׳יפס', 'chocolate chips'],
  },
  {
    imageUrl: findDiscoveredImageUrl('וניל', 'vanilla') ?? '/aac-local/vanilla.svg',
    aliases: ['vanilla', 'וניל'],
  },
  {
    imageUrl: findDiscoveredImageUrl('פיסטוק', 'pistachio') ?? '/aac-local/pistachio.svg',
    aliases: ['pistachio', 'פיסטוק'],
  },
  {
    imageUrl: findDiscoveredImageUrl('תות', 'strawberry') ?? '/aac-local/strawberry.svg',
    aliases: ['strawberry', 'תות'],
  },
  {
    imageUrl: findDiscoveredImageUrl('לימון', 'lemon') ?? '/aac-local/lemon.svg',
    aliases: ['lemon', 'לימון'],
  },
  {
    imageUrl: findDiscoveredImageUrl('מנגו', 'mango') ?? '/aac-local/mango.svg',
    aliases: ['mango', 'מנגו', 'passion fruit', 'פסיפלורה'],
  },
  {
    imageUrl: findDiscoveredImageUrl('קפה', 'coffee') ?? '/aac-local/coffee.svg',
    aliases: ['coffee', 'קפה', 'espresso', 'latte', 'cappuccino', 'מוקה', 'mocha'],
  },
  {
    imageUrl: findDiscoveredImageUrl('עוגיה', 'cookie') ?? '/aac-local/cookie.svg',
    aliases: ['cookie', 'cookies', 'biscuit', 'עוגיה', 'ביסקוויט', 'biscoff'],
  },
  {
    imageUrl: findDiscoveredImageUrl('קרמל', 'caramel') ?? '/aac-local/caramel.svg',
    aliases: ['caramel', 'קרמל', 'dulce de leche', 'דולצה למנצ׳ה', 'דולצה למנצה', 'דולצה למנצ׳ה'],
  },
  {
    imageUrl: findDiscoveredImageUrl('גביע', 'cup') ?? '/aac-local/cup.svg',
    aliases: ['cup', 'גביע'],
  },
  {
    imageUrl: findDiscoveredImageUrl('קונוס', 'cone') ?? '/aac-local/cone.svg',
    aliases: ['cone', 'waffle cone', 'קונוס', 'גלידה'],
  },
  {
    imageUrl: findDiscoveredImageUrl('יוגורט', 'yogurt') ?? '/aac-local/yogurt.svg',
    aliases: ['frozen yogurt', 'yogurt', 'יוגורט', 'יוגורט קפוא'],
  },
  {
    imageUrl: findDiscoveredImageUrl('תוספות', 'toppings') ?? '/aac-local/toppings.svg',
    aliases: ['toppings', 'תוספות'],
  },
  {
    imageUrl: findDiscoveredImageUrl('סוכריות צבעוניות', 'sprinkles') ?? '/aac-local/sprinkles.svg',
    aliases: ['sprinkles', 'סוכריות צבעוניות'],
  },
  {
    imageUrl: findDiscoveredImageUrl('אגוזים', 'nuts') ?? '/aac-local/nuts.svg',
    aliases: ['nuts', 'אגוזים', 'אגוז לוז', 'hazelnut', 'hazelnuts'],
  },
] as const;

const localImageAliasMap = buildAliasMap([...DISCOVERED_LOCAL_IMAGES, ...LOCAL_IMAGE_ENTRIES]);
const normalizedLocalEntries = [...localImageAliasMap.entries()].map(([alias, imageUrl]) => ({
  alias,
  imageUrl,
  tokens: tokenizeNormalizedKey(alias),
}));

export function findLocalImageUrl(name?: string) {
  if (!name) {
    return undefined;
  }

  const normalizedName = normalizeImageKey(name);
  if (!normalizedName) {
    return undefined;
  }

  const exactMatch = localImageAliasMap.get(normalizedName);
  if (exactMatch) {
    return exactMatch;
  }

  const inclusiveMatch = normalizedLocalEntries.find(
    (entry) => normalizedName.includes(entry.alias) || entry.alias.includes(normalizedName),
  );
  if (inclusiveMatch) {
    return inclusiveMatch.imageUrl;
  }

  const nameTokens = tokenizeNormalizedKey(normalizedName);
  if (nameTokens.length === 0) {
    return undefined;
  }

  const rankedTokenMatch = normalizedLocalEntries
    .map((entry) => ({
      imageUrl: entry.imageUrl,
      score: entry.tokens.filter((token) => nameTokens.includes(token)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score)[0];

  return rankedTokenMatch?.imageUrl;
}

export function findFirstLocalImageUrl(...names: Array<string | undefined>) {
  for (const name of names) {
    const imageUrl = findLocalImageUrl(name);
    if (imageUrl) {
      return imageUrl;
    }
  }

  return undefined;
}

export function normalizeLocalAssetUrl(imageUrl?: string) {
  if (!imageUrl) {
    return undefined;
  }

  try {
    const parsedUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://')
      ? new URL(imageUrl)
      : new URL(imageUrl, 'https://talkbiz.local');

    const pathname = decodeURIComponent(parsedUrl.pathname);
    if (!pathname.includes('/aac-local/') && !pathname.includes('/assets/')) {
      return undefined;
    }

    const basename = extractFileBasename(pathname);
    const withoutExtension = basename.replace(/\.[^.]+$/, '');
    const withoutBuildHash = withoutExtension.replace(/-[A-Za-z0-9_]{6,}$/, '');
    const normalized = normalizeImageKey(withoutBuildHash);

    return stableDiscoveredImageMap.get(normalized);
  } catch {
    return undefined;
  }
}

export { normalizeImageKey, LOCAL_IMAGE_ENTRIES, DISCOVERED_LOCAL_IMAGES };