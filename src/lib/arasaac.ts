// ARASAAC pictogram helpers (https://arasaac.org)
// Free AAC pictogram library with an open API (CORS: *).

export interface ArasaacPictogram {
  id: number;
  imageUrl: string;
  keyword: string;
}

export const arasaacImageUrl = (id: number): string =>
  `https://static.arasaac.org/pictograms/${id}/${id}_500.png`;

interface ArasaacApiResult {
  _id: number;
  keywords?: Array<{ keyword?: string }>;
}

// Search ARASAAC pictograms by text. `language` is a 2-letter code (e.g. "en", "he").
export async function searchArasaac(
  query: string,
  language = "en",
  signal?: AbortSignal,
): Promise<ArasaacPictogram[]> {
  const term = query.trim();
  if (!term) return [];

  const res = await fetch(
    `https://api.arasaac.org/v1/pictograms/${language}/search/${encodeURIComponent(term)}`,
    { signal },
  );
  if (!res.ok) return [];

  const data: ArasaacApiResult[] = await res.json();
  return data.map((p) => ({
    id: p._id,
    imageUrl: arasaacImageUrl(p._id),
    keyword: p.keywords?.[0]?.keyword ?? term,
  }));
}
