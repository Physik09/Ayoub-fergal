'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PaymentRedirectPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const t = useTranslations();
  const [status, setStatus] = useState<'processing' | 'redirecting' | 'error'>('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    paramsPromise.then(async ({ orderNumber }) => {
      try {
        const res = await fetch('/api/payments/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber, method: 'mock' }),
        });
        const data = await res.json();
        if (data.result?.redirectUrl) {
          setStatus('redirecting');
          window.location.href = data.result.redirectUrl;
        } else {
          throw new Error(data.error || 'Payment failed');
        }
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Erreur de paiement');
      }
    });
  }, [paramsPromise]);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {status === 'processing' && (
        <>
          <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('checkout.processingPayment')}</p>
        </>
      )}
      {status === 'redirecting' && (
        <p className="text-gray-600">{t('checkout.redirecting')}</p>
      )}
      {status === 'error' && (
        <>
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/checkout" className="text-brand-gold hover:underline text-sm">{t('cart.continue')}</Link>
        </>
      )}
    </div>
  );
}
