'use client';

import { Link, usePathname } from '@/i18n/navigation';

interface LanguageSwitcherProps {
  dark?: boolean;
}

export function LanguageSwitcher({ dark }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className={`flex items-center gap-1 text-xs tracking-[0.15em] ${dark ? 'text-white/60' : 'text-gray-400'}`}>
      <Link
        href={pathname}
        locale="fr"
        className={`px-2 py-1 font-medium transition-colors uppercase ${
          dark ? 'hover:text-white' : 'hover:text-brand-gold'
        }`}
      >
        FR
      </Link>
      <span className="text-current opacity-30">/</span>
      <Link
        href={pathname}
        locale="ar"
        className={`px-2 py-1 font-medium transition-colors uppercase ${
          dark ? 'hover:text-white' : 'hover:text-brand-gold'
        }`}
      >
        AR
      </Link>
    </div>
  );
}
