'use client';

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  avatar: string;
  color: string;
}

const AVATAR_COLORS = [
  'from-amber-400 to-orange-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-pink-400 to-rose-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-blue-500',
];

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="flex-shrink-0 w-80 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mx-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <Quote className="w-6 h-6 text-amber-200 flex-shrink-0" />
      </div>

      {/* Text */}
      <p className="text-slate-600 text-sm leading-relaxed mb-5 line-clamp-4">
        "{item.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
          {item.avatar}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm leading-tight">{item.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const t = useTranslations('testimonials');

  const items: TestimonialItem[] = [0, 1, 2, 3].map((i) => ({
    name: t(`items.${i}.name`),
    role: t(`items.${i}.role`),
    text: t(`items.${i}.text`),
    avatar: t(`items.${i}.avatar`),
    color: AVATAR_COLORS[i % AVATAR_COLORS.length],
  }));

  // Duplicate for seamless loop
  const row1 = [...items, ...items];
  const row2 = [...items.slice().reverse(), ...items.slice().reverse()];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14 text-center">
        <div className="inline-flex items-center gap-2 feature-badge mb-5">
          <Star className="w-4 h-4" />
          <span>Testimonials</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          {t('title')}
        </h2>
        <p className="text-slate-500 text-lg max-w-xl mx-auto">{t('subtitle')}</p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-5">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {row1.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right (reverse) */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee-slow" style={{ animationDirection: 'reverse' }}>
          {row2.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
