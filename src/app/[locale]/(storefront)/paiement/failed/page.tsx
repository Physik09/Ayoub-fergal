'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

function FailedContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-2">{t('checkout.paymentFailed')}</h1>
      <p className="text-gray-500 text-sm mb-6">{t('checkout.paymentFailedInfo')}</p>
      <div className="flex gap-4 justify-center">
        {orderNumber && (
          <Link href={`/paiement/${orderNumber}`} className="bg-brand-black text-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors">
            {t('checkout.retryPayment')}
          </Link>
        )}
        <Link href="/checkout" className="border border-brand-black text-brand-black px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-50 transition-colors">
          {t('cart.continue')}
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <FailedContent />
    </Suspense>
  );
}
