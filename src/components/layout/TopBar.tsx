'use client';

import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

export function TopBar() {
  const t = useTranslations();

  return (
    <div className="bg-brand-black text-white text-xs tracking-[0.15em] uppercase py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <span className="hidden md:block">&nbsp;</span>
        <p className="text-center font-medium">{t('topbar.text')}</p>
        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
