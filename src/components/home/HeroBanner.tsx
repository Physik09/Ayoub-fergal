'use client';

import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function HeroBanner() {
  const t = useTranslations();
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-fade-in');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[90vh] bg-brand-black overflow-hidden">
      {/* Base dark layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/90 to-brand-black z-10" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-gold/5 rounded-full blur-[120px] z-10" />

      {/* Background image placeholder */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 z-[1]"
        style={{
          backgroundColor: '#0A0A0A',
          backgroundImage: 'url(/images/hero-placeholder.svg)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Decorative line above */}
        <div className="w-12 h-px bg-brand-gold/60 mb-8 animate-fade-in" />

        <h1
          ref={titleRef}
          className="text-4xl md:text-7xl lg:text-8xl font-bold text-white tracking-[0.08em] mb-2 uppercase opacity-0"
        >
          {t('hero.title')}
        </h1>

        {/* Decorative line below title */}
        <div className="w-16 h-px bg-brand-gold/40 mt-6 mb-8 animate-fade-in delay-200 opacity-0" />

        <Link
          href="/shop"
          className="group relative inline-flex items-center gap-2 bg-brand-gold text-brand-black px-10 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-brand-gold-light transition-all duration-500 animate-fade-in delay-300 opacity-0"
        >
          <span>{t('hero.cta')}</span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-black to-transparent z-30" />
      </div>
    </section>
  );
}
