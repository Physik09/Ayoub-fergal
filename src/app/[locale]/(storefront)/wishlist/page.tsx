'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProtectedRoute } from '@/lib/auth';

type WishlistProduct = {
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

export default function WishlistPage({ params }: Props) {
  const t = useTranslations();
  const { user } = useAuth();
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('fr');

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/wishlist?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        const items = (data.items || []).map((item: { product: WishlistProduct }) => item.product);
        setProducts(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-6">
          {t('account.myWishlist')}
        </h1>

        {loading ? (
          <p className="text-gray-400">{t('common.loading')}</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">{t('wishlist.empty')}</p>
            <a href="/shop" className="text-brand-gold hover:underline text-sm">
              {t('wishlist.browse')}
            </a>
          </div>
        ) : (
          <ProductGrid products={products} locale={locale} />
        )}
      </div>
    </ProtectedRoute>
  );
}
