'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';

type Product = {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  sellPrice: number;
  status: string;
  featured: boolean;
  createdAt: string;
  category: { nameFr: string } | null;
  variants: { id: string; stock: number }[];
};

export default function AdminProductsPage() {
  const t = useTranslations();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('limit', '50');
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${t('admin.confirm')}: ${name} ?`)) return;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.products')}</h1>
        <Link
          href="/admin/products/new"
          className="bg-brand-black text-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
        >
          + {t('admin.add')}
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder={t('admin.search') + '...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand-gold"
        />
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.products')}</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.status')}</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Prix</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${product.id}`} className="hover:text-brand-gold transition-colors">
                        <p className="font-medium">{product.nameFr}</p>
                        <p className="text-xs text-gray-500">{product.category?.nameFr}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        product.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : product.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(product.sellPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${totalStock === 0 ? 'text-red-500' : totalStock < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs text-brand-gold hover:underline"
                        >
                          {t('admin.edit')}
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.nameFr)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          {t('admin.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
