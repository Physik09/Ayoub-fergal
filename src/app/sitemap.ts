import { MetadataRoute } from 'next';

const LOCALES = ['fr', 'ar'] as const;
const BASE_URL = 'https://ayoubfergal.com';

const PAGES = [
  '',
  '/shop',
  '/cart',
  '/checkout',
  '/commande',
  '/order-tracking',
  '/about',
  '/contact',
  '/livraison-retours',
  '/cgv',
  '/faq',
  '/account',
  '/auth/login',
  '/auth/register',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  entries.push(
    { url: `${BASE_URL}/robots.txt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${BASE_URL}/sitemap.xml`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 }
  );

  return entries;
}
