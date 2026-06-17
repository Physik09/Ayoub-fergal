import type { StockImageResult } from './types';

const UNSPLASH_API_BASE = 'https://api.unsplash.com/search/photos';

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    raw: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
}

export async function searchUnsplash(
  query: string,
  perPage = 3
): Promise<StockImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    console.warn(
      '[Unsplash] UNSPLASH_ACCESS_KEY is not set. Skipping Unsplash search.'
    );
    return [];
  }

  try {
    const url = new URL(UNSPLASH_API_BASE);
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('orientation', 'squarish');
    url.searchParams.set('color', 'black_and_white');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
      next: { revalidate: 86400 },
    });

    if (response.status === 403) {
      console.warn('[Unsplash] Rate limit hit (50 req/hr). Returning empty.');
      return [];
    }

    if (!response.ok) {
      console.warn(
        `[Unsplash] API error: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: UnsplashSearchResponse = await response.json();

    return data.results.map((photo) => ({
      url: photo.urls.regular,
      alt: photo.alt_description ?? query,
      attribution: {
        provider: 'unsplash' as const,
        photographerName: photo.user.name,
        photographerUrl: photo.user.links.html,
        pageUrl: photo.links.html,
      },
    }));
  } catch (error) {
    console.error('[Unsplash] Fetch error:', error);
    return [];
  }
}
