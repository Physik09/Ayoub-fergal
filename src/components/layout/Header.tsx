'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useCartStore } from '@/store/cart';

const NAV_LINKS = [
  { key: 'home', href: '/' as const },
  { key: 'shop', href: '/shop' as const },
  { key: 'about', href: '/about' as const },
  { key: 'contact', href: '/contact' as const },
] as const;

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
    >
      {/* Top announcement bar */}
      {!isScrolled && (
        <div className="hidden md:block border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-1.5">
            <p className="text-[10px] text-white/50 text-center tracking-[0.2em] uppercase">
              LIVRAISON GRATUITE DÈS 500 MAD — FREE SHIPPING OVER 500 MAD
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-16 md:h-20' : 'h-16 md:h-20'
        }`}>
          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 -ml-2 transition-colors ${
              isScrolled ? 'text-brand-black' : 'text-white'
            }`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {isMobileOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={`relative text-xs uppercase tracking-[0.15em] transition-colors duration-300 py-1 group ${
                  pathname === href
                    ? 'text-brand-gold font-semibold'
                    : isScrolled
                      ? 'text-gray-700 hover:text-brand-gold'
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {t(`nav.${key}`)}
                <span className={`absolute -bottom-px left-0 h-px bg-brand-gold transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Center logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Logo variant="horizontal" className={`scale-90 md:scale-100 transition-colors ${
              isScrolled ? '' : '[&>div>div>span]:text-white'
            }`} />
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-brand-gold'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-label={t('nav.search')}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <Link
              href="/account"
              className={`p-2 transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-brand-gold'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-label={t('nav.account')}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <Link
              href="/cart"
              className={`p-2 transition-colors relative ${
                isScrolled
                  ? 'text-gray-700 hover:text-brand-gold'
                  : 'text-white/80 hover:text-white'
              }`}
              aria-label={t('nav.cart')}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-white text-[10px] font-bold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <div className="hidden md:block ml-1">
              <LanguageSwitcher dark={!isScrolled} />
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('nav.search') + '...'}
                className="flex-1 border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors bg-gray-50/50 focus:bg-white"
              />
              <button
                type="submit"
                className="bg-brand-black text-white px-6 text-sm font-semibold uppercase tracking-[0.15em] hover:bg-gray-800 transition-all duration-300"
              >
                {t('nav.search')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur-lg">
          <nav className="px-4 py-5 space-y-4">
            {NAV_LINKS.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className={`block text-sm uppercase tracking-[0.15em] transition-colors hover:text-brand-gold ${
                  pathname === href ? 'text-brand-gold font-semibold' : 'text-gray-700'
                }`}
              >
                {t(`nav.${key}`)}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
