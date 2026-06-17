'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';

type OrderItem = {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

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
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrderDetailPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    paramsPromise.then((p) => setOrderNumber(p.id));
  }, [paramsPromise]);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    setUpdating(false);
  };

  if (loading) return <p className="text-gray-500 text-sm">{t('common.loading')}</p>;
  if (!order) return <p className="text-gray-500 text-sm">{t('order.notFound')}</p>;

  const currentIdx = STATUS_FLOW.indexOf(order.status);

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('fr-FR')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-gray-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('checkout.customerInfo')}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-gray-500">{t('checkout.name')}</p><p className="font-medium">{order.customerName}</p></div>
              <div><p className="text-xs text-gray-500">{t('checkout.phone')}</p><p>{order.customerPhone}</p></div>
              <div><p className="text-xs text-gray-500">{t('checkout.email')}</p><p>{order.customerEmail || '—'}</p></div>
              <div><p className="text-xs text-gray-500">{t('checkout.city')}</p><p>{order.city}</p></div>
              <div className="col-span-2"><p className="text-xs text-gray-500">{t('checkout.address')}</p><p>{order.address?.street || '—'}</p></div>
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('cart.items')}</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2 font-medium text-xs text-gray-500">{t('admin.products')}</th>
                  <th className="text-center pb-2 font-medium text-xs text-gray-500">{t('product.quantity')}</th>
                  <th className="text-right pb-2 font-medium text-xs text-gray-500">Prix unitaire</th>
                  <th className="text-right pb-2 font-medium text-xs text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">{item.productName}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatPrice(item.unitPrice)}</td>
                    <td className="py-2 text-right font-medium">{formatPrice(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{t('cart.subtotal')}</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t('cart.shipping')}</span><span>{order.deliveryFee === 0 ? <span className="text-green-600 text-xs">{t('cart.free')}</span> : formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-1"><span>{t('cart.total')}</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('admin.status')}</h2>
            <div className="space-y-2">
              {STATUS_FLOW.map((status, idx) => {
                const isCurrent = status === order.status;
                const isPast = idx < currentIdx;
                const isCancelled = order.status === 'CANCELLED';
                const disabled = isCurrent || (isPast && !isCancelled) || updating;
                return (
                  <button
                    key={status}
                    onClick={() => updateStatus(status)}
                    disabled={disabled}
                    className={`w-full text-left px-3 py-2 text-sm border rounded transition-colors ${
                      isCurrent
                        ? 'border-brand-gold bg-brand-gold/5 text-brand-gold font-medium'
                        : isPast
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-400'
                    } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {isCurrent && '→ '}{t(`order.${status.toLowerCase()}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('checkout.payment')}</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Méthode</span>
                <span>{order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.online')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('admin.status')}</span>
                <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
