'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, GraduationCap, LogIn, BookOpen, ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

const navLinks = [
  { href: '#home',         label: { uz: 'Bosh sahifa', ru: 'Главная',     en: 'Home'      } },
  { href: '#courses',      label: { uz: 'Kurslar',     ru: 'Курсы',       en: 'Courses'   } },
  { href: '#directions',   label: { uz: "Yo'nalishlar",ru: 'Направления', en: 'Directions'} },
  { href: '#schedule',     label: { uz: 'Jadval',      ru: 'Расписание',  en: 'Schedule'  } },
  { href: '#gallery',      label: { uz: 'Galereya',    ru: 'Галерея',     en: 'Gallery'   } },
  { href: '#testimonials', label: { uz: 'Fikrlar',     ru: 'Отзывы',      en: 'Reviews'   } },
  { href: '#contact',      label: { uz: 'Aloqa',       ru: 'Контакт',     en: 'Contact'   } },
];

export default function Header() {
  const locale = (useLocale() as 'uz' | 'ru' | 'en') || 'uz';
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [courses, setCourses] = useState<{ id: string; title_uz: string; title_ru: string; title_en: string }[]>([]);

  // Init dark mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Fetch courses for dropdown
  useEffect(() => {
    fetch('/api/public/courses')
      .then(r => r.ok ? r.json() : [])
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setCoursesDropdown(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const bgClass = scrolled
    ? 'bg-background/95 backdrop-blur-lg border-b border-border shadow-sm'
    : 'bg-transparent';

  const getCourseTitle = (c: typeof courses[0]) => {
    if (locale === 'ru' && c.title_ru) return c.title_ru;
    if (locale === 'en' && c.title_en) return c.title_en;
    return c.title_uz;
  };

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
          {navLinks.map((link) => {
            // "Kurslar" — special with dropdown
            if (link.href === '#courses') {
              return (
                <div key={link.href} className="relative">
                  <button
                    onClick={e => { e.stopPropagation(); setCoursesDropdown(p => !p); }}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {link.label[locale] || link.label.uz}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${coursesDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {coursesDropdown && (
                    <div
                      className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-2xl shadow-xl py-2 z-50"
                      onClick={e => e.stopPropagation()}
                    >
                      {/* All courses link */}
                      <a
                        href={`/${locale}/courses`}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                        onClick={() => setCoursesDropdown(false)}
                      >
                        <BookOpen className="w-4 h-4 text-brand" />
                        Barcha kurslar
                      </a>

                      {courses.length > 0 && (
                        <>
                          <div className="h-px bg-border mx-4 my-1" />
                          {courses.map((c, i) => {
                            const colors = ['#E63946', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
                            const color = colors[i % colors.length];
                            return (
                              <a
                                key={c.id}
                                href={`/${locale}/courses/${c.id}`}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                onClick={() => setCoursesDropdown(false)}
                              >
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: color }}
                                />
                                <span className="truncate">{getCourseTitle(c)}</span>
                              </a>
                            );
                          })}
                        </>
                      )}

                      {/* Anchor to courses section */}
                      <div className="h-px bg-border mx-4 my-1" />
                      <a
                        href="#courses"
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={() => setCoursesDropdown(false)}
                      >
                        Sahifada ko&apos;rish ↓
                      </a>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-all duration-200"
              >
                {link.label[locale] || link.label.uz}
              </a>
            );
          })}
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

            {/* Mobile: Courses list */}
            {courses.length > 0 && (
              <div className="pt-2 border-t border-border">
                <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Kurslar
                </p>
                {courses.map(c => (
                  <a
                    key={c.id}
                    href={`/${locale}/courses/${c.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-all"
                  >
                    {getCourseTitle(c)}
                  </a>
                ))}
                <a
                  href={`/${locale}/courses`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-brand hover:bg-muted rounded-lg transition-all"
                >
                  Barcha kurslar →
                </a>
              </div>
            )}

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
