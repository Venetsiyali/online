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

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const sql = getDb();
  const loc = locale as Locale;

  // Fetch both featured courses
  const allCoursesRows = await sql`
    SELECT * FROM courses WHERE is_published=true ORDER BY created_at ASC
  `;
  const allCourses = allCoursesRows as Course[];

  // CorelDRAW — Kamolova Fazilat
  const corelCourse = allCourses.find(c =>
    c.title_uz?.toLowerCase().includes('corel') ||
    c.title_en?.toLowerCase().includes('corel')
  );

  // Matematika — Salomov Furqat
  const mathCourse = allCourses.find(c =>
    c.title_uz?.toLowerCase().includes('matematika') ||
    c.title_en?.toLowerCase().includes('math')
  );

  const corelLocalized = corelCourse ? localizeCourse(corelCourse, loc) : null;
  const mathLocalized = mathCourse ? localizeCourse(mathCourse, loc) : null;

  const courseCards = [
    corelCourse && {
      course: corelCourse,
      localized: corelLocalized!,
      videoId: 'dwQbWkDCk40',
      teacher: 'Kamolova Fazilat',
      initials: 'KF',
      color: '#E63946',
      tag: 'CorelDRAW',
      lessons: '4',
    },
    mathCourse && {
      course: mathCourse,
      localized: mathLocalized!,
      videoId: '1-6_9I3vSC4',
      teacher: 'Salomov Furqat',
      initials: 'SF',
      color: '#3b82f6',
      tag: '9-sinf Matematika',
      lessons: '10',
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Featured Courses */}
      {courseCards.length > 0 && (
        <section id="courses" className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="section-tag">🎓 Kurslar</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Bizning <span className="brand-gradient-text">o&apos;quv kurslarimiz</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                Professional o&apos;qituvchilar tomonidan tayyorlangan video darslar
              </p>
            </div>

            <div className={`grid gap-8 ${courseCards.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'}`}>
              {courseCards.map((item) => {
                if (!item) return null;
                const { course, localized, videoId, teacher, initials, color, tag, lessons } = item;
                return (
                  <a
                    key={course.id}
                    href={`/${locale}/courses/${course.id}`}
                    className="group block bg-card rounded-2xl border border-border overflow-hidden card-hover"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-900">
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={localized.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ background: color, boxShadow: `0 8px 24px ${color}66` }}
                        >
                          <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div
                        className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: color }}
                      >
                        {tag}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold"
                          style={{ background: color }}
                        >
                          {initials}
                        </div>
                        <span className="text-sm text-muted-foreground">{teacher}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{localized.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {localized.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {lessons} ta video dars • Sertifikat
                        </span>
                        <span className="font-bold text-sm group-hover:underline" style={{ color }}>
                          Kursni boshlash →
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
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
