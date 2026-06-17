'use client';

import { useLocale } from 'next-intl';
import { useCartStore } from '@/store/cart';

export function CartBadge() {
  const locale = useLocale();
  const rtl = locale === 'ar';
  const count = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  if (count === 0) return null;

  return (
    <span className={`absolute -top-1 ${rtl ? '-left-1' : '-right-1'} bg-brand-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center`}>
      {count > 9 ? '9+' : count}
    </span>
  );
}
