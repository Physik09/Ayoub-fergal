'use client';

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link } from '@/i18n/navigation';

function SuccessContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const reference = searchParams.get('reference');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-2">{t('checkout.paymentSuccess')}</h1>
      {orderNumber && (
        <p className="text-gray-500 text-sm mb-1">
          {t('order.orderNumber')}: <span className="font-mono font-medium">{orderNumber}</span>
        </p>
      )}
      {reference && <p className="text-xs text-gray-400 mb-6">Réf: {reference}</p>}
      <Link href={`/commande/${orderNumber}`} className="inline-block bg-brand-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors">
        {t('checkout.viewOrder')}
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
