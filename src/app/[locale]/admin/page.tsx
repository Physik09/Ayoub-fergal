'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';

type DashboardData = {
  totalOrders: number;
  totalRevenue: number;
  pendingCOD: number;
  lowStockCount: number;
  ordersByStatus: { status: string; _count: number }[];
  recentOrders: { orderNumber: string; customerName: string; total: number; status: string; createdAt: string }[];
};

export default function AdminDashboard() {
  const t = useTranslations();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(async (r) => {
        if (!r.ok) throw new Error('Failed to load');
        setData(await r.json());
      })
      .catch(() => setError(true));
  }, []);

  const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8">{t('admin.dashboard')}</h1>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-red-600 text-sm">Impossible de charger les données du tableau de bord.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {data ? (
          <>
            <div className="border border-gray-200 p-4">
              <p className="text-2xl font-bold">{data.totalOrders}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t('admin.totalOrders')}</p>
            </div>
            <div className="border border-gray-200 p-4">
              <p className="text-2xl font-bold">{formatPrice(data.totalRevenue)}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t('admin.totalRevenue')}</p>
            </div>
            <div className="border border-gray-200 p-4">
              <p className="text-2xl font-bold">{data.pendingCOD}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t('admin.pendingCOD')}</p>
            </div>
            <Link href="/admin/products" className="border border-gray-200 p-4 hover:border-brand-gold transition-colors">
              <p className={`text-2xl font-bold ${data.lowStockCount > 0 ? 'text-red-500' : ''}`}>{data.lowStockCount}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{t('admin.lowStock')}</p>
            </Link>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 p-4 animate-pulse">
              <div className="h-7 bg-gray-100 w-16 mb-2" />
              <div className="h-3 bg-gray-100 w-24" />
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('common.status')}</h2>
          {data ? (
            <div className="space-y-2">
              {data.ordersByStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-0.5 text-xs rounded ${statusColor[s.status] || 'bg-gray-100'}`}>
                    {t(`order.${s.status.toLowerCase()}`)}
                  </span>
                  <span className="font-medium">{s._count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded" />)}
            </div>
          )}
        </div>

        <div className="border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider">{t('order.title')}</h2>
            <Link href="/admin/orders" className="text-xs text-brand-gold hover:underline">{t('featured.viewAll')}</Link>
          </div>
          {data ? (
            <div className="space-y-2">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.orderNumber}
                  href={`/admin/orders/${order.orderNumber}`}
                  className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-4 px-4 transition-colors"
                >
                  <div>
                    <p className="font-mono text-xs">{order.orderNumber}</p>
                    <p className="text-gray-500 text-xs">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.total)}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColor[order.status] || 'bg-gray-100'}`}>
                      {t(`order.${order.status.toLowerCase()}`)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
