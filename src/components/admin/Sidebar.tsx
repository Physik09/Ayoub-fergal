'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname } from '@/i18n/navigation';
import { Logo } from '@/components/layout/Logo';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/admin', icon: '⊞' },
  { key: 'products', href: '/admin/products', icon: '⊟' },
  { key: 'categories', href: '/admin/categories', icon: '⊡' },
  { key: 'suppliers', href: '/admin/suppliers', icon: '⊠' },
  { key: 'orders', href: '/admin/orders', icon: '⊡' },
  { key: 'promocodes', href: '/admin/promocodes', icon: '⊟' },
  { key: 'content', href: '/admin/content', icon: '⊞' },
];

export default function AdminSidebar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const rtl = locale === 'ar';

  return (
    <aside className={`fixed top-0 ${rtl ? 'right-0' : 'left-0'} h-screen w-64 bg-brand-black text-white flex flex-col z-50`}>
      <div className="p-6 border-b border-white/10">
        <Logo variant="horizontal" className="opacity-90" />
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ key, href, icon }) => {
          const isActive = key === 'dashboard'
            ? pathname === '/admin'
            : pathname.startsWith(href);

          return (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                isActive
                  ? 'bg-brand-gold/20 text-brand-gold font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{icon}</span>
              {t(`admin.${key}`)}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {t('admin.backToStore')}
        </Link>
      </div>
    </aside>
  );
}
