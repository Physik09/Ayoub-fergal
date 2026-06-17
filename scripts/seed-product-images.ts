/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║  STOCK PHOTO SEED SCRIPT                                    ║
 * ║                                                              ║
 * ║  This script fetches stock photography from Unsplash/Pexels  ║
 * ║  and stores the URLs against products in the database.       ║
 * ║                                                              ║
 * ║  ⚠️  IMPORTANT LICENSING NOTE:                                ║
 * ║  Unsplash/Pexels images are free to use for prototyping      ║
 * ║  and development, but they ARE NOT photos of your actual     ║
 * ║  products. Before launching your store, replace these with   ║
 * ║  real product photography taken by you, your supplier, or a  ║
 * ║  professional photographer. Customers expect to see the      ║
 * ║  literal item they're ordering — especially in a dropshipping║
 * ║  or e-commerce context.                                      ║
 * ║                                                              ║
 * ║  Required env vars:                                          ║
 * ║    - PEXELS_API_KEY (free from https://www.pexels.com/api/)  ║
 * ║    - UNSPLASH_ACCESS_KEY (free from                         ║
 * ║        https://unsplash.com/developers)                      ║
 * ║    - DATABASE_URL (already configured)                       ║
 * ║                                                              ║
 * ║  Usage: npx tsx scripts/seed-product-images.ts              ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set');
const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

async function fetchImages(
  name: string,
  categorySlug: string
): Promise<string[]> {
  const queries = getQueries(name, categorySlug);
  const seen = new Set<string>();
  const results: string[] = [];

  for (const query of queries) {
    if (results.length >= 3) break;

    const pexelsUrls = await searchPexelsApi(query, 3 - results.length);
    for (const u of pexelsUrls) {
      if (!seen.has(u)) {
        seen.add(u);
        results.push(u);
      }
    }
    if (results.length >= 3) break;

    const unsplashUrls = await searchUnsplashApi(query, 3 - results.length);
    for (const u of unsplashUrls) {
      if (!seen.has(u)) {
        seen.add(u);
        results.push(u);
      }
    }
  }

  return results;
}

function getQueries(name: string, categorySlug: string): string[] {
  const color = extractColor(name);
  const categoryQueries: Record<string, string[]> = {
    hoodies: [
      "men's hoodie streetwear black",
      "men's hoodie minimal fashion",
    ],
    sweatpants: [
      "men's sweatpants streetwear",
      "men's joggers fashion",
    ],
    't-shirts': [
      "men's t-shirt plain fashion",
      "men's white t-shirt model",
    ],
    jackets: [
      "men's jacket urban fashion",
      "men's bomber jacket street style",
    ],
    accessoires: [
      "men's cap streetwear",
      "men's accessories fashion",
    ],
  };
  const base =
    categoryQueries[categorySlug] ?? ["men's fashion clothing"];
  return base.map((q) => `${color} ${q}`);
}

function extractColor(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('noir') || lower.includes('black')) return 'black';
  if (lower.includes('blanc') || lower.includes('white')) return 'white';
  if (lower.includes('gris') || lower.includes('grey') || lower.includes('gray'))
    return 'grey';
  if (lower.includes('kaki') || lower.includes('khaki')) return 'khaki';
  if (lower.includes('gold') || lower.includes('doré')) return 'gold';
  return 'black';
}

async function searchPexelsApi(
  query: string,
  perPage: number
): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('orientation', 'square');

    const res = await fetch(url.toString(), {
      headers: { Authorization: apiKey },
    });

    if (res.status === 429) {
      console.warn('  ⚠️  Pexels rate limited');
      return [];
    }
    if (!res.ok) return [];

    const data = await res.json();
    return (data.photos ?? []).map((p: any) => p.src.large);
  } catch {
    return [];
  }
}

async function searchUnsplashApi(
  query: string,
  perPage: number
): Promise<string[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', query);
    url.searchParams.set('per_page', String(perPage));
    url.searchParams.set('orientation', 'squarish');
    url.searchParams.set('color', 'black_and_white');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (res.status === 403) {
      console.warn('  ⚠️  Unsplash rate limited');
      return [];
    }
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results ?? []).map((p: any) => p.urls.regular);
  } catch {
    return [];
  }
}

async function main() {
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('  Stock Photo Seed Script');
  console.log('══════════════════════════════════════════════════');
  console.log('');
  console.log(
    '  ⚠️  IMPORTANT: These images are stock photos for prototyping.'
  );
  console.log(
    '  Replace them with real product photos before launch.'
  );
  console.log('');

  const hasPexels = !!process.env.PEXELS_API_KEY;
  const hasUnsplash = !!process.env.UNSPLASH_ACCESS_KEY;

  if (!hasPexels && !hasUnsplash) {
    console.log('  ❌ No API keys configured.');
    console.log(
      '     Set PEXELS_API_KEY and/or UNSPLASH_ACCESS_KEY in .env.local'
    );
    console.log(
      '     Pexels: https://www.pexels.com/api/'
    );
    console.log(
      '     Unsplash: https://unsplash.com/developers'
    );
    console.log('');
    return;
  }

  console.log(`  Providers:`);
  if (hasPexels) console.log('    • Pexels API ✓');
  if (hasUnsplash) console.log('    • Unsplash API ✓');
  console.log('');

  const products = await prisma.product.findMany({
    include: { category: true },
  });

  console.log(`  Found ${products.length} products in database`);
  console.log('');

  let updatedCount = 0;
  let skippedCount = 0;

  for (const product of products) {
    const categorySlug = product.category.slug;
    const query = `${extractColor(product.nameFr)} ${categorySlug === 'accessoires' ? 'cap streetwear' : categorySlug === 't-shirts' ? "men's t-shirt fashion" : `men's ${categorySlug} streetwear`}`;

    process.stdout.write(`  🔍 "${product.nameFr}" (${query})... `);

    const images = await fetchImages(product.nameFr, categorySlug);

    if (images.length === 0) {
      console.log('⚠️  No images found (keeping existing)');
      skippedCount++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { images },
    });

    console.log(`✅ ${images.length} image(s)`);
    images.forEach((img) => console.log(`       • ${img}`));
    updatedCount++;
  }

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`  Done: ${updatedCount} updated, ${skippedCount} skipped`);
  console.log('');
  console.log('  Next steps:');
  console.log('  1. Review the assigned images in your admin panel');
  console.log('  2. Swap out any mismatched images manually');
  console.log(
    '  3. Replace all stock photos with real product photography before launch'
  );
  console.log('══════════════════════════════════════════════════');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
