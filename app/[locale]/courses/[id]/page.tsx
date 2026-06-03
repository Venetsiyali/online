export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getDb } from '@/lib/db';
import type { Course, Lesson, Locale } from '@/lib/types';
import { localizeCourse } from '@/lib/types';
import Header from '@/components/public-site/Header';
import Footer from '@/components/public-site/Footer';
import VideoPlayer from '@/components/public-site/VideoPlayer';
import CourseCard from '@/components/public-site/CourseCard';
import EnrollmentForm from '@/components/public-site/EnrollmentForm';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { ArrowLeft, Tag, Calendar, PlayCircle, Clock, BookOpen, Award } from 'lucide-react';

export default async function CourseDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({ locale, namespace: 'course_detail' });
  const sql = getDb();

  const courseRows = await sql`SELECT * FROM courses WHERE id=${id} AND is_published=true LIMIT 1`;
  if (courseRows.length === 0) notFound();

  const course = courseRows[0] as Course;
  const loc = locale as Locale;
  const localCourse = localizeCourse(course, loc);

  const [lessonRows, relatedRows] = await Promise.all([
    sql`SELECT id, title_uz, title_ru, title_en, duration_minutes, order_index, video_url
        FROM lessons WHERE course_id=${id} AND is_published=true ORDER BY order_index ASC`,
    sql`SELECT * FROM courses WHERE is_published=true AND category=${course.category} AND id!=${id} LIMIT 3`,
  ]);

  const lessons = lessonRows as Partial<Lesson>[];
  const relatedCourses = (relatedRows as Course[]).map((c) => localizeCourse(c, loc));

  const totalMinutes = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const durationLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  const learnLabel = locale === 'uz' ? 'O\'rganishni boshlash' : locale === 'ru' ? 'Начать обучение' : 'Start Learning';
  const lessonLabel = locale === 'uz' ? 'dars' : locale === 'ru' ? 'урок' : 'lessons';
  const durationLbl = locale === 'uz' ? 'umumiy vaqt' : locale === 'ru' ? 'общее время' : 'total duration';
  const includesLbl = locale === 'uz' ? 'Kurs tarkibi' : locale === 'ru' ? 'Содержание курса' : 'Course Content';
  const certLbl = locale === 'uz' ? 'Sertifikat' : locale === 'ru' ? 'Сертификат' : 'Certificate';
  const certDesc = locale === 'uz' ? 'Kursni tugatgach sertifikat oling' : locale === 'ru' ? 'Получите сертификат по окончании' : 'Get a certificate upon completion';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Toaster />

      {/* Hero */}
      <div className="bg-[#0F172A] pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </a>
          <div className="flex items-center gap-3 flex-wrap">
            {localCourse.category && (
              <div className="flex items-center gap-1.5 text-amber-400 text-sm">
                <Tag className="w-4 h-4" />
                {localCourse.category}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(course.created_at, locale)}
            </div>
            {course.is_free ? (
              <Badge variant="gold">FREE</Badge>
            ) : (
              <Badge variant="navy">PREMIUM</Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 leading-tight">
            {localCourse.title}
          </h1>

          {lessons.length > 0 && (
            <div className="flex items-center gap-5 mt-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-400" />
                {lessons.length} {lessonLabel}
              </span>
              {totalMinutes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {durationLabel} {durationLbl}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                {certLbl}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <VideoPlayer
              youtubeUrl={localCourse.youtube_url}
              title={localCourse.title}
              thumbnailUrl={localCourse.thumbnail_url}
            />

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                {locale === 'uz' ? 'Kurs haqida' : locale === 'ru' ? 'О курсе' : 'About This Course'}
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {localCourse.description}
              </p>
            </div>

            {lessons.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-amber-500" />
                  {includesLbl}
                  <span className="text-sm font-normal text-slate-400">({lessons.length} {lessonLabel})</span>
                </h2>
                <div className="space-y-2">
                  {lessons.map((lesson, idx) => {
                    const title = (lesson as any)[`title_${locale}`] || (lesson as any).title_en || '';
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                        <span className="w-7 h-7 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="flex-1 text-sm text-slate-700 font-medium truncate">{title}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
                          {lesson.video_url && <PlayCircle className="w-3.5 h-3.5 text-blue-400" />}
                          {(lesson.duration_minutes || 0) > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration_minutes}m
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{certLbl}</p>
                <p className="text-sm text-slate-600">{certDesc}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {lessons.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <a
                  href={`/${locale}/courses/${id}/learn`}
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg"
                >
                  {learnLabel}
                </a>
                <p className="text-center text-xs text-slate-400 mt-2">
                  {lessons.length} {lessonLabel}
                  {totalMinutes > 0 && ` · ${durationLabel}`}
                </p>
              </div>
            )}

            <EnrollmentForm courseId={id} />

            {relatedCourses.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 mb-4">{t('related_courses')}</h3>
                <div className="space-y-4">
                  {relatedCourses.map((c) => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      watchLabel={t('free_badge')}
                      freeLabel={t('free_badge')}
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
