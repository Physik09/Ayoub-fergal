'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';

type Order = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  city: string;
  address: Record<string, string>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  items: { id: string; productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
};

export default function AdminOrdersPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = parseInt(searchParams.get('page') || '1');
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/orders?page=${page}&limit=20`);
    const data = await res.json();
    setOrders(data.orders || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const goToPage = (p: number) => {
    router.push(`${pathname}?page=${p}`);
  };

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{t('admin.orders')}</h1>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('admin.noData')}</p>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('order.orderNumber')}</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('checkout.name')}</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('checkout.phone')}</th>
                  <th className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('checkout.city')}</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('cart.total')}</th>
                  <th className="text-center px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.status')}</th>
                  <th className="text-right px-4 py-3 font-medium text-xs uppercase tracking-wider text-gray-500">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.orderNumber} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">{order.orderNumber}</td>
                    <td className="px-4 py-3 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{order.customerPhone}</td>
                    <td className="px-4 py-3 text-gray-600">{order.city}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColor[order.status] || 'bg-gray-100'}`}>
                        {t(`order.${order.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/orders/${order.orderNumber}`} className="text-xs text-brand-gold hover:underline">
                        {t('admin.edit')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors"
              >
                {t('admin.prev')}
              </button>
              <span className="text-xs text-gray-500">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-brand-gold transition-colors"
              >
                {t('admin.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
