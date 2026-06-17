'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function NewsletterSignup() {
  const t = useTranslations();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch {
      setStatus('error');
      setMessage('Une erreur est survenue');
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase mb-3">
          {t('newsletter.title')}
        </h2>
        <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
          {t('newsletter.subtitle')}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex border border-gray-300 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('newsletter.placeholder')}
            required
            className="flex-1 px-4 py-3 text-sm outline-none bg-white"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-brand-black text-white px-6 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : t('newsletter.button')}
          </button>
        </form>
        {status === 'success' && (
          <p className="text-green-600 text-xs mt-3">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-red-500 text-xs mt-3">{message}</p>
        )}
      </div>
    </section>
  );
}
