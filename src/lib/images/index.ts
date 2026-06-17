import type { StockImageResult } from './types';
import { getSearchQueriesForProduct } from './types';
import { searchPexels } from './pexels';
import { searchUnsplash } from './unsplash';

export type { StockImageResult } from './types';
export { getSearchQueriesForProduct } from './types';
export { searchPexels } from './pexels';
export { searchUnsplash } from './unsplash';
export { ProductImagePlaceholder } from './ProductImagePlaceholder';

const MAX_IMAGES_PER_PRODUCT = 3;

export interface SearchOptions {
  name: string;
  categorySlug: string;
  colorHint?: string;
  preferredProvider?: 'pexels' | 'unsplash';
}

export async function searchProductImages(
  options: SearchOptions
): Promise<StockImageResult[]> {
  const queries = getSearchQueriesForProduct(
    options.name,
    options.categorySlug,
    options.colorHint
  );

  const uniqueUrls = new Set<string>();
  const results: StockImageResult[] = [];

  const providers =
    options.preferredProvider === 'pexels'
      ? ([searchPexels, searchUnsplash] as const)
      : options.preferredProvider === 'unsplash'
        ? ([searchUnsplash, searchPexels] as const)
        : ([searchPexels, searchUnsplash] as const);

  for (const query of queries) {
    if (results.length >= MAX_IMAGES_PER_PRODUCT) break;

    for (const searchFn of providers) {
      if (results.length >= MAX_IMAGES_PER_PRODUCT) break;

      try {
        const images = await searchFn(query, MAX_IMAGES_PER_PRODUCT);
        for (const img of images) {
          if (!uniqueUrls.has(img.url)) {
            uniqueUrls.add(img.url);
            results.push(img);
          }
          if (results.length >= MAX_IMAGES_PER_PRODUCT) break;
        }
      } catch (err) {
        console.warn(`[images] Provider search failed for "${query}":`, err);
      }
    }
  }

  return results;
}

export function imagesToUrls(images: StockImageResult[]): string[] {
  return images.map((img) => img.url);
}

export function imagesToAttribution(images: StockImageResult[]): string {
  return images
    .map(
      (img) =>
        `Photo by ${img.attribution.photographerName} on ${img.attribution.provider === 'unsplash' ? 'Unsplash' : 'Pexels'}`
    )
    .join('; ');
}
