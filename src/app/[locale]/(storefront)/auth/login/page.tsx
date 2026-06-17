'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/account');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8 text-center">
        {t('account.login')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('account.email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {t('account.loginBtn')}
        </Button>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link href="/auth/forgot-password" className="hover:text-brand-gold transition-colors">
            {t('account.forgotPassword')}
          </Link>
        </p>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        {t('account.noAccount')}{' '}
        <Link href="/auth/register" className="text-brand-gold hover:underline">
          {t('account.register')}
        </Link>
      </p>
    </div>
  );
}
