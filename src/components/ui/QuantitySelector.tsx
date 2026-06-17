'use client';

import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
}: QuantitySelectorProps) {
  const px = size === 'sm' ? 'px-2 py-1' : 'px-3 py-2';
  const textClass = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center border border-gray-300 w-fit">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(px, 'hover:bg-gray-100 transition-colors disabled:opacity-30', textClass)}
      >
        −
      </button>
      <span className={cn(px, 'min-w-[32px] text-center font-medium', textClass)}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(px, 'hover:bg-gray-100 transition-colors disabled:opacity-30', textClass)}
      >
        +
      </button>
    </div>
  );
}
