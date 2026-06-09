export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db';
import type { Course, Locale } from '@/lib/types';
import { localizeCourse } from '@/lib/types';
import HeroSection from '@/components/public-site/HeroSection';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import DirectionsSection from '@/components/public-site/DirectionsSection';
import ScheduleSection from '@/components/public-site/ScheduleSection';
import LeadershipSection from '@/components/public-site/LeadershipSection';
import GallerySection from '@/components/public-site/GallerySection';
import TestimonialsSection from '@/components/public-site/TestimonialsSection';
import LocationSection from '@/components/public-site/LocationSection';
import { Toaster } from '@/components/ui/sonner';
import { extractYouTubeId } from '@/lib/youtube';

// Color palette for course cards (cycles if more than defined)
const COURSE_COLORS = [
  { color: '#E63946', bg: 'rgba(230,57,70,0.1)', light: '#fef2f2' },
  { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', light: '#eff6ff' },
  { color: '#10b981', bg: 'rgba(16,185,129,0.1)', light: '#f0fdf4' },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', light: '#fffbeb' },
  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', light: '#f5f3ff' },
  { color: '#ec4899', bg: 'rgba(236,72,153,0.1)', light: '#fdf2f8' },
];

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const sql = getDb();
  const loc = locale as Locale;

  // Fetch ALL published courses — sorted by creation date
  const allCoursesRows = await sql`
    SELECT * FROM courses WHERE is_published = true ORDER BY created_at ASC
  `;
  const allCourses = allCoursesRows as Course[];

  // Count lessons per course
  const lessonCounts = allCourses.length > 0
    ? await sql`
        SELECT course_id, COUNT(*) as count
        FROM lessons
        WHERE is_published = true
        GROUP BY course_id
      `
    : [];

  const lessonCountMap: Record<string, number> = {};
  for (const row of lessonCounts) {
    lessonCountMap[row.course_id as string] = Number(row.count);
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. All Courses — dynamic from DB */}
      {allCourses.length > 0 && (
        <section id="courses" className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="section-tag">🎓 Kurslar</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Bizning <span className="brand-gradient-text">o&apos;quv kurslarimiz</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Professional o&apos;qituvchilar tomonidan tayyorlangan video darslar — sertifikat bilan
              </p>
            </div>

            <div className={`grid gap-6 ${
              allCourses.length === 1
                ? 'grid-cols-1 max-w-xl mx-auto'
                : allCourses.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {allCourses.map((course, idx) => {
                const localized = localizeCourse(course, loc);
                const palette = COURSE_COLORS[idx % COURSE_COLORS.length];
                const lessonCount = lessonCountMap[course.id] || 0;

                // Thumbnail: prefer youtube_url, then thumbnail_url
                const ytId = course.youtube_url ? extractYouTubeId(course.youtube_url) : null;
                const thumbSrc = course.thumbnail_url
                  ? course.thumbnail_url
                  : ytId
                  ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                  : null;

                // Short description (first 120 chars)
                const shortDesc = localized.description
                  ? localized.description.slice(0, 120) + (localized.description.length > 120 ? '...' : '')
                  : '';

                return (
                  <a
                    key={course.id}
                    href={`/${locale}/courses/${course.id}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden" style={{ background: palette.bg }}>
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt={localized.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 24 24" style={{ color: palette.color }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}

                      {/* Dark overlay + play button */}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          style={{ background: palette.color }}
                        >
                          <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>

                      {/* Category badge */}
                      {course.category && (
                        <div
                          className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: palette.color }}
                        >
                          {course.category}
                        </div>
                      )}

                      {/* Free badge */}
                      {course.is_free && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          Bepul
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors line-clamp-2">
                        {localized.title}
                      </h3>

                      {shortDesc && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                          {shortDesc}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {lessonCount > 0 && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {lessonCount} ta dars
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            Sertifikat
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold group-hover:underline"
                          style={{ color: palette.color }}
                        >
                          Boshlash →
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* View all link */}
            <div className="text-center mt-10">
              <a
                href={`/${locale}/courses`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-all"
              >
                Barcha kurslarni ko&apos;rish
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 3. Directions */}
      <DirectionsSection />

      {/* 4. Schedule & Exam */}
      <ScheduleSection />

      {/* 5. Leadership */}
      <LeadershipSection />

      {/* 6. Gallery */}
      <GallerySection />

      {/* 7. Testimonials */}
      <TestimonialsSection />

      {/* 8. Location + QR */}
      <LocationSection />

      <Footer />
    </div>
  );
}
