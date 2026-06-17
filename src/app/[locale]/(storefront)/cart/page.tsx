'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

export default function CartPage() {
  const t = useTranslations();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  useEffect(() => {
    document.title = `${t('cart.title')} — ${t('site.title')}`;
  }, [t]);
  const subtotal = getSubtotal();
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES.Casablanca;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8">{t('cart.title')}</h1>
        <div className="text-center py-16">
          <svg className="mx-auto mb-4 text-gray-300" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p className="text-gray-500 mb-6">{t('cart.empty')}</p>
          <Link
            href="/shop"
            className="inline-block bg-brand-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
          >
            {t('cart.continue')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8">{t('cart.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 border border-gray-200 p-4">
              <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">Img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/produit/${item.slug}`} className="text-sm font-medium hover:text-brand-gold transition-colors">
                  {item.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.size && `${t('product.size')}: ${item.size}`}
                  {item.size && item.color && ' | '}
                  {item.color && `${t('product.color')}: ${item.color}`}
                </p>
                <p className="text-sm font-medium mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 text-xs hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-xs min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 text-xs hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  {t('cart.remove')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border border-gray-200 p-6 h-fit sticky top-28">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('cart.summary')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.subtotal')}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('cart.shipping')}</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 text-xs font-medium">{t('cart.free')}</span>
                ) : (
                  formatPrice(deliveryFee)
                )}
              </span>
            </div>
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <p className="text-xs text-gray-400">
                {t('cart.freeFrom', { amount: formatPrice(FREE_DELIVERY_THRESHOLD - subtotal) })}
              </p>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <Link
            href="/checkout"
            className="block w-full bg-brand-black text-white text-center py-3 mt-6 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
          >
            {t('cart.checkout')}
          </Link>
          <Link
            href="/shop"
            className="block w-full text-center py-2 mt-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {t('cart.continue')}
          </Link>
        </div>
      </div>
    </div>
  );
}
