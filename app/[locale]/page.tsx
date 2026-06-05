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

  // Only fetch CorelDRAW course
  const coursesRows = await sql`
    SELECT * FROM courses
    WHERE is_published=true
      AND (LOWER(title_uz) LIKE '%corel%' OR LOWER(title_en) LIKE '%corel%' OR LOWER(title_ru) LIKE '%corel%')
    ORDER BY created_at DESC
    LIMIT 1
  `;

  const courses = coursesRows as Course[];
  const loc = locale as Locale;
  const corelCourse = courses.length > 0 ? localizeCourse(courses[0], loc) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Toaster />

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. CorelDRAW Video Section — show only CorelDRAW */}
      {corelCourse && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="section-tag">🎨 CorelDRAW</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Kurs <span className="brand-gradient-text">darslari</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Kamolova Fazilat tayyorlagan professional video darslar
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <a
                href={`/${locale}/courses/${courses[0].id}`}
                className="group block bg-card rounded-2xl border border-border overflow-hidden card-hover"
              >
                {/* Video thumbnail */}
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src="https://img.youtube.com/vi/dwQbWkDCk40/hqdefault.jpg"
                    alt={corelCourse.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-brand/90 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    BEPUL
                  </div>
                </div>
                {/* Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">KF</div>
                    <span className="text-sm text-muted-foreground">Kamolova Fazilat</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{corelCourse.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{corelCourse.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">4 ta video dars • Sertifikat</span>
                    <span className="text-brand font-bold text-sm group-hover:underline">Kursni boshlash →</span>
                  </div>
                </div>
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
