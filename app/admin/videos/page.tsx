'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Video, CheckCircle2, ExternalLink, Youtube, Save, PlayCircle, Loader2, RefreshCw } from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface Course { id: string; title_uz: string; title_en: string; }

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

interface LessonVideoState {
  id: string;
  title_uz: string;
  order_index: number;
  video_url: string;
  saved: boolean;
  saving: boolean;
  changed: boolean;
}

export default function AdminVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState<LessonVideoState[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') loadCourses();
  }, [status]);

  useEffect(() => {
    if (selectedCourse) loadLessons();
  }, [selectedCourse]);

  const loadCourses = async () => {
    const res = await fetch('/api/admin/courses');
    if (res.ok) setCourses(await res.json());
  };

  const loadLessons = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/lessons?course_id=${selectedCourse}`);
    if (res.ok) {
      const data: Lesson[] = await res.json();
      setLessons(data.map(l => ({
        id: l.id,
        title_uz: l.title_uz,
        order_index: l.order_index,
        video_url: l.video_url || '',
        saved: false,
        saving: false,
        changed: false,
      })));
    }
    setLoading(false);
  };

  const updateUrl = (id: string, val: string) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, video_url: val, changed: true, saved: false } : l));
  };

  const saveLesson = async (lesson: LessonVideoState) => {
    setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, saving: true } : l));
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: lesson.video_url }),
      });
      if (!res.ok) throw new Error('Xatolik');
      setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, saving: false, saved: true, changed: false } : l));
      toast.success(`"${lesson.title_uz}" videosi yangilandi!`);
    } catch {
      setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, saving: false } : l));
      toast.error('Xatolik yuz berdi');
    }
  };

  const saveAll = async () => {
    const changed = lessons.filter(l => l.changed);
    if (!changed.length) { toast.info('O\'zgarish yo\'q'); return; }
    setSavingAll(true);
    for (const l of changed) await saveLesson(l);
    setSavingAll(false);
    toast.success(`${changed.length} ta dars videosi yangilandi!`);
  };

  const selectedCourseName = courses.find(c => c.id === selectedCourse)?.title_uz || '';
  const changedCount = lessons.filter(l => l.changed).length;

  if (!session && status !== 'loading') return null;

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Youtube className="w-7 h-7 text-red-500" />
              Video Boshqaruv
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Kurs darslariga YouTube video linklar qo'shing yoki o'zgartiring
            </p>
          </div>
          {changedCount > 0 && (
            <Button
              onClick={saveAll}
              disabled={savingAll}
              className="bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              {savingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Hammasini saqlash ({changedCount})
            </Button>
          )}
        </div>

        {/* Course selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <Label className="text-sm font-semibold text-slate-700 mb-2 block">
            Kursni tanlang
          </Label>
          <div className="flex gap-3 items-center">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Kursni tanlang..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.title_uz}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCourse && (
              <Button variant="outline" size="sm" onClick={loadLessons} className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Yangilash
              </Button>
            )}
          </div>

          {/* Info box */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">📌 Qanday ishlatiladi:</p>
            <ul className="space-y-0.5 text-blue-600 text-xs">
              <li>• YouTube video linkini yoki video ID sini kiriting</li>
              <li>• Masalan: <code className="bg-blue-100 px-1 rounded">https://youtu.be/dQw4w9WgXcQ</code></li>
              <li>• Yoki faqat ID: <code className="bg-blue-100 px-1 rounded">dQw4w9WgXcQ</code></li>
              <li>• Kiritgach "Saqlash" tugmasini bosing</li>
            </ul>
          </div>
        </div>

        {/* Lessons */}
        {!selectedCourse ? (
          <div className="text-center py-20 text-slate-400">
            <Video className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Darslarni ko'rish uchun kurs tanlang</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Yuklanmoqda...</span>
          </div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>Bu kursda darslar yo'q</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const videoId = extractYouTubeId(lesson.video_url);
              const thumbUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                : null;

              return (
                <div
                  key={lesson.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    lesson.changed
                      ? 'border-amber-400 shadow-amber-100'
                      : lesson.saved
                      ? 'border-green-400 shadow-green-50'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex gap-4 p-4 items-start">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-32 h-[4.5rem] rounded-xl overflow-hidden bg-slate-100 relative">
                      {thumbUrl ? (
                        <>
                          <img
                            src={thumbUrl}
                            alt={lesson.title_uz}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <PlayCircle className="w-7 h-7 text-white drop-shadow-md" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Youtube className="w-7 h-7 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 bg-slate-100 rounded-full text-xs font-bold text-slate-600 flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="font-semibold text-slate-800 text-sm truncate">{lesson.title_uz}</p>
                        {lesson.saved && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Saqlandi
                          </Badge>
                        )}
                        {lesson.changed && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                            O'zgartirildi
                          </Badge>
                        )}
                      </div>

                      {/* URL input */}
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                          <Input
                            ref={el => { inputRefs.current[lesson.id] = el; }}
                            value={lesson.video_url}
                            onChange={e => updateUrl(lesson.id, e.target.value)}
                            placeholder="https://youtu.be/... yoki video ID"
                            className="pl-9 text-sm font-mono"
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveLesson(lesson);
                            }}
                          />
                        </div>

                        {/* Preview link */}
                        {videoId && (
                          <a
                            href={`https://www.youtube.com/watch?v=${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-blue-500 transition-colors flex-shrink-0"
                            title="YouTube'da ko'rish"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {/* Save button */}
                        <Button
                          size="sm"
                          onClick={() => saveLesson(lesson)}
                          disabled={lesson.saving || !lesson.changed}
                          className={`flex-shrink-0 gap-1.5 ${
                            lesson.changed
                              ? 'bg-amber-500 hover:bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {lesson.saving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          Saqlash
                        </Button>
                      </div>

                      {/* Video ID hint */}
                      {videoId && (
                        <p className="text-xs text-slate-400 mt-1 ml-1">
                          Video ID: <code className="bg-slate-100 px-1 rounded">{videoId}</code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
