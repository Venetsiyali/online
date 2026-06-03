'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
  BookOpen, HelpCircle, Award, AlertCircle, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';
import { extractYouTubeId } from '@/lib/youtube';
import type { Lesson, QuizQuestion, Course } from '@/lib/types';
import { localizeLesson, localizeQuizQuestion, localizeCourse } from '@/lib/types';
import type { Locale } from '@/lib/types';

export default function LessonViewerPage() {
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [marking, setMarking] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // locale-based labels are used inline below via ternary; no L object needed

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch(`/api/progress/${courseId}`);
      if (res.ok) {
        const d = await res.json();
        setCompletedIds(d.completedIds || []);
        return d.completedIds as string[];
      }
    } catch (e) {
      console.error('[fetchProgress]', e);
    }
    return [];
  }, [courseId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push(`/${locale}/login`); return; }

    const load = async () => {
      const [courseRes, lessonRes, progressRes] = await Promise.all([
        fetch(`/api/courses/${courseId}`),
        fetch(`/api/lessons/${lessonId}`),
        fetch(`/api/progress/${courseId}`),
      ]);

      if (courseRes.ok) {
        const d = await courseRes.json();
        setCourse(d.course as Course);
        setLessons(d.lessons as Lesson[]);
      }
      if (lessonRes.ok) {
        const d = await lessonRes.json();
        setLesson(d.lesson as Lesson);
        setQuestions(d.questions as QuizQuestion[]);
      }
      if (progressRes.ok) {
        const d = await progressRes.json();
        setCompletedIds(d.completedIds || []);
      }
      setLoading(false);
    };
    load();
  }, [user, authLoading, courseId, lessonId, locale, router]);

  useEffect(() => {
    if (completedIds.includes(lessonId)) {
      setAlreadyDone(true);
      setSubmitted(true);
    }
  }, [completedIds, lessonId]);

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = lessons[currentIndex + 1] || null;
  const isLastLesson = currentIndex === lessons.length - 1;

  // Sequential lock: previous lesson must be completed
  const isLessonLocked = currentIndex > 0 && !completedIds.includes(lessons[currentIndex - 1]?.id);

  const markComplete = async (quizScore?: number): Promise<boolean> => {
    setMarking(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lessonId,
          course_id: courseId,
          quiz_score: quizScore ?? null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('[markComplete] server error:', data);
        setSaveError(data.error || 'Server error');
        setMarking(false);
        return false;
      }

      // POST succeeded — update local state immediately and sync from server
      setCompletedIds((prev) => prev.includes(lessonId) ? prev : [...prev, lessonId]);
      setAlreadyDone(true);
      setMarking(false);

      // Background sync (don't await — don't block UI)
      fetchProgress();
      return true;
    } catch (e) {
      console.error('[markComplete] network error:', e);
      setSaveError(
        locale === 'uz' ? 'Tarmoq xatosi. Internet aloqasini tekshiring.'
        : locale === 'ru' ? 'Ошибка сети. Проверьте подключение.'
        : 'Network error. Check your connection.'
      );
      setMarking(false);
      return false;
    }
  };

  const handleSubmitQuiz = async () => {
    if (!lesson) return;
    const localQs = questions.map((q) => localizeQuizQuestion(q, locale));
    let correct = 0;
    localQs.forEach((q) => { if (answers[q.id] === q.correct_option) correct++; });
    const pct = localQs.length > 0 ? Math.round((correct / localQs.length) * 100) : 100;
    setScore(pct);
    setSubmitted(true);

    if (pct >= 60) {
      await markComplete(pct);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson || !course) return null;

  // Show locked screen if user tries to access lesson without completing previous
  if (isLessonLocked) {
    const prevLesson = lessons[currentIndex - 1];
    const prevLoc = localizeLesson(prevLesson, locale);
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {locale === 'uz' ? 'Bu dars qulflangan' : locale === 'ru' ? 'Урок заблокирован' : 'Lesson Locked'}
        </h2>
        <p className="text-slate-500 mb-1 max-w-sm">
          {locale === 'uz'
            ? 'Avvalgi darsni muvaffaqiyatli tugatganingizdan so\'ng bu dars ochiladi.'
            : locale === 'ru'
            ? 'Этот урок откроется после успешного завершения предыдущего урока.'
            : 'Complete the previous lesson to unlock this one.'}
        </p>
        <p className="text-amber-600 font-medium text-sm mb-6">"{prevLoc.title}"</p>
        <Button variant="gold" onClick={() => router.push(`/${locale}/courses/${courseId}/learn/${prevLesson.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {locale === 'uz' ? 'Avvalgi darsga o\'tish' : locale === 'ru' ? 'К предыдущему уроку' : 'Go to previous lesson'}
        </Button>
      </div>
    );
  }

  const loc = localizeLesson(lesson, locale);
  const localQuestions = questions.map((q) => localizeQuizQuestion(q, locale));
  const videoId = lesson.video_url ? extractYouTubeId(lesson.video_url) : null;
  const allCourseDone = completedIds.length === lessons.length && lessons.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0F172A] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'uz' ? 'Darslar ro\'yxati' : locale === 'ru' ? 'К урокам' : 'Lessons'}
          </button>
          <p className="text-white text-sm font-medium truncate hidden sm:block">{loc.title}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-shrink-0">
            <span>{completedIds.length}/{lessons.length}</span>
            {alreadyDone && <CheckCircle2 className="w-4 h-4 text-green-400" />}
          </div>
        </div>

        {/* Progress bar in header */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{ width: lessons.length > 0 ? `${Math.round((completedIds.length / lessons.length) * 100)}%` : '0%' }}
          />
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Lesson header */}
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
            <span className="font-medium">{currentIndex + 1} / {lessons.length}</span>
            {alreadyDone && (
              <span className="flex items-center gap-1 text-green-500 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {locale === 'uz' ? 'Bajarilgan' : locale === 'ru' ? 'Завершён' : 'Completed'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{loc.title}</h1>
        </div>

        {/* Save error alert */}
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 text-sm">
                {locale === 'uz' ? 'Xato yuz berdi' : locale === 'ru' ? 'Ошибка' : 'Error'}
              </p>
              <p className="text-red-600 text-sm mt-0.5">{saveError}</p>
              <button
                onClick={() => setSaveError(null)}
                className="text-xs text-red-500 underline mt-1"
              >
                {locale === 'uz' ? 'Yopish' : locale === 'ru' ? 'Закрыть' : 'Dismiss'}
              </button>
            </div>
          </div>
        )}

        {/* Video */}
        {videoId && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={loc.title}
              />
            </div>
          </div>
        )}

        {/* Lecture content */}
        {loc.content && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              {locale === 'uz' ? 'Maruza' : locale === 'ru' ? 'Лекция' : 'Lecture'}
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{loc.content}</p>
          </div>
        )}

        {/* Quiz */}
        {localQuestions.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              {locale === 'uz' ? 'Test' : locale === 'ru' ? 'Тест' : 'Quiz'}
              <span className="text-xs text-slate-400 font-normal">
                ({localQuestions.length} {locale === 'uz' ? 'ta savol' : locale === 'ru' ? 'вопроса' : 'questions'})
              </span>
            </h2>

            {/* Result banner */}
            {alreadyDone && (
              <div className="rounded-xl p-4 mb-5 bg-green-50 text-green-700 border border-green-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p className="font-semibold">
                  {locale === 'uz' ? 'Dars muvaffaqiyatli bajarildi!' : locale === 'ru' ? 'Урок успешно завершён!' : 'Lesson completed!'}
                </p>
              </div>
            )}
            {submitted && !alreadyDone && (
              <div className={`rounded-xl p-4 mb-5 flex items-center gap-3 border ${score >= 60 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {score >= 60
                  ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  : <AlertCircle className="w-5 h-5 flex-shrink-0" />
                }
                <div>
                  <p className="font-semibold">
                    {score >= 60
                      ? (locale === 'uz' ? 'To\'g\'ri! Dars bajarildi' : locale === 'ru' ? 'Верно! Урок завершён' : 'Correct! Lesson done')
                      : (locale === 'uz' ? `${score}% — Qayta urinib ko'ring (60% kerak)` : locale === 'ru' ? `${score}% — Попробуйте снова (нужно 60%)` : `${score}% — Try again (need 60%)`)}
                  </p>
                </div>
              </div>
            )}

            {/* Questions */}
            <div className="space-y-6">
              {localQuestions.map((q, qi) => (
                <div key={q.id}>
                  <p className="font-semibold text-slate-800 mb-3">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = answers[q.id] === oi;
                      const isCorrect = oi === q.correct_option;
                      let cls = 'border border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50';
                      if (submitted || alreadyDone) {
                        if (isCorrect) cls = 'border-green-400 bg-green-50 text-green-800';
                        else if (isSelected && !isCorrect) cls = 'border-red-400 bg-red-50 text-red-700';
                        else cls = 'border-slate-100 text-slate-400';
                      } else if (isSelected) {
                        cls = 'border-amber-400 bg-amber-50 text-amber-800';
                      }
                      return (
                        <button
                          key={oi}
                          disabled={submitted || alreadyDone}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                          className={`w-full text-left p-3 rounded-lg text-sm transition-colors flex items-center gap-3 ${cls} disabled:cursor-default`}
                        >
                          <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                          {(submitted || alreadyDone) && isCorrect && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                        </button>
                      );
                    })}
                  </div>
                  {(submitted || alreadyDone) && q.explanation && (
                    <p className="text-xs text-slate-500 mt-2 ml-2 italic">{q.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Submit / Retry */}
            {!submitted && !alreadyDone && (
              <Button
                variant="gold"
                className="mt-6 w-full sm:w-auto"
                onClick={handleSubmitQuiz}
                disabled={Object.keys(answers).length < localQuestions.length || marking}
              >
                {marking
                  ? (locale === 'uz' ? 'Saqlanmoqda...' : locale === 'ru' ? 'Сохранение...' : 'Saving...')
                  : (locale === 'uz' ? 'Javob yuborish' : locale === 'ru' ? 'Отправить ответы' : 'Submit Answers')}
              </Button>
            )}
            {submitted && score < 60 && !alreadyDone && (
              <Button variant="outline" className="mt-4" onClick={() => { setAnswers({}); setSubmitted(false); setSaveError(null); }}>
                {locale === 'uz' ? 'Qayta urinish' : locale === 'ru' ? 'Попробовать снова' : 'Try again'}
              </Button>
            )}
          </div>
        )}

        {/* No quiz — manual complete button */}
        {localQuestions.length === 0 && !alreadyDone && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center gap-3 text-center">
            <p className="text-slate-500 text-sm">
              {locale === 'uz' ? 'Video yoki matnni o\'rganib chiqqandan so\'ng tugmani bosing.' : locale === 'ru' ? 'Изучите урок и нажмите кнопку.' : 'Study the lesson then mark it as complete.'}
            </p>
            <Button variant="gold" onClick={() => markComplete()} disabled={marking}>
              {marking
                ? (locale === 'uz' ? 'Saqlanmoqda...' : locale === 'ru' ? 'Сохранение...' : 'Saving...')
                : (locale === 'uz' ? 'Darsni tugatish' : locale === 'ru' ? 'Завершить урок' : 'Complete Lesson')}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2 pb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/courses/${courseId}/learn`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {locale === 'uz' ? 'Darslar ro\'yxati' : locale === 'ru' ? 'К урокам' : 'All lessons'}
          </Button>

          {allCourseDone && isLastLesson ? (
            <Button variant="gold" onClick={() => router.push(`/${locale}/certificate/${courseId}`)}>
              <Award className="w-4 h-4 mr-2" />
              {locale === 'uz' ? 'Sertifikat olish' : locale === 'ru' ? 'Получить сертификат' : 'Get Certificate'}
            </Button>
          ) : nextLesson ? (
            <Button
              variant={alreadyDone ? 'gold' : 'outline'}
              disabled={!alreadyDone}
              title={!alreadyDone ? (locale === 'uz' ? 'Avval darsni tugating' : 'Complete this lesson first') : undefined}
              onClick={() => router.push(`/${locale}/courses/${courseId}/learn/${nextLesson.id}`)}
            >
              {locale === 'uz' ? 'Keyingi dars' : locale === 'ru' ? 'Следующий урок' : 'Next Lesson'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
