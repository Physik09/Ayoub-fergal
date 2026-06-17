'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';

type OrderItem = {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Order = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

function TrackForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/tracking?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-2">{t('order.title')}</h1>
      <p className="text-sm text-gray-500 mb-8">{t('order.subtitle')}</p>

      <form onSubmit={handleTrack} className="space-y-4 mb-10">
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('order.orderNumber')}</label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            placeholder="AF-XXXXXXXX-XXXX"
            className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('order.phone')}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="06 XX XX XX XX"
            className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : t('order.track')}
        </button>
      </form>

      {error && (
        <div className="border border-red-200 bg-red-50 p-4 mb-6">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          <div className="border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{t('order.orderNumber')}</p>
                <p className="font-mono font-medium">{order.orderNumber}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded ${
                order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-700' :
                order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {t(`order.${order.status.toLowerCase()}`)}
              </span>
            </div>
            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('cart.items')}</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.productName} <span className="text-gray-400">×{item.quantity}</span></span>
                  <span>{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">{t('cart.subtotal')}</span><span>{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">{t('cart.shipping')}</span><span>{order.deliveryFee === 0 ? <span className="text-green-600 text-xs">{t('cart.free')}</span> : formatPrice(order.deliveryFee)}</span></div>
              <div className="flex justify-between font-semibold pt-1"><span>{t('cart.total')}</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          <div className="border border-gray-200 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-3">{t('checkout.customerInfo')}</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-500">{t('checkout.name')}:</span> {order.customerName}</p>
              <p><span className="text-gray-500">{t('checkout.phone')}:</span> {order.customerPhone}</p>
              <p><span className="text-gray-500">{t('checkout.city')}:</span> {order.city}</p>
              <p><span className="text-gray-500">{t('checkout.payment')}:</span> {order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.online')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={null}>
      <TrackForm />
    </Suspense>
  );
}
