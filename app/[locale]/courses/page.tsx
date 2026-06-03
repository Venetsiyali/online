export const dynamic = 'force-dynamic';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { Course, Locale } from '@/lib/types';
import { localizeCourse } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import CoursesClient from './CoursesClient';
import { Toaster } from '@/components/ui/sonner';

export default async function CoursesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'courses' });

  const sql = getDb();
  const rows = await sql`SELECT * FROM courses WHERE is_published=true ORDER BY created_at DESC`;

  const courses = rows as Course[];
  const loc = locale as Locale;
  const localizedCourses = courses.map((c) => localizeCourse(c, loc));

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));

  const translations = {
    title: t('title'),
    subtitle: t('subtitle'),
    search_placeholder: t('search_placeholder'),
    all_categories: t('all_categories'),
    no_courses: t('no_courses'),
    watch_now: t('watch_now'),
    free: t('free'),
    premium: t('premium'),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      <div className="bg-[#0F172A] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{t('title')}</h1>
          <p className="text-slate-400 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <CoursesClient
        courses={localizedCourses}
        categories={categories}
        translations={translations}
        locale={locale}
      />

      <Footer />
    </div>
  );
}
