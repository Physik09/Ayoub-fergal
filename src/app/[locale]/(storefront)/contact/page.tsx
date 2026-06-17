'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
  params: Promise<{ locale: string }>;
};

export default function ContactPage({ params }: Props) {
  const t = useTranslations();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setForm({ name: '', email: '', message: '' });
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
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-[0.15em] uppercase mb-8">{t('static.contact.title')}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
            {t('static.contact.name')}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 uppercase tracking-wider">
            {t('static.contact.message')}
          </label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            required
            className="w-full border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors resize-none"
          />
        </div>
        {status === 'success' && <p className="text-green-600 text-xs">{message}</p>}
        {status === 'error' && <p className="text-red-500 text-xs">{message}</p>}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-brand-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '...' : t('static.contact.send')}
        </button>
      </form>
    </div>
  );
}
