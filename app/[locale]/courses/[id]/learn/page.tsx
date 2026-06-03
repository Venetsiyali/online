'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  GraduationCap, CheckCircle2, Circle, PlayCircle, Clock,
  ArrowLeft, Award, BookOpen, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import type { Lesson, Course } from '@/lib/types';
import { localizeLesson, localizeCourse } from '@/lib/types';
import type { Locale } from '@/lib/types';

interface Progress {
  completedIds: string[];
  totalLessons: number;
  completedCount: number;
  percent: number;
}

export default function CourseLearnPage() {
  const params = useParams();
  const courseId = params.id as string;
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress>({ completedIds: [], totalLessons: 0, completedCount: 0, percent: 0 });
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<{ certificate_number: string; issued_at: string } | null>(null);

  const fetchProgress = useCallback(async () => {
    const res = await fetch(`/api/progress/${courseId}`);
    if (res.ok) setProgress(await res.json());
  }, [courseId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }

    const load = async () => {
      const [courseRes, progressRes, certRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/progress/${courseId}`),
        fetch(`/api/certificate/${courseId}`),
      ]);

      if (courseRes.ok) {
        const data = await courseRes.json();
        setCourse(data.course as Course);
        setLessons(data.lessons as Lesson[]);
      }
      if (progressRes.ok) setProgress(await progressRes.json());
      if (certRes.ok) {
        const d = await certRes.json();
        if (d.certificate) setCertificate(d.certificate);
      }
      setLoading(false);
    };
    load();
  }, [user, authLoading, courseId, locale, router, fetchProgress]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const localCourse = localizeCourse(course, locale);

  const labelMap = {
    uz: { back: 'Kursga qaytish', lessons: 'Darslar', progress: 'Progress', start: 'Boshlash', continue: 'Davom etish', completed: 'Bajarildi', getCert: 'Sertifikat olish', certReady: 'Sertifikatingiz tayyor!', certNum: 'Sertifikat raqami', download: 'Sertifikatni ko\'rish', locked: 'Qulflangan — avvalgi darsni tugatng' },
    ru: { back: 'К курсу', lessons: 'Уроки', progress: 'Прогресс', start: 'Начать', continue: 'Продолжить', completed: 'Завершено', getCert: 'Получить сертификат', certReady: 'Ваш сертификат готов!', certNum: 'Номер сертификата', download: 'Открыть сертификат', locked: 'Заблокировано — сначала пройдите предыдущий урок' },
    en: { back: 'Back to Course', lessons: 'Lessons', progress: 'Progress', start: 'Start', continue: 'Continue', completed: 'Completed', getCert: 'Get Certificate', certReady: 'Your certificate is ready!', certNum: 'Certificate Number', download: 'View Certificate', locked: 'Locked — complete the previous lesson first' },
  };
  const L = labelMap[locale] || labelMap.en;

  // A lesson is unlocked if it's the first OR the previous lesson is completed
  const isUnlocked = (idx: number) =>
    idx === 0 || progress.completedIds.includes(lessons[idx - 1]?.id);

  const firstIncomplete = lessons.find((l, idx) => isUnlocked(idx) && !progress.completedIds.includes(l.id));
  const nextLesson = firstIncomplete || (lessons.length > 0 ? lessons[0] : null);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0F172A] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href={`/${locale}/courses/${courseId}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> {L.back}
          </a>
          <p className="text-white font-semibold text-sm truncate hidden sm:block">{localCourse.title}</p>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${progress.percent}%` }} />
            </div>
            <span className="text-amber-400 text-xs font-bold whitespace-nowrap">{progress.percent}%</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Course header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">{localCourse.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {lessons.length} {L.lessons}</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> {progress.completedCount}/{progress.totalLessons} {L.completed}</span>
              </div>
            </div>
            {nextLesson && (
              <Button variant="gold" onClick={() => router.push(`/${locale}/courses/${courseId}/learn/${nextLesson.id}`)}>
                {progress.completedCount === 0 ? L.start : L.continue}
              </Button>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>{L.progress}</span>
              <span>{progress.percent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        </div>

        {/* Certificate banner */}
        {progress.percent === 100 && (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 mb-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8" />
              <div>
                <h2 className="font-bold text-lg">{L.certReady}</h2>
                {certificate && <p className="text-amber-100 text-sm">{L.certNum}: {certificate.certificate_number}</p>}
              </div>
            </div>
            <Button variant="outline" className="bg-white text-amber-600 hover:bg-amber-50 border-white"
              onClick={() => router.push(`/${locale}/certificate/${courseId}`)}>
              {L.download}
            </Button>
          </div>
        )}

        {/* Lessons list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-amber-500" /> {L.lessons}
            </h2>
          </div>
          <div className="divide-y divide-slate-50">
            {lessons.map((lesson, idx) => {
              const loc = localizeLesson(lesson, locale);
              const isCompleted = progress.completedIds.includes(lesson.id);
              const unlocked = isUnlocked(idx);
              const isCurrent = nextLesson?.id === lesson.id && unlocked;

              return (
                <button
                  key={lesson.id}
                  disabled={!unlocked}
                  onClick={() => unlocked && router.push(`/${locale}/courses/${courseId}/learn/${lesson.id}`)}
                  title={!unlocked ? L.locked : undefined}
                  className={`w-full flex items-center gap-4 p-4 text-left transition-colors
                    ${unlocked ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-not-allowed opacity-60'}
                    ${isCurrent ? 'bg-amber-50' : ''}
                  `}
                >
                  {/* Status icon */}
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                    ${isCompleted ? 'bg-green-100' : isCurrent ? 'bg-amber-100' : unlocked ? 'bg-slate-100' : 'bg-slate-100'}`}>
                    {isCompleted
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : !unlocked
                      ? <Lock className="w-4 h-4 text-slate-400" />
                      : <Circle className="w-5 h-5 text-slate-400" />
                    }
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${isCompleted ? 'text-slate-400 line-through' : !unlocked ? 'text-slate-400' : 'text-slate-800'}`}>
                      {idx + 1}. {loc.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
                      {lesson.video_url && <span className="flex items-center gap-1"><PlayCircle className="w-3 h-3" /> Video</span>}
                      {lesson.duration_minutes > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration_minutes} min</span>}
                      {!unlocked && <span className="flex items-center gap-1 text-amber-500"><Lock className="w-3 h-3" />{L.locked}</span>}
                    </div>
                  </div>

                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                  {isCurrent && !isCompleted && <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
