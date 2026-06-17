'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-brand-black text-white">
      {/* Top decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="md:col-span-1 flex flex-col items-start gap-4">
            <Logo variant="full" />
            <p className="text-xs text-gray-500 leading-relaxed mt-2 max-w-[220px]">
              {t('site.description')}
            </p>
            <div className="flex gap-3 mt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-gold transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-gold transition-all duration-300 hover:scale-110"
                aria-label="TikTok"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-brand-gold transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-brand-gold">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'home', href: '/' as const },
                { key: 'shop', href: '/shop' as const },
                { key: 'about', href: '/about' as const },
                { key: 'contact', href: '/contact' as const },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="relative text-sm text-gray-400 hover:text-brand-gold transition-colors duration-300 group"
                  >
                    {t(`nav.${key}`)}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-brand-gold">
              INFORMATIONS
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'livraison', href: '/livraison-retours' as const },
                { key: 'cgv', href: '/cgv' as const },
                { key: 'faq', href: '/faq' as const },
                { key: 'tracking', href: '/order-tracking' as const },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="relative text-sm text-gray-400 hover:text-brand-gold transition-colors duration-300 group"
                  >
                    {t(`footer.${key}`)}
                    <span className="absolute -bottom-px left-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Payments */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-5 text-brand-gold">
              {t('footer.newsletter')}
            </h3>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex border border-gray-800 focus-within:border-brand-gold/50 transition-colors duration-300"
            >
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                className="flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white placeholder-gray-600 outline-none"
              />
              <button
                type="submit"
                className="bg-brand-gold text-brand-black px-4 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-brand-gold-light transition-all duration-300"
              >
                {t('newsletter.button')}
              </button>
            </form>
            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold mb-3 text-brand-gold">
                PAIEMENT
              </h3>
              <div className="flex flex-wrap gap-2">
                <div className="border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-500 hover:border-gray-600 transition-colors">
                  COD
                </div>
                <div className="border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-500 hover:border-gray-600 transition-colors">
                  CMI
                </div>
                <div className="border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-500 hover:border-gray-600 transition-colors">
                  Visa
                </div>
                <div className="border border-gray-800 rounded px-2.5 py-1 text-xs text-gray-500 hover:border-gray-600 transition-colors">
                  MC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-gray-600">
            {t('footer.copyright')}
          </p>
          <p className="text-[11px] text-gray-600">
            <a href="https://ayoubfergal.com" className="hover:text-brand-gold transition-colors">ayoubfergal.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
