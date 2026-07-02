import { useEffect, useMemo, useState } from 'react';
import { searchArasaac } from '@/lib/arasaac';
import { findFirstLocalImageUrl, normalizeImageKey, normalizeLocalAssetUrl } from '@/lib/localImageCatalog';

const cloudImageCache = new Map<string, string | null>();

const detectQueryLanguage = (value: string) => (/^[\u0590-\u05FF\s\d'"-]+$/.test(value) ? 'he' : 'en');

const resolveCloudImage = async (query: string) => {
  const normalizedQuery = normalizeImageKey(query);
  if (!normalizedQuery) {
    return undefined;
  }

  if (cloudImageCache.has(normalizedQuery)) {
    return cloudImageCache.get(normalizedQuery) ?? undefined;
  }

  try {
    const results = await searchArasaac(query, detectQueryLanguage(query));
    const nextImage = results[0]?.imageUrl;
    cloudImageCache.set(normalizedQuery, nextImage ?? null);
    return nextImage;
  } catch {
    cloudImageCache.set(normalizedQuery, null);
    return undefined;
  }
};

interface UseResolvedAacImageInput {
  text?: string;
  imageUrl?: string;
  fallbackTerms?: string[];
  allowCloudFallback?: boolean;
}

export function useResolvedAacImage({
  text,
  imageUrl,
  fallbackTerms = [],
  allowCloudFallback = true,
}: UseResolvedAacImageInput) {
  const normalizedImageUrl = useMemo(() => normalizeLocalAssetUrl(imageUrl) ?? imageUrl, [imageUrl]);

  const localImageUrl = useMemo(
    () => findFirstLocalImageUrl(text, ...fallbackTerms),
    [fallbackTerms, text],
  );

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | undefined>(localImageUrl ?? normalizedImageUrl);

  useEffect(() => {
    setResolvedImageUrl(localImageUrl ?? normalizedImageUrl);
  }, [localImageUrl, normalizedImageUrl]);

  useEffect(() => {
    if (!allowCloudFallback || localImageUrl || normalizedImageUrl) {
      return;
    }

    const queries = [text, ...fallbackTerms].filter((value): value is string => Boolean(value?.trim()));
    if (queries.length === 0) {
      return;
    }

    let isCancelled = false;

    const load = async () => {
      for (const query of queries) {
        const cloudImage = await resolveCloudImage(query);
        if (cloudImage) {
          if (!isCancelled) {
            setResolvedImageUrl(cloudImage);
          }
          return;
        }
      }
    };

    void load();

    return () => {
      isCancelled = true;
    };
  }, [allowCloudFallback, fallbackTerms, localImageUrl, normalizedImageUrl, text]);

  return resolvedImageUrl;
}