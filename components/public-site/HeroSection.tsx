'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Text ── */}
          <div className="z-10">
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Karyerangizni yangi bosqichga olib chiqing
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-10 leading-relaxed font-normal">
              Eng yaxshi universitetlar va kompaniyalar tomonidan taqdim etilgan kurslar yordamida dunyo darajasidagi ta'lim oling.
            </p>

            {/* CTA / Search area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nimani o'rganishni xohlaysiz?"
                  className="block w-full pl-11 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary sm:text-base shadow-sm"
                />
              </div>
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-lg shadow-sm">
                <a href={`/${locale}/courses`}>Qidirish</a>
              </Button>
            </div>

            {/* Collaboration tags */}
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8">
              Hamkorlarimiz:
            </div>
            <div className="flex flex-wrap items-center gap-6 opacity-70 grayscale">
              <span className="text-xl font-bold font-serif">Stanford</span>
              <span className="text-xl font-bold font-sans">Google</span>
              <span className="text-xl font-bold font-mono">IBM</span>
              <span className="text-xl font-bold font-serif">Duke</span>
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <div className="hidden lg:flex items-center justify-end relative">
            {/* Main image */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/images/edx_hero.png" 
                alt="Student learning" 
                fill 
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
