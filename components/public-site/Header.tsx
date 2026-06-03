'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';

const LOCALES = [
  { code: 'uz', label: '🇺🇿 UZ' },
  { code: 'ru', label: '🇷🇺 RU' },
  { code: 'en', label: '🇬🇧 EN' },
];

export default function Header() {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-user-menu]')) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: `/${locale}/courses`, label: t('courses') },
    { href: `/${locale}/announcements`, label: t('announcements') },
    { href: `/${locale}/pricing`, label: t('pricing') },
  ];

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    localStorage.setItem('preferred-locale', newLocale);
    router.push(newPath);
  };

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    setIsOpen(false);
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="w-full h-[76px] pointer-events-auto bg-white border-b border-gray-200">
      <div className="hidden md:flex flex-col w-full">
        <div className="relative h-[76px] flex justify-between items-center">
          
          <div className="flex items-center gap-6 flex-1 min-w-0 pl-2 sm:pl-4">
            {/* Logo */}
            <a href={`/${locale}`} className="min-w-12 flex-shrink-0 flex items-center text-[24px] font-bold tracking-tight text-primary">
              onlineAcademy
            </a>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Explore Button */}
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded bg-primary text-white hover:bg-primary/90 lg:h-10 px-4 text-base h-10 ml-1 flex-shrink-0 font-semibold shadow-sm transition-colors">
                {t('learn')}
                <ChevronDown className="w-4 h-4 ml-2 font-bold" />
              </button>

              {/* Search Bar */}
              <div className="flex-1 min-w-0 max-w-full relative min-h-12 flex items-center hidden lg:flex ml-4">
                <div className="relative w-full max-w-lg flex">
                  <input
                    type="text"
                    className="block w-full pl-4 pr-3 py-2.5 border border-gray-400 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm font-light"
                    placeholder={t('search')}
                  />
                  <button className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-r-md flex items-center justify-center">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center flex-shrink-0 pr-2 sm:pr-4">
            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6 mr-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-secondary hover:text-primary transition-colors text-sm font-medium"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Language switcher */}
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1 mr-4">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-semibold transition-all',
                    locale === loc.code
                      ? 'bg-primary text-white'
                      : 'text-gray-500 hover:text-secondary'
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            {/* Auth buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-secondary px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[120px] truncate">{displayName}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                        <a
                          href={`/${locale}/dashboard`}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary" />
                          {tAuth('dashboard')}
                        </a>
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          {tAuth('logout')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-transparent font-semibold">
                      <a href={`/${locale}/login`}>{tAuth('login_btn')}</a>
                    </Button>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded shadow-sm">
                      <a href={`/${locale}/register`}>{tAuth('register_btn')}</a>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden relative h-[76px] justify-between items-center border-b border-gray-200 px-4">
        <button
          className="hover:bg-primary/10 p-2 rounded-full text-secondary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        
        <a href={`/${locale}`} className="flex items-center text-2xl font-bold tracking-tight text-primary">
          onlineAcademy
        </a>

        <button className="hover:bg-primary/10 p-2 rounded-full text-secondary" aria-label="Search courses">
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute w-full z-50">
          <nav className="flex flex-col gap-0">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-secondary hover:text-primary hover:bg-gray-50 transition-colors text-base font-medium px-4 py-4 border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!loading && user && (
              <>
                <a
                  href={`/${locale}/dashboard`}
                  className="flex items-center gap-2 text-secondary hover:text-primary hover:bg-gray-50 transition-colors text-base font-medium px-4 py-4 border-b border-gray-100"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  {tAuth('dashboard')}
                </a>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 transition-colors text-base font-medium px-4 py-4 border-b border-gray-100 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  {tAuth('logout')}
                </button>
              </>
            )}
            {!loading && !user && (
              <div className="flex flex-col gap-2 p-4">
                <a
                  href={`/${locale}/login`}
                  className="w-full text-center py-3 rounded-lg border border-secondary text-secondary hover:bg-gray-50 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {tAuth('login_btn')}
                </a>
                <a
                  href={`/${locale}/register`}
                  className="w-full text-center py-3 rounded-lg bg-primary hover:bg-primary/90 text-white text-base font-bold transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {tAuth('register_btn')}
                </a>
              </div>
            )}
            {/* Mobile language switcher */}
            <div className="flex items-center gap-2 p-4 bg-gray-50">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => {
                    switchLocale(loc.code);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-semibold transition-all flex-1',
                    locale === loc.code
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:text-secondary'
                  )}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
