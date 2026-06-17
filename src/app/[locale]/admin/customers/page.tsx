'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatPrice } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';

type Customer = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  createdAt: string;
  _count: { orders: number; addresses: number };
};

export default function AdminCustomersPage() {
  const t = useTranslations();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetch(`/api/customers?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-6">{t('admin.customers')}</h1>

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : customers.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Nom</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Téléphone</th>
                <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Commandes</th>
                <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">Inscrit le</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-center">{c._count.orders}</td>
                  <td className="px-4 py-3 text-right text-gray-500 text-xs">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1} className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors">
              {t('admin.prev')}
            </button>
            <span className="text-xs text-gray-500">{page} / {totalPages}</span>
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages} className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors">
              {t('admin.next')}
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
