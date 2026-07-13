import { useEffect, useMemo, useState } from 'react';
import { searchArasaac } from '@/lib/arasaac';
import {
  findFirstLocalImageUrl,
  normalizeImageKey,
  normalizeLocalAssetUrl,
} from '@/lib/localImageCatalog';

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

const isNestedAacLocalPath = (value: string) => {
  const decoded = decodeURIComponent(value).toLowerCase();
  return /\/aac-local\/[^/]+\//.test(decoded);
};

const remappedKeepsNestedPath = (explicitUrl: string, normalizedUrl: string) => {
  if (!isNestedAacLocalPath(explicitUrl)) {
    return true;
  }

  const decodedNormalized = decodeURIComponent(normalizedUrl).toLowerCase();
  // Reject basename collapse: /aac-local/flavors/x.png → /assets/aac-local/x.PNG
  return decodedNormalized.includes('/flavors/') || decodedNormalized.includes('flavors/');
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
  const preferredImageUrl = useMemo(() => {
    const explicitUrl = imageUrl?.trim();
    if (explicitUrl) {
      // Public Hosting serves /aac-local/flavors/* directly — do not remap via Vite discovery.
      if (explicitUrl.startsWith('/aac-local/flavors/')) {
        return explicitUrl;
      }

      const normalizedExplicitUrl = normalizeLocalAssetUrl(explicitUrl);
      if (normalizedExplicitUrl && remappedKeepsNestedPath(explicitUrl, normalizedExplicitUrl)) {
        return normalizedExplicitUrl;
      }
      return explicitUrl;
    }

    return findFirstLocalImageUrl(text, ...fallbackTerms);
  }, [fallbackTerms, imageUrl, text]);

  const [resolvedImageUrl, setResolvedImageUrl] = useState<string | undefined>(preferredImageUrl);

  useEffect(() => {
    setResolvedImageUrl(preferredImageUrl);
  }, [preferredImageUrl]);

  useEffect(() => {
    if (!allowCloudFallback || preferredImageUrl) {
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
  }, [allowCloudFallback, fallbackTerms, preferredImageUrl, text]);

  return resolvedImageUrl;
}
