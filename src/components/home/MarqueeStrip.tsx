'use client';

import { useTranslations } from 'next-intl';

export function MarqueeStrip() {
  const t = useTranslations();

  return (
    <div className="w-full bg-brand-black py-4 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        <span className="text-brand-gold text-sm md:text-base tracking-[0.15em] font-medium mx-4 uppercase">
          {t('marquee.text1')}
        </span>
        <span className="text-brand-gold text-sm md:text-base tracking-[0.15em] font-medium mx-4 uppercase">
          {t('marquee.text1')}
        </span>
        <span className="text-brand-gold text-sm md:text-base tracking-[0.15em] font-medium mx-4 uppercase">
          {t('marquee.text1')}
        </span>
        <span className="text-brand-gold text-sm md:text-base tracking-[0.15em] font-medium mx-4 uppercase">
          {t('marquee.text1')}
        </span>
      </div>
    </div>
  );
}
