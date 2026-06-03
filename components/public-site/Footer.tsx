'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Mail, Youtube, Instagram, Send, Home, BookOpen, Bell, Tag } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`, label: nav('home'), icon: Home },
    { href: `/${locale}/courses`, label: nav('courses'), icon: BookOpen },
    { href: `/${locale}/announcements`, label: nav('announcements'), icon: Bell },
    { href: `/${locale}/pricing`, label: nav('pricing'), icon: Tag },
  ];

  const socials = [
    { href: '#', icon: Youtube, label: 'YouTube' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Send, label: 'Telegram' },
    { href: 'mailto:info@onlineacademy.uz', icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-[#f2f5fa] text-[#1e2229] pb-12 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <a href={`/${locale}`} className="inline-block flex-shrink-0 text-[24px] font-bold tracking-tight text-primary mb-6">
              onlineAcademy
            </a>
            <p className="text-sm leading-relaxed text-gray-700 max-w-xs mb-8">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('quick_links')}</h3>
            <ul className="space-y-4">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-gray-700 hover:text-primary transition-colors underline-offset-2 hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('contact')}</h3>
            <ul className="space-y-4 text-sm text-gray-700">
              <li>
                <a href="mailto:info@onlineacademy.uz" className="hover:text-primary transition-colors underline-offset-2 hover:underline">
                  info@onlineacademy.uz
                </a>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">
                  @onlineacademy_uz
                </span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('follow_us')}</h3>
            <div className="flex gap-4">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Icon className="w-5 h-5 text-gray-700" />
                </a>
              ))}
            </div>
            
            {/* Language Selector */}
            <div className="mt-8">
              <label htmlFor="language-select" className="sr-only">Language</label>
              <select 
                id="language-select"
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5 outline-none shadow-sm"
                defaultValue={locale}
                onChange={(e) => {
                  window.location.href = `/${e.target.value}`;
                }}
              >
                <option value="uz">O'zbekcha</option>
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} OnlineAcademy. {t('rights')}</p>
          <div className="flex items-center gap-6">
            <a href={`/${locale}`} className="hover:text-primary hover:underline transition-colors">
              {locale === 'uz' ? "Maxfiylik siyosati" : locale === 'ru' ? "Конфиденциальность" : "Privacy Policy"}
            </a>
            <a href={`/${locale}`} className="hover:text-primary hover:underline transition-colors">
              {locale === 'uz' ? "Xizmat ko'rsatish shartlari" : locale === 'ru' ? "Условия обслуживания" : "Terms of Service"}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
