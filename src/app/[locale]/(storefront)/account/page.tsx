'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/lib/auth';

export default function AccountPage() {
  const t = useTranslations();
  const { user, signOut } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-[0.15em] uppercase">
            {t('nav.account')}
          </h1>
          <Button variant="ghost" size="sm" onClick={signOut}>
            {t('account.logout')}
          </Button>
        </div>

        <div className="border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">
            {user?.email}
          </h2>
          <p className="text-xs text-gray-500">
            {user?.user_metadata?.name}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/order-tracking"
            className="block border border-gray-200 p-4 hover:border-brand-gold transition-colors"
          >
            <p className="text-sm font-medium">{t('account.myOrders')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('account.ordersDesc')}</p>
          </Link>
          <Link
            href="/wishlist"
            className="block border border-gray-200 p-4 hover:border-brand-gold transition-colors"
          >
            <p className="text-sm font-medium">{t('account.myWishlist')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('account.wishlistDesc')}</p>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
