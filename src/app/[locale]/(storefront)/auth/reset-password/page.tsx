'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const t = useTranslations();
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('account.passwordMin'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('account.passwordMismatch'));
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push('/account');
    }
  };

  if (!ready) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold tracking-[0.15em] uppercase mb-8 text-center">
        {t('account.newPassword')}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label={t('account.password')}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label={t('account.confirmPassword')}
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          {t('account.updatePassword')}
        </Button>
      </form>
    </div>
  );
}
