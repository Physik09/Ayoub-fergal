export interface StockImageResult {
  url: string;
  alt: string;
  attribution: {
    provider: 'unsplash' | 'pexels';
    photographerName: string;
    photographerUrl: string;
    pageUrl: string;
  };
}

export interface StockProvider {
  name: string;
  search: (query: string, perPage?: number) => Promise<StockImageResult[]>;
}

export const CATEGORY_SEARCH_QUERIES: Record<string, string[]> = {
  hoodies: [
    "men's hoodie streetwear black",
    "men's hoodie minimal fashion",
    "black hoodie urban style",
  ],
  sweatpants: [
    "men's sweatpants streetwear",
    "men's joggers fashion",
    "black joggers casual",
  ],
  't-shirts': [
    "men's t-shirt plain fashion",
    "men's white t-shirt model",
    "black t-shirt streetwear",
  ],
  jackets: [
    "men's jacket urban fashion",
    "men's bomber jacket street style",
    "black jacket streetwear",
  ],
  accessoires: [
    "men's cap streetwear",
    "men's accessories fashion",
    "urban hat snapback",
  ],
};

export function getSearchQueriesForProduct(
  name: string,
  categorySlug: string,
  colorHint?: string
): string[] {
  const categoryQueries = CATEGORY_SEARCH_QUERIES[categorySlug] ?? [
    "men's fashion clothing",
  ];
  const color = colorHint ?? extractColorFromName(name);
  const namedQueries = categoryQueries.map(
    (q) => `${color} ${q}`
  );
  return namedQueries;
}

function extractColorFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('noir') || lower.includes('black')) return 'black';
  if (lower.includes('blanc') || lower.includes('white')) return 'white';
  if (lower.includes('gris') || lower.includes('grey') || lower.includes('gray'))
    return 'grey';
  if (lower.includes('kaki') || lower.includes('khaki')) return 'khaki';
  if (lower.includes('gold') || lower.includes('doré')) return 'gold';
  if (lower.includes('rouge') || lower.includes('red')) return 'red';
  if (lower.includes('bleu') || lower.includes('blue')) return 'blue';
  if (lower.includes('vert') || lower.includes('green')) return 'green';
  return 'black';
}
