'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-4">
          {t('account.checkEmail')}
        </h1>
        <p className="text-gray-500 text-sm mb-6">{t('account.resetSent')}</p>
        <Link href="/auth/login" className="text-brand-gold hover:underline text-sm">
          {t('account.backToLogin')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8 text-center">
        {t('account.forgotPassword')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('account.email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          {t('account.sendReset')}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/auth/login" className="text-brand-gold hover:underline">
          {t('account.backToLogin')}
        </Link>
      </p>
    </div>
  );
}
