'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { MOROCCAN_CITIES, DELIVERY_FEES, FREE_DELIVERY_THRESHOLD } from '@/lib/constants';

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();

  useEffect(() => {
    document.title = `${t('checkout.title')} — ${t('site.title')}`;
  }, [t]);
  const subtotal = getSubtotal();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ id: string; code: string; type: string; value: number } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');

  const deliveryFee = form.city
    ? subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEES[form.city] || 35
    : 0;

  const discount = appliedPromo
    ? appliedPromo.type === 'PERCENTAGE'
      ? subtotal * (appliedPromo.value / 100)
      : appliedPromo.value
    : 0;
  const total = subtotal + deliveryFee - discount;

  const applyPromoCode = async () => {
    const code = promoCodeInput.trim();
    if (!code) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await fetch('/api/promocodes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedPromo(data.promoCode);
        setPromoCodeInput('');
      } else {
        setPromoError(data.error || 'Code invalide');
      }
    } catch {
      setPromoError('Erreur lors de la validation');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.city) { setError(t('checkout.selectCity')); return; }
    setError('');
    setSubmitting(true);

    const orderData: Record<string, unknown> = {
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email || null,
      address: { street: form.address },
      city: form.city,
      deliveryFee,
      subtotal,
      discount,
      total,
      paymentMethod,
      promoCodeId: appliedPromo?.id || null,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId || null,
        productName: i.name,
        quantity: i.quantity,
        unitPrice: i.price,
        totalPrice: i.price * i.quantity,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create order');
      }

      const { order } = await res.json();
      clearCart();
      if (paymentMethod === 'ONLINE') {
        router.push(`/paiement/${order.orderNumber}`);
      } else {
        router.push(`/commande/${order.orderNumber}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">{t('cart.empty')}</p>
        <Link href="/shop" className="text-brand-gold hover:underline text-sm">{t('cart.continue')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('checkout.customerInfo')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('checkout.name')} *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('checkout.phone')} *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="06 XX XX XX XX"
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('checkout.email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('checkout.delivery')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('checkout.city')} *</label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                    required
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold"
                  >
                    <option value="">{t('checkout.selectCity')}</option>
                    {MOROCCAN_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">{t('checkout.address')} *</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    required
                    rows={3}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-brand-gold resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('checkout.payment')}</h2>
              <div className="space-y-3">
                <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                  paymentMethod === 'COD'
                    ? 'border-brand-gold bg-brand-gold/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-0.5 accent-brand-gold"
                  />
                  <div>
                    <p className="text-sm font-medium">{t('checkout.cod')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t('checkout.codInfo')}</p>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                  paymentMethod === 'ONLINE'
                    ? 'border-brand-gold bg-brand-gold/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'ONLINE'}
                    onChange={() => setPaymentMethod('ONLINE')}
                    className="mt-0.5 accent-brand-gold"
                  />
                  <div>
                    <p className="text-sm font-medium">{t('checkout.online')}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t('checkout.onlineInfo')}</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="border border-gray-200 p-6 sticky top-28">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">{t('cart.summary')}</h2>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <span className="text-gray-600 truncate">
                      {item.name}
                      {item.size && ` (${item.size})`}
                      <span className="text-gray-400"> ×{item.quantity}</span>
                    </span>
                    <span className="flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 space-y-3 text-sm">
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-700 font-medium">{appliedPromo.code}</span>
                      <span className="text-green-600">-{formatPrice(discount)}</span>
                    </div>
                    <button type="button" onClick={removePromoCode} className="text-gray-400 hover:text-red-500 text-xs">
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder={t('cart.promoCode')}
                      className="flex-1 border border-gray-300 px-3 py-2 text-xs outline-none focus:border-brand-gold"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyPromoCode())}
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      disabled={promoLoading}
                      className="border border-brand-black px-4 text-xs font-medium hover:bg-brand-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      {promoLoading ? '...' : t('cart.apply')}
                    </button>
                  </div>
                )}
                {promoError && <p className="text-red-500 text-xs">{promoError}</p>}

                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.shipping')}</span>
                  <span>
                    {deliveryFee === 0
                      ? <span className="text-green-600 text-xs font-medium">{t('cart.free')}</span>
                      : formatPrice(deliveryFee)
                    }
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('cart.discount')}</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-xs text-gray-400">
                    {t('cart.freeFrom', { amount: formatPrice(FREE_DELIVERY_THRESHOLD - subtotal) })}
                  </p>
                )}
              </div>

              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-black text-white py-3.5 mt-6 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {submitting ? '...' : t('checkout.placeOrder')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
