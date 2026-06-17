'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signUp(email, password, name, phone);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.needsConfirmation) {
      setNeedsConfirmation(true);
      setLoading(false);
    } else {
      router.push('/account');
    }
  };

  if (needsConfirmation) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-4">{t('account.checkEmail')}</h1>
        <p className="text-gray-500 text-sm mb-6">{t('account.confirmationSent')}</p>
        <Link href="/auth/login" className="text-brand-gold hover:underline text-sm">{t('account.backToLogin')}</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8 text-center">
        {t('account.register')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('checkout.name')}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label={t('account.email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label={t('checkout.phone')}
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label={t('account.password')}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          {t('account.registerBtn')}
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        {t('account.hasAccount')}{' '}
        <Link href="/auth/login" className="text-brand-gold hover:underline">
          {t('account.login')}
        </Link>
      </p>
    </div>
  );
}
