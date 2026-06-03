'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { GraduationCap, BookOpen, Calendar, User, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/AuthProvider';

interface Enrollment {
  id: string;
  enrolled_at: string;
  courses: {
    id: string;
    title_uz: string;
    title_ru: string;
    title_en: string;
    thumbnail_url: string | null;
    category: string | null;
    is_free: boolean;
  } | null;
}

export default function DashboardPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(true);

  const L = {
    uz: { logout: 'Chiqish', back: 'Bosh sahifaga', title: 'Mening kurslarim', sub: 'Ro\'yxatdan o\'tgan kurslaringiz', enrolled: 'Yozilgan kurslar', enrolledOn: 'Yozilgan sana', noCourses: 'Hali kursga yozilmagan', browse: 'Kurslarga ko\'rish', profile: 'Profil', emailLabel: 'Email', memberSince: 'A\'zo bo\'lgan sana' },
    ru: { logout: 'Выйти', back: 'На главную', title: 'Мои курсы', sub: 'Курсы, на которые вы записались', enrolled: 'Записанные курсы', enrolledOn: 'Дата записи', noCourses: 'Вы ещё не записаны на курсы', browse: 'Смотреть курсы', profile: 'Профиль', emailLabel: 'Email', memberSince: 'Дата регистрации' },
    en: { logout: 'Sign Out', back: 'Back to Home', title: 'My Courses', sub: 'Courses you are enrolled in', enrolled: 'Enrolled Courses', enrolledOn: 'Enrolled on', noCourses: 'You have not enrolled in any courses yet', browse: 'Browse Courses', profile: 'Profile', emailLabel: 'Email', memberSince: 'Member since' },
  }[locale as 'uz' | 'ru' | 'en'] ?? { logout: 'Sign Out', back: 'Home', title: 'Dashboard', sub: '', enrolled: 'Courses', enrolledOn: 'Enrolled', noCourses: 'No courses', browse: 'Browse', profile: 'Profile', emailLabel: 'Email', memberSince: 'Since' };

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, locale, router]);

  useEffect(() => {
    if (!user) return;
    fetch('/api/enrollments')
      .then((r) => r.json())
      .then((d) => {
        setEnrollments(d.enrollments || []);
        setEnrollLoading(false);
      })
      .catch(() => setEnrollLoading(false));
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getTitle = (course: Enrollment['courses']) => {
    if (!course) return '';
    const key = `title_${locale}` as 'title_uz' | 'title_ru' | 'title_en';
    return course[key] || course.title_en;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#0F172A] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href={`/${locale}`} className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span>Online<span className="text-amber-400">Academy</span></span>
          </a>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700 gap-2">
            <LogOut className="w-4 h-4" />
            {L.logout}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <a href={`/${locale}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {L.back}
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="font-bold text-slate-900 text-lg">{user.name || user.email?.split('@')[0]}</h2>
                <p className="text-slate-500 text-sm mt-1 break-all">{user.email}</p>
                <div className="w-full border-t border-slate-100 mt-4 pt-4 text-left space-y-2">
                  <p className="text-xs text-slate-400 uppercase font-semibold tracking-wide">{L.profile}</p>
                  <div>
                    <p className="text-xs text-slate-500">{L.emailLabel}</p>
                    <p className="text-sm font-medium text-slate-700 break-all">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled courses */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h1 className="text-xl font-bold text-slate-900 mb-1">{L.title}</h1>
              <p className="text-slate-500 text-sm mb-6">{L.sub}</p>

              <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                {L.enrolled}
              </h2>

              {enrollLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 mb-4">{L.noCourses}</p>
                  <Button asChild variant="gold" size="sm">
                    <a href={`/${locale}/courses`}>{L.browse}</a>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {enrollments.map((enrollment) => {
                    const course = enrollment.courses;
                    if (!course) return null;
                    const title = getTitle(course);
                    return (
                      <a
                        key={enrollment.id}
                        href={`/${locale}/courses/${course.id}`}
                        className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-colors group"
                      >
                        <div className="w-16 h-16 rounded-lg bg-slate-200 flex-shrink-0 overflow-hidden">
                          {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt={title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <GraduationCap className="w-6 h-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                            {title}
                          </p>
                          {course.category && (
                            <p className="text-xs text-slate-500 mt-0.5">{course.category}</p>
                          )}
                          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {L.enrolledOn}: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
