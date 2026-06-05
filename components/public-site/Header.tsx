'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, GraduationCap, LogIn } from 'lucide-react';
import { useLocale } from 'next-intl';

const navLinks = [
  { href: '#home', label: { uz: 'Bosh sahifa', ru: 'Главная', en: 'Home' } },
  { href: '#directions', label: { uz: 'Yo\'nalishlar', ru: 'Направления', en: 'Courses' } },
  { href: '#schedule', label: { uz: 'Jadval', ru: 'Расписание', en: 'Schedule' } },
  { href: '#gallery', label: { uz: 'Galereya', ru: 'Галерея', en: 'Gallery' } },
  { href: '#testimonials', label: { uz: 'Fikrlar', ru: 'Отзывы', en: 'Reviews' } },
  { href: '#contact', label: { uz: 'Aloqa', ru: 'Контакт', en: 'Contact' } },
];

export default function Header() {
  const locale = (useLocale() as 'uz' | 'ru' | 'en') || 'uz';
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Init dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Toggle dark mode
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const bgClass = scrolled
    ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm'
    : 'bg-transparent';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="container-custom h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href={`/${locale}`} className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-black text-foreground leading-none">Online</p>
            <p className="text-xs font-bold text-brand leading-none">Academy</p>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
            >
              {link.label[locale] || link.label.uz}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            id="dark-mode-toggle"
            onClick={toggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center border border-border hover:bg-muted transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            {dark
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-slate-500" />
            }
          </button>

          {/* Login */}
          <a
            href={`/${locale}/login`}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-muted text-foreground transition-all duration-200"
          >
            <LogIn className="w-4 h-4" />
            Kirish
          </a>

          {/* Register CTA */}
          <a
            href="#contact"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #E63946, #c1121f)' }}
          >
            Ro&apos;yxatdan o&apos;tish
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-border hover:bg-muted transition-all duration-200"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-lg border-b border-border">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all"
              >
                {link.label[locale] || link.label.uz}
              </a>
            ))}
            <div className="pt-3 border-t border-border flex gap-2">
              <a href={`/${locale}/login`} className="flex-1 py-2.5 text-center text-sm font-semibold border border-border rounded-xl text-foreground hover:bg-muted transition-all">
                Kirish
              </a>
              <a href="#contact" className="flex-1 py-2.5 text-center text-sm font-bold text-white rounded-xl" style={{ background: 'linear-gradient(135deg, #E63946, #c1121f)' }}>
                Ro&apos;yxatdan o&apos;tish
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
