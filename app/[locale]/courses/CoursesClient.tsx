'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CourseCard from '@/components/public-site/CourseCard';
import type { LocalizedCourse } from '@/lib/types';

interface CoursesClientProps {
  courses: LocalizedCourse[];
  categories: string[];
  translations: Record<string, string>;
  locale: string;
}

export default function CoursesClient({
  courses,
  categories,
  translations: t,
  locale,
}: CoursesClientProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeCategory === 'all' || c.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [courses, search, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="search"
            placeholder={t.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
        {/* Category tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === 'all'
                ? 'bg-[#0F172A] text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            {t.all_categories}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-slate-500 text-sm mb-6">
        {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-500">{t.no_courses}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              watchLabel={t.watch_now}
              freeLabel={t.free}
              premiumLabel={t.premium}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
