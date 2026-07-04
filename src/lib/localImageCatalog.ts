const normalizeImageKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const imageModules = import.meta.glob([
  '../assets/aac-local/*.{png,jpg,jpeg,webp,svg,avif}',
  '../assets/aac-local/*.{PNG,JPG,JPEG,WEBP,SVG,AVIF}',
], {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const imageModulePaths = Object.keys(imageModules);

const extractFilename = (filePath: string) => {
  const lastSegment = filePath.split('/').pop() ?? filePath;
  return lastSegment.replace(/\.[^.]+$/, '');
};

const extractExtension = (filePath: string) => filePath.split('.').pop()?.toLowerCase() ?? '';

const extractFileBasename = (filePath: string) => filePath.split('/').pop() ?? filePath;

const toBundledImageUrl = (filePath: string) => imageModules[filePath] ?? encodeURI(`/aac-local/${extractFileBasename(filePath)}`);

const buildAliasMap = (entries: Array<{ imageUrl: string; aliases: string[] }>) => {
  const aliasMap = new Map<string, string>();

  entries.forEach(({ imageUrl, aliases }) => {
    aliases.forEach((alias) => {
      const normalized = normalizeImageKey(alias);
      if (normalized) {
        aliasMap.set(normalized, imageUrl);
      }
    });
  });

  return aliasMap;
};

const getDiscoveredImagePriority = (filePath: string) => {
  const extension = extractExtension(filePath);
  const filename = extractFilename(filePath);
  const hasTrailingSpaceInFilename = /\s$/.test(filename);

  const extensionPriority: Record<string, number> = {
    png: 5,
    jpg: 4,
    jpeg: 3,
    webp: 2,
    avif: 1,
    svg: 0,
  };

  return (extensionPriority[extension] ?? -1) * 10 + (hasTrailingSpaceInFilename ? 0 : 1);
};

const tokenizeNormalizedKey = (value: string) =>
  normalizeImageKey(value)
    .split(' ')
    .filter(Boolean);

const hasWholeWordSequenceMatch = (sourceTokens: string[], candidateTokens: string[]) => {
  if (sourceTokens.length === 0 || candidateTokens.length === 0 || candidateTokens.length > sourceTokens.length) {
    return false;
  }

  for (let startIndex = 0; startIndex <= sourceTokens.length - candidateTokens.length; startIndex += 1) {
    const candidateMatches = candidateTokens.every(
      (token, tokenIndex) => sourceTokens[startIndex + tokenIndex] === token,
    );

    if (candidateMatches) {
      return true;
    }
  }

  return false;
};

const DISCOVERED_LOCAL_IMAGES = imageModulePaths
  .sort((firstPath, secondPath) => {
    const priorityDifference = getDiscoveredImagePriority(firstPath) - getDiscoveredImagePriority(secondPath);
    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    return firstPath.localeCompare(secondPath);
  })
  .map((filePath) => ({
    imageUrl: toBundledImageUrl(filePath),
    aliases: [extractFilename(filePath)],
  }));

const stableDiscoveredImageMap = new Map(
  DISCOVERED_LOCAL_IMAGES.map((entry) => [normalizeImageKey(entry.aliases[0] ?? ''), entry.imageUrl]),
);

const findDiscoveredImageUrl = (...aliases: string[]) =>
  aliases
    .map((alias) => normalizeImageKey(alias))
    .find(Boolean)
    ? aliases
        .map((alias) => stableDiscoveredImageMap.get(normalizeImageKey(alias)))
        .find(Boolean)
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
    imageUrl: findDiscoveredImageUrl('גביע', 'כוס', 'cup') ?? '/aac-local/cup.svg',
    aliases: ['cup', 'גביע', 'כוס'],
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
    imageUrl: findDiscoveredImageUrl('טעמים', 'flavors', 'flavours') ?? '/aac-local/ice-cream.svg',
    aliases: ['טעמים', 'טעם', 'flavors', 'flavours', 'choose flavor'],
  },
  {
    imageUrl: findDiscoveredImageUrl('סורבה תות', 'סרובה תות', 'strawberry sorbet') ?? '/aac-local/strawberry.svg',
    aliases: ['סורבה תות', 'סרובה תות', 'strawberry sorbet', 'sorbet strawberry'],
  },
  {
    imageUrl: findDiscoveredImageUrl('סורבה', 'סרובה', 'sorbet') ?? '/aac-local/ice-cream.svg',
    aliases: ['סורבה', 'סרובה', 'sorbet'],
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

export function findWholeWordLocalImageMatch(
  normalizedName: string,
  entries: Array<{ alias: string; imageUrl: string; tokens: string[] }> = normalizedLocalEntries,
) {
  const exactMatch = localImageAliasMap.get(normalizedName);
  if (exactMatch) {
    return exactMatch;
  }

  const nameTokens = tokenizeNormalizedKey(normalizedName);
  if (nameTokens.length === 0) {
    return undefined;
  }

  const rankedWholeWordMatch = entries
    .map((entry) => {
      const queryContainsAlias = hasWholeWordSequenceMatch(nameTokens, entry.tokens);
      const aliasContainsQuery = hasWholeWordSequenceMatch(entry.tokens, nameTokens);

      if (!queryContainsAlias && !aliasContainsQuery) {
        return null;
      }

      const matchedTokenCount = Math.min(nameTokens.length, entry.tokens.length);

      return {
        entry,
        matchedTokenCount,
        aliasContainsQuery,
        queryContainsAlias,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .sort((first, second) => {
      if (second.matchedTokenCount !== first.matchedTokenCount) {
        return second.matchedTokenCount - first.matchedTokenCount;
      }

      if (Number(second.aliasContainsQuery) !== Number(first.aliasContainsQuery)) {
        return Number(second.aliasContainsQuery) - Number(first.aliasContainsQuery);
      }

      if (second.entry.tokens.length !== first.entry.tokens.length) {
        return second.entry.tokens.length - first.entry.tokens.length;
      }

      if (second.entry.alias.length !== first.entry.alias.length) {
        return second.entry.alias.length - first.entry.alias.length;
      }

      return 0;
    })[0];

  return rankedWholeWordMatch?.entry.imageUrl;
}

export function findLocalImageUrl(name?: string) {
  if (!name) {
    return undefined;
  }

  const normalizedName = normalizeImageKey(name);
  if (!normalizedName) {
    return undefined;
  }

  return findWholeWordLocalImageMatch(normalizedName);
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