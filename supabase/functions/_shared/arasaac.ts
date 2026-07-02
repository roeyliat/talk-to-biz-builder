// Shared ARASAAC pictogram enrichment for menu edge functions.
// Looks up a free ARASAAC pictogram per menu item and attaches `imageUrl`.

interface MenuItem {
  text?: string;
  textEn?: string;
  icon?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

interface MenuCategory {
  items?: MenuItem[];
  [key: string]: unknown;
}

interface MenuData {
  categories?: MenuCategory[];
  [key: string]: unknown;
}

const arasaacImageUrl = (id: number): string =>
  `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;

async function findPictogram(query: string): Promise<string | undefined> {
  const term = query.trim();
  if (!term) return undefined;
  try {
    const res = await fetch(
      `https://api.arasaac.org/v1/pictograms/en/search/${encodeURIComponent(term)}`,
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    const first = Array.isArray(data) ? data[0] : undefined;
    return first?._id ? arasaacImageUrl(first._id) : undefined;
  } catch (_e) {
    return undefined;
  }
}

// Mutates menuData, attaching imageUrl to each item where a pictogram is found.
// Runs lookups with a small concurrency limit to stay within edge time/limits.
export async function enrichMenuWithArasaac(menuData: MenuData): Promise<void> {
  const items: MenuItem[] = [];
  for (const category of menuData.categories ?? []) {
    for (const item of category.items ?? []) {
      items.push(item);
    }
  }

  const CONCURRENCY = 5;
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (item) => {
        if (item.imageUrl) return;
        const query = (item.textEn || item.text || "").toString();
        const url = await findPictogram(query);
        if (url) item.imageUrl = url;
      }),
    );
  }
}
