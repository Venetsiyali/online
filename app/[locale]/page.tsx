export const dynamic = 'force-dynamic';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { Course, Announcement, PricingPlan, Locale } from '@/lib/types';
import { localizeCourse, localizeAnnouncement, localizePricingPlan } from '@/lib/types';
import HeroSection from '@/components/public-site/HeroSection';
import StatsBar from '@/components/public-site/StatsBar';
import CourseCard from '@/components/public-site/CourseCard';
import AnnouncementCard from '@/components/public-site/AnnouncementCard';
import PricingCard from '@/components/public-site/PricingCard';
import TestimonialsSection from '@/components/public-site/TestimonialsSection';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import { ArrowRight, BookOpen, Bell, Tag } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'featured_courses' });
  const tAnn = await getTranslations({ locale, namespace: 'announcements' });
  const tPricing = await getTranslations({ locale, namespace: 'pricing' });

  const sql = getDb();

  const [coursesRows, announcementsRows, pricingRows, studentsRow] = await Promise.all([
    sql`SELECT * FROM courses WHERE is_published=true ORDER BY created_at DESC LIMIT 50`,
    sql`SELECT * FROM announcements WHERE is_published=true ORDER BY created_at DESC LIMIT 3`,
    sql`SELECT * FROM pricing_plans WHERE is_active=true ORDER BY price`,
    sql`SELECT COUNT(*) FROM students`,
  ]);

  const courses = coursesRows as Course[];
  const announcements = announcementsRows as Announcement[];
  const pricingPlans = pricingRows as PricingPlan[];
  const studentsCount = Number(studentsRow[0]?.count || 0);

  const loc = locale as Locale;
  const localizedCourses = courses.map((c) => localizeCourse(c, loc));
  const localizedAnnouncements = announcements.map((a) => localizeAnnouncement(a, loc));
  const localizedPlans = pricingPlans.map((p) => localizePricingPlan(p, loc));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Toaster />

      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <div className="border-b border-gray-200">
        <StatsBar coursesCount={courses.length || 0} studentsCount={studentsCount} />
      </div>

      {/* Categories (Coursera-like) */}
      <section className="py-16 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center md:text-left">
            Ommabop yo'nalishlar bo'yicha o'rganing
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {['Dasturlash', 'Biznes', 'Ma\'lumotlar ilmi', 'Sun\'iy Intelekt', 'Dizayn', 'Tillar', 'Marketing', 'Kiberxavfsizlik', 'Boshqaruv', 'Moliya'].map((cat, i) => (
              <a key={i} href={`/${locale}/courses?category=${cat}`} className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-primary transition-all group text-center cursor-pointer">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-800 text-sm group-hover:text-primary transition-colors">{cat}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{t('title')}</h2>
              <p className="text-gray-600 text-lg">{t('subtitle')}</p>
            </div>
            <a
              href={`/${locale}/courses`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-base transition-colors group"
            >
              {t('view_all')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {localizedCourses.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">{t('no_courses')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {localizedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  watchLabel={t('watch_now')}
                  freeLabel={t('free_badge')}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Announcements */}
      <section className="py-20 lg:py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-3">{tAnn('title')}</h2>
              <p className="text-gray-600 text-lg">{tAnn('subtitle')}</p>
            </div>
            <a
              href={`/${locale}/announcements`}
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-bold text-base transition-colors group"
            >
              {tAnn('view_all')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {localizedAnnouncements.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">{tAnn('no_announcements')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {localizedAnnouncements.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  readMoreLabel={tAnn('read_more')}
                  locale={locale}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      {localizedPlans.length > 0 && (
        <section className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                {tPricing('title')}
              </h2>
              <p className="text-gray-600 text-lg">{tPricing('subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {localizedPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  perMonthLabel={tPricing('per_month')}
                  popularLabel={tPricing('most_popular')}
                  ctaLabel={tPricing('get_started')}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <div className="bg-gray-50 border-t border-gray-200">
        <TestimonialsSection />
      </div>

      <Footer />
    </div>
  );
}
