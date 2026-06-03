'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, BookOpen, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { Lesson, QuizQuestion } from '@/lib/types';

interface Course { id: string; title_uz: string; }

const emptyLesson = {
  title_uz: '', title_ru: '', title_en: '',
  content_uz: '', content_ru: '', content_en: '',
  video_url: '', duration_minutes: 0, order_index: 0, is_published: false,
};

const emptyQuiz = {
  question_uz: '', question_ru: '', question_en: '',
  options_uz: ['', '', '', ''], options_ru: ['', '', '', ''], options_en: ['', '', '', ''],
  correct_option: 0,
  explanation_uz: '', explanation_ru: '', explanation_en: '',
  order_index: 0,
};

export default function AdminLessonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [lessonDialog, setLessonDialog] = useState(false);
  const [quizDialog, setQuizDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteQuizId, setDeleteQuizId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [currentLessonForQuiz, setCurrentLessonForQuiz] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState(emptyLesson);
  const [quizForm, setQuizForm] = useState(emptyQuiz);
  const [saving, setSaving] = useState(false);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Record<string, QuizQuestion[]>>({});

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
    if (res.ok) setLessons(await res.json());
    setLoading(false);
  };

  const loadQuizzes = async (lessonId: string) => {
    const res = await fetch(`/api/admin/quizzes?lesson_id=${lessonId}`);
    if (res.ok) {
      const data = await res.json();
      setQuizzes((prev) => ({ ...prev, [lessonId]: data }));
    }
  };

  const toggleExpand = (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lessonId);
      if (!quizzes[lessonId]) loadQuizzes(lessonId);
    }
  };

  const openCreateLesson = () => {
    setEditingLessonId(null);
    setLessonForm({ ...emptyLesson, order_index: lessons.length });
    setLessonDialog(true);
  };

  const openEditLesson = (lesson: Lesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      title_uz: lesson.title_uz, title_ru: lesson.title_ru, title_en: lesson.title_en,
      content_uz: lesson.content_uz, content_ru: lesson.content_ru, content_en: lesson.content_en,
      video_url: lesson.video_url || '', duration_minutes: lesson.duration_minutes,
      order_index: lesson.order_index, is_published: lesson.is_published,
    });
    setLessonDialog(true);
  };

  const openCreateQuiz = (lessonId: string) => {
    setEditingQuizId(null);
    setCurrentLessonForQuiz(lessonId);
    const count = quizzes[lessonId]?.length || 0;
    setQuizForm({ ...emptyQuiz, order_index: count });
    setQuizDialog(true);
  };

  const openEditQuiz = (q: QuizQuestion) => {
    setEditingQuizId(q.id);
    setCurrentLessonForQuiz(q.lesson_id);
    setQuizForm({
      question_uz: q.question_uz, question_ru: q.question_ru, question_en: q.question_en,
      options_uz: [...q.options_uz], options_ru: [...q.options_ru], options_en: [...q.options_en],
      correct_option: q.correct_option,
      explanation_uz: q.explanation_uz, explanation_ru: q.explanation_ru, explanation_en: q.explanation_en,
      order_index: q.order_index,
    });
    setQuizDialog(true);
  };

  const saveLesson = async () => {
    if (!lessonForm.title_uz.trim()) { toast.error('UZ title required'); return; }
    setSaving(true);
    try {
      const method = editingLessonId ? 'PUT' : 'POST';
      const url = editingLessonId ? `/api/admin/lessons/${editingLessonId}` : '/api/admin/lessons';
      const body = editingLessonId ? lessonForm : { ...lessonForm, course_id: selectedCourse };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editingLessonId ? 'Dars yangilandi!' : 'Dars qo\'shildi!');
      setLessonDialog(false);
      loadLessons();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xatolik');
    } finally { setSaving(false); }
  };

  const saveQuiz = async () => {
    if (!quizForm.question_uz.trim()) { toast.error('UZ savol required'); return; }
    setSaving(true);
    try {
      const method = editingQuizId ? 'PUT' : 'POST';
      const url = editingQuizId ? `/api/admin/quizzes/${editingQuizId}` : '/api/admin/quizzes';
      const body = editingQuizId ? quizForm : { ...quizForm, lesson_id: currentLessonForQuiz };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      toast.success(editingQuizId ? 'Test yangilandi!' : 'Test qo\'shildi!');
      setQuizDialog(false);
      if (currentLessonForQuiz) loadQuizzes(currentLessonForQuiz);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Xatolik');
    } finally { setSaving(false); }
  };

  const deleteLesson = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/lessons/${deleteId}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Dars o\'chirildi'); setLessons((l) => l.filter((x) => x.id !== deleteId)); }
    else toast.error('Xatolik');
    setDeleteId(null);
  };

  const deleteQuiz = async () => {
    if (!deleteQuizId || !currentLessonForQuiz) return;
    const res = await fetch(`/api/admin/quizzes/${deleteQuizId}`, { method: 'DELETE' });
    if (res.ok) { toast.success('Test o\'chirildi'); loadQuizzes(currentLessonForQuiz); }
    else toast.error('Xatolik');
    setDeleteQuizId(null);
  };

  if (!session && status !== 'loading') return null;

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" /> Darslar va Testlar
            </h1>
            <p className="text-slate-500 mt-1 text-sm">Kurs tanlang, dars va test qo'shing</p>
          </div>
        </div>

        {/* Course selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center gap-4">
          <Label className="text-sm font-semibold whitespace-nowrap">Kurs tanlang:</Label>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Kursni tanlang..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.title_uz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCourse && (
            <Button onClick={openCreateLesson} variant="gold" size="sm" className="gap-2 ml-auto">
              <Plus className="w-4 h-4" /> Dars qo'shish
            </Button>
          )}
        </div>

        {!selectedCourse ? (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Darslarni boshqarish uchun kurs tanlang</p>
          </div>
        ) : loading ? (
          <div className="text-center py-16 text-slate-400">Yuklanmoqda...</div>
        ) : lessons.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="mb-4">Bu kursda hali darslar yo'q</p>
            <Button onClick={openCreateLesson} variant="gold" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Birinchi darsni qo'shing
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, idx) => (
              <div key={lesson.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Lesson header */}
                <div className="flex items-center gap-3 p-4">
                  <span className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{lesson.title_uz}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={lesson.is_published ? 'success' : 'secondary'} className="text-xs">
                        {lesson.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {lesson.duration_minutes > 0 && (
                        <span className="text-xs text-slate-400">{lesson.duration_minutes} daqiqa</span>
                      )}
                      {lesson.video_url && (
                        <span className="text-xs text-blue-500">▶ Video</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => toggleExpand(lesson.id)}>
                      <HelpCircle className="w-3.5 h-3.5" />
                      Testlar
                      {expandedLesson === lesson.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEditLesson(lesson)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteId(lesson.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Quiz section */}
                {expandedLesson === lesson.id && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-500" />
                        Test savollari ({quizzes[lesson.id]?.length || 0} ta)
                      </p>
                      <Button size="sm" variant="gold" className="gap-1 text-xs" onClick={() => openCreateQuiz(lesson.id)}>
                        <Plus className="w-3 h-3" /> Savol qo'shish
                      </Button>
                    </div>
                    {!quizzes[lesson.id] || quizzes[lesson.id].length === 0 ? (
                      <p className="text-sm text-slate-400 py-2">Hali test savollari yo'q</p>
                    ) : (
                      <div className="space-y-2">
                        {quizzes[lesson.id].map((q, qi) => (
                          <div key={q.id} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-slate-100">
                            <span className="text-xs font-bold text-slate-400 mt-0.5">{qi + 1}.</span>
                            <p className="flex-1 text-sm text-slate-700 line-clamp-2">{q.question_uz}</p>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button size="icon" variant="ghost" className="w-7 h-7"
                                onClick={() => openEditQuiz(q)}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" className="w-7 h-7 text-red-500 hover:bg-red-50"
                                onClick={() => { setDeleteQuizId(q.id); setCurrentLessonForQuiz(q.lesson_id); }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lesson Dialog */}
        <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLessonId ? 'Darsni tahrirlash' : 'Yangi dars qo\'shish'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="font-semibold">Dars nomi *</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList><TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger><TabsTrigger value="ru">🇷🇺 RU</TabsTrigger><TabsTrigger value="en">🇬🇧 EN</TabsTrigger></TabsList>
                  <TabsContent value="uz"><Input placeholder="O'zbekcha nom *" value={lessonForm.title_uz} onChange={(e) => setLessonForm((f) => ({ ...f, title_uz: e.target.value }))} /></TabsContent>
                  <TabsContent value="ru"><Input placeholder="Ruscha nom" value={lessonForm.title_ru} onChange={(e) => setLessonForm((f) => ({ ...f, title_ru: e.target.value }))} /></TabsContent>
                  <TabsContent value="en"><Input placeholder="Inglizcha nom" value={lessonForm.title_en} onChange={(e) => setLessonForm((f) => ({ ...f, title_en: e.target.value }))} /></TabsContent>
                </Tabs>
              </div>
              <div>
                <Label className="font-semibold">Maruza matni</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList><TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger><TabsTrigger value="ru">🇷🇺 RU</TabsTrigger><TabsTrigger value="en">🇬🇧 EN</TabsTrigger></TabsList>
                  <TabsContent value="uz"><Textarea rows={6} placeholder="O'zbekcha matn" value={lessonForm.content_uz} onChange={(e) => setLessonForm((f) => ({ ...f, content_uz: e.target.value }))} /></TabsContent>
                  <TabsContent value="ru"><Textarea rows={6} placeholder="Ruscha matn" value={lessonForm.content_ru} onChange={(e) => setLessonForm((f) => ({ ...f, content_ru: e.target.value }))} /></TabsContent>
                  <TabsContent value="en"><Textarea rows={6} placeholder="Inglizcha matn" value={lessonForm.content_en} onChange={(e) => setLessonForm((f) => ({ ...f, content_en: e.target.value }))} /></TabsContent>
                </Tabs>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>YouTube URL (video)</Label>
                  <Input className="mt-1" placeholder="https://youtube.com/watch?v=..." value={lessonForm.video_url} onChange={(e) => setLessonForm((f) => ({ ...f, video_url: e.target.value }))} />
                </div>
                <div>
                  <Label>Davomiyligi (daqiqa)</Label>
                  <Input className="mt-1" type="number" min={0} value={lessonForm.duration_minutes} onChange={(e) => setLessonForm((f) => ({ ...f, duration_minutes: +e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tartib raqami</Label>
                  <Input className="mt-1" type="number" min={0} value={lessonForm.order_index} onChange={(e) => setLessonForm((f) => ({ ...f, order_index: +e.target.value }))} />
                </div>
                <div className="flex items-center gap-3 mt-6">
                  <Switch checked={lessonForm.is_published} onCheckedChange={(v) => setLessonForm((f) => ({ ...f, is_published: v }))} />
                  <Label>Nashr qilish</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLessonDialog(false)}>Bekor</Button>
              <Button variant="gold" onClick={saveLesson} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Quiz Dialog */}
        <Dialog open={quizDialog} onOpenChange={setQuizDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuizId ? 'Savolni tahrirlash' : 'Yangi savol qo\'shish'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label className="font-semibold">Savol *</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList><TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger><TabsTrigger value="ru">🇷🇺 RU</TabsTrigger><TabsTrigger value="en">🇬🇧 EN</TabsTrigger></TabsList>
                  <TabsContent value="uz"><Textarea rows={2} placeholder="O'zbekcha savol *" value={quizForm.question_uz} onChange={(e) => setQuizForm((f) => ({ ...f, question_uz: e.target.value }))} /></TabsContent>
                  <TabsContent value="ru"><Textarea rows={2} placeholder="Ruscha savol" value={quizForm.question_ru} onChange={(e) => setQuizForm((f) => ({ ...f, question_ru: e.target.value }))} /></TabsContent>
                  <TabsContent value="en"><Textarea rows={2} placeholder="Inglizcha savol" value={quizForm.question_en} onChange={(e) => setQuizForm((f) => ({ ...f, question_en: e.target.value }))} /></TabsContent>
                </Tabs>
              </div>

              {/* Options */}
              <div>
                <Label className="font-semibold">Javob variantlari (O'zbekcha)</Label>
                <div className="space-y-2 mt-2">
                  {quizForm.options_uz.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={quizForm.correct_option === i}
                        onChange={() => setQuizForm((f) => ({ ...f, correct_option: i }))}
                        className="accent-amber-500"
                        title={`Variant ${i + 1} to'g'ri javob`}
                      />
                      <span className="text-xs font-semibold text-slate-500 w-4">{String.fromCharCode(65 + i)}.</span>
                      <Input
                        placeholder={`Variant ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quizForm.options_uz];
                          updated[i] = e.target.value;
                          setQuizForm((f) => ({ ...f, options_uz: updated }));
                        }}
                        className={quizForm.correct_option === i ? 'border-green-400' : ''}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-slate-400">Radio tugmasini bosib to'g'ri javobni belgilang</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Izoh (ixtiyoriy)</Label>
                <Textarea rows={2} className="mt-1" placeholder="To'g'ri javob tushuntirishi..." value={quizForm.explanation_uz} onChange={(e) => setQuizForm((f) => ({ ...f, explanation_uz: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setQuizDialog(false)}>Bekor</Button>
              <Button variant="gold" onClick={saveQuiz} disabled={saving}>{saving ? 'Saqlanmoqda...' : 'Saqlash'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete lesson */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Darsni o'chirish</AlertDialogTitle>
              <AlertDialogDescription>Bu dars va uning barcha testlari o'chib ketadi. Ishonchingiz komilmi?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Bekor</AlertDialogCancel>
              <AlertDialogAction onClick={deleteLesson} className="bg-red-500 hover:bg-red-600">O'chirish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete quiz */}
        <AlertDialog open={!!deleteQuizId} onOpenChange={(o) => !o && setDeleteQuizId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Savolni o'chirish</AlertDialogTitle>
              <AlertDialogDescription>Ushbu test savoli o'chib ketadi.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Bekor</AlertDialogCancel>
              <AlertDialogAction onClick={deleteQuiz} className="bg-red-500 hover:bg-red-600">O'chirish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Sidebar>
  );
}
