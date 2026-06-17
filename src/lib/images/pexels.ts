import type { StockImageResult } from './types';

const PEXELS_API_BASE = 'https://api.pexels.com/v1/search';

interface PexelsPhoto {
  id: number;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  alt: string | null;
  photographer: string;
  photographer_url: string;
  url: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

export async function searchPexels(
  query: string,
  perPage = 3
): Promise<StockImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    console.warn('[Pexels] PEXELS_API_KEY is not set. Skipping Pexels search.');
    return [];
  }

  try {
    const url = new URL(PEXELS_API_BASE);
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('orientation', 'square');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
      },
      next: { revalidate: 86400 },
    });

    if (response.status === 429) {
      console.warn('[Pexels] Rate limit hit (200 req/hr). Returning empty.');
      return [];
    }

    if (!response.ok) {
      console.warn(
        `[Pexels] API error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: PexelsSearchResponse = await response.json();

    return data.photos.map((photo) => ({
      url: photo.src.large,
      alt: photo.alt ?? query,
      attribution: {
        provider: 'pexels' as const,
        photographerName: photo.photographer,
        photographerUrl: photo.photographer_url,
        pageUrl: photo.url,
      },
    }));
  } catch (error) {
    console.error('[Pexels] Fetch error:', error);
    return [];
  }
}
