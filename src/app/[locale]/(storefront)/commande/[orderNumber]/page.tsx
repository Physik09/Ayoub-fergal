'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
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

export default function OrderConfirmationPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const t = useTranslations();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    paramsPromise.then((p) => setOrderNumber(p.orderNumber));
  }, [paramsPromise]);

  useEffect(() => {
    if (!orderNumber) return;
    fetch(`/api/orders/${encodeURIComponent(orderNumber)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p className="text-gray-400">{t('common.loading')}</p></div>;
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{t('order.notFound')}</p>
        <Link href="/shop" className="text-brand-gold hover:underline text-sm">{t('cart.continue')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-2">{t('checkout.confirmed')}</h1>
        <p className="text-gray-500 text-sm">{t('checkout.confirmationEmail')}</p>
      </div>

      <div className="border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('order.orderNumber')}</p>
            <p className="font-mono font-medium">{order.orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('order.status')}</p>
            <p className={`font-medium ${
              order.status === 'PENDING' ? 'text-yellow-600' :
              order.status === 'CONFIRMED' ? 'text-blue-600' :
              order.status === 'SHIPPED' ? 'text-purple-600' :
              order.status === 'DELIVERED' ? 'text-green-600' : 'text-red-600'
            }`}>
              {t(`order.${order.status.toLowerCase()}`)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('checkout.name')}</p>
            <p>{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('checkout.phone')}</p>
            <p>{order.customerPhone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('checkout.city')}</p>
            <p>{order.city}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{t('checkout.payment')}</p>
            <p>{order.paymentMethod === 'COD' ? t('checkout.cod') : t('checkout.online')}</p>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('cart.items')}</h2>
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.productName} <span className="text-gray-400">×{item.quantity}</span></span>
              <span>{formatPrice(item.totalPrice)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-200 mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">{t('cart.subtotal')}</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">{t('cart.shipping')}</span><span>{order.deliveryFee === 0 ? <span className="text-green-600 text-xs">{t('cart.free')}</span> : formatPrice(order.deliveryFee)}</span></div>
          <div className="flex justify-between font-semibold pt-1 border-t border-gray-200"><span>{t('cart.total')}</span><span>{formatPrice(order.total)}</span></div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/shop" className="inline-block bg-brand-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors">
          {t('cart.continue')}
        </Link>
      </div>
    </div>
  );
}
