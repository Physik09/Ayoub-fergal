'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

const SHOP_TITLE = 'Boutique — Ayoub Fergal';
const SHOP_TITLE_AR = 'المتجر — أيوب فرڭال';

type Product = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  sellPrice: number;
  images: string[];
  category: { id: string; nameFr: string; nameAr: string } | null;
  variants: { size: string | null; stock: number }[];
};

type Category = { id: string; nameFr: string; nameAr: string };

function ShopContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  useEffect(() => {
    document.title = `${t('nav.shop')} — ${t('site.title')}`;
  }, [t]);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const cat = searchParams.get('category');
    return cat ? cat.split(',') : [];
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((data) => setCategories(data.categories ?? []));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategories.length) params.set('category', selectedCategories.join(','));
    if (selectedSizes.length) params.set('sizes', selectedSizes.join(','));
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (sort) params.set('sort', sort);
    params.set('status', 'ACTIVE');

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products);
    setTotal(data.total);
    setLoading(false);
  }, [selectedCategories, selectedSizes, sort, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const hasStock = (variants: { stock: number }[]) => variants.some((v) => v.stock > 0);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-xs uppercase tracking-[0.15em] font-semibold mb-4">
          {t('shop.filters')}
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">{t('shop.category')}</h3>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="accent-brand-gold"
                />
                <span className="text-sm text-gray-600">{cat.nameFr}</span>
              </label>
            ))}
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">{t('product.size')}</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`border px-3 py-1.5 text-xs transition-colors ${
                    selectedSizes.includes(s)
                      ? 'border-brand-black bg-brand-black text-white'
                      : 'border-gray-300 hover:border-brand-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">{t('shop.priceRange')}</h3>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder={t('shop.min')}
                value={priceRange.min}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                className="w-full border border-gray-300 px-2 py-1.5 text-xs outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder={t('shop.max')}
                value={priceRange.max}
                onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                className="w-full border border-gray-300 px-2 py-1.5 text-xs outline-none"
              />
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedSizes([]);
              setPriceRange({ min: '', max: '' });
              setSort('newest');
            }}
            className="text-xs text-brand-gold hover:underline"
          >
            {t('shop.resetFilters')}
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {total} {t('shop.products')}
          </p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-gray-300 px-3 py-1.5 text-sm outline-none"
          >
            <option value="newest">{t('shop.newest')}</option>
            <option value="price_asc">{t('shop.priceAsc')}</option>
            <option value="price_desc">{t('shop.priceDesc')}</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('common.loading')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">{t('shop.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => {
              const inStock = hasStock(product.variants);
              return (
                <Link key={product.id} href={`/produit/${product.slug}`} className="group">
                  <div className="aspect-[3/4] bg-gray-100 mb-3 overflow-hidden relative">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.nameFr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wider">
                        {t('shop.noImage')}
                      </div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs uppercase tracking-wider font-medium">
                          {t('shop.soldOut')}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-gold transition-colors">
                    {product.nameFr}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatPrice(product.sellPrice)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center py-12"><p className="text-gray-400">Chargement...</p></div>}>
        <ShopContent />
      </Suspense>
    </div>
  );
}
