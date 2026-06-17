'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-xl font-bold tracking-[0.15em] uppercase mb-2">{t('error.title')}</h2>
      <p className="text-gray-500 text-sm mb-6">{error.message || t('error.message')}</p>
      <button
        onClick={reset}
        className="bg-brand-black text-white px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors"
      >
        {t('error.retry')}
      </button>
    </div>
  );
}
