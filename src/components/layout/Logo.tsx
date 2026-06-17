'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'horizontal';
  className?: string;
}

function Monogram({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="flex-shrink-0">
      {/* Outer ring */}
      <rect x="0.5" y="0.5" width="47" height="47" rx="8" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* Inner decorative diamond */}
      <path d="M24 6 L32 16 L24 42 L16 16 Z" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
      {/* A - left stroke */}
      <path d="M16 33 L24 12 L26 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* A - right stroke + crossbar */}
      <path d="M26 12 L32 33" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="18.5" y1="28" x2="28.5" y2="28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* F */}
      <path d="M22 33 L22 21 L32 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="22" y1="26.5" x2="29" y2="26.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ variant = 'full', className }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  if (variant === 'horizontal') {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        {!imgError ? (
          <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
            <Image
              src="/images/logo.jpeg"
              alt="Ayoub Fergal"
              fill
              className="object-contain rounded-lg"
              priority
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="text-brand-gold">
            <Monogram size={40} />
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-brand-black leading-tight">
            AYOUB
          </span>
          <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-brand-black leading-tight -mt-0.5">
            FERGAL
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {!imgError ? (
        <div className="relative w-[120px] h-[120px] md:w-[140px] md:h-[140px]">
          <Image
            src="/images/logo.jpeg"
            alt="Ayoub Fergal"
            fill
            className="object-contain"
            priority
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-brand-gold mb-3">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              {/* Outer shield */}
              <path d="M60 2 L118 22 L118 58 C118 88 94 110 60 118 C26 110 2 88 2 58 L2 22 Z"
                stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.15" />
              {/* Decorative arch */}
              <path d="M30 45 Q60 20 90 45"
                stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.3" />
              {/* A letterform */}
              <path d="M38 82 L60 28 L62 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M62 28 L82 82" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="44" y1="68" x2="72" y2="68" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              {/* F nested */}
              <path d="M54 82 L54 46 L76 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="54" y1="61" x2="70" y2="61" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              {/* Small decorative dots */}
              <circle cx="60" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="106" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="14" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-brand-gold/40" />
              <span className="text-xs font-bold tracking-[0.3em] text-brand-gold">AYOUB</span>
              <div className="w-8 h-px bg-brand-gold/40" />
            </div>
            <span className="text-xs font-bold tracking-[0.3em] text-brand-gold">FERGAL</span>
            <span className="text-[8px] tracking-[0.4em] text-brand-gold/60 mt-1">MENSWEAR</span>
          </div>
        </div>
      )}
    </div>
  );
}
