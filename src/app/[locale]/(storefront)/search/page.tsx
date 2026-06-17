'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';

type Product = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  sellPrice: number;
  images: string[];
  variants: { stock: number }[];
};

type Props = {
  params: Promise<{ locale: string }>;
};

function SearchContent({ locale }: { locale: string }) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    fetch(`/api/products?search=${encodeURIComponent(query)}&limit=50`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">{t('search.empty')}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">{t('search.loading')}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        {t('search.results', { count: products.length })} &quot;{query}&quot;
      </p>
      <ProductGrid products={products} locale={locale} />
    </div>
  );
}

export default function SearchPage({ params }: Props) {
  const t = useTranslations();
  const [locale, setLocale] = useState('fr');

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-6">{t('search.title')}</h1>
      <Suspense fallback={<div className="text-center py-16"><p className="text-gray-400">{t('common.loading')}</p></div>}>
        <SearchContent locale={locale} />
      </Suspense>
    </div>
  );
}
