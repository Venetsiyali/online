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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  CheckCircle2, ExternalLink, Youtube, Save, PlayCircle,
  Loader2, RefreshCw, Plus, Trash2, Pencil, VideoIcon,
  GripVertical, Info, X,
} from 'lucide-react';
import type { Lesson } from '@/lib/types';

interface Course { id: string; title_uz: string; }

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

interface LessonRow extends Lesson {
  saving?: boolean;
  saved?: boolean;
  changed?: boolean;
}

const emptyForm = {
  title_uz: '',
  video_url: '',
  content_uz: '',
  duration_minutes: 0,
};

export default function AdminVideosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [lessons, setLessons] = useState<LessonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingAll, setSavingAll] = useState(false);

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formSaving, setFormSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  // Delete dialog
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');

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
      setLessons(data.map(l => ({ ...l, saving: false, saved: false, changed: false })));
    }
    setLoading(false);
  };

  // Inline URL update
  const updateUrl = (id: string, val: string) => {
    setLessons(prev =>
      prev.map(l => l.id === id ? { ...l, video_url: val, changed: true, saved: false } : l)
    );
  };

  const saveLesson = async (lesson: LessonRow) => {
    setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, saving: true } : l));
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: lesson.video_url }),
      });
      if (!res.ok) throw new Error('Xatolik');
      setLessons(prev =>
        prev.map(l => l.id === lesson.id ? { ...l, saving: false, saved: true, changed: false } : l)
      );
      toast.success(`"${lesson.title_uz}" videosi yangilandi!`);
    } catch {
      setLessons(prev => prev.map(l => l.id === lesson.id ? { ...l, saving: false } : l));
      toast.error('Xatolik yuz berdi');
    }
  };

  const saveAll = async () => {
    const changed = lessons.filter(l => l.changed);
    if (!changed.length) { toast.info("O'zgarish yo'q"); return; }
    setSavingAll(true);
    for (const l of changed) await saveLesson(l);
    setSavingAll(false);
    toast.success(`${changed.length} ta dars videosi yangilandi!`);
  };

  // Open create dialog
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setPreviewUrl('');
    setDialogOpen(true);
  };

  // Open edit dialog
  const openEdit = (lesson: LessonRow) => {
    setEditingId(lesson.id);
    setForm({
      title_uz: lesson.title_uz || '',
      video_url: lesson.video_url || '',
      content_uz: lesson.content_uz || '',
      duration_minutes: lesson.duration_minutes || 0,
    });
    setPreviewUrl(lesson.video_url || '');
    setDialogOpen(true);
  };

  // Save dialog form
  const saveForm = async () => {
    if (!form.title_uz.trim()) { toast.error("Dars nomi (O'zbekcha) kerak!"); return; }
    setFormSaving(true);
    try {
      if (editingId) {
        // Update existing lesson
        const res = await fetch(`/api/admin/lessons/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title_uz: form.title_uz,
            title_ru: form.title_uz, // copy uz to others if not provided
            title_en: form.title_uz,
            content_uz: form.content_uz,
            content_ru: form.content_uz,
            content_en: form.content_uz,
            video_url: form.video_url || null,
            duration_minutes: form.duration_minutes || 0,
            order_index: lessons.find(l => l.id === editingId)?.order_index ?? 0,
            is_published: true,
          }),
        });
        if (!res.ok) throw new Error('Xatolik');
        toast.success("Dars yangilandi!");
      } else {
        // Create new lesson
        const res = await fetch('/api/admin/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: selectedCourse,
            title_uz: form.title_uz,
            title_ru: form.title_uz,
            title_en: form.title_uz,
            content_uz: form.content_uz,
            content_ru: form.content_uz,
            content_en: form.content_uz,
            video_url: form.video_url || null,
            duration_minutes: form.duration_minutes || 0,
            order_index: lessons.length,
            is_published: true,
          }),
        });
        if (!res.ok) throw new Error('Xatolik');
        toast.success("Yangi dars qo'shildi!");
      }
      setDialogOpen(false);
      loadLessons();
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setFormSaving(false);
    }
  };

  // Delete lesson
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/lessons/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success("Dars o'chirildi");
      setLessons(prev => prev.filter(l => l.id !== deleteId));
    } catch {
      toast.error("Xatolik yuz berdi");
    } finally {
      setDeleteId(null);
    }
  };

  const changedCount = lessons.filter(l => l.changed).length;
  const previewId = extractYouTubeId(previewUrl);

  if (!session && status !== 'loading') return null;

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Youtube className="w-7 h-7 text-red-500" />
              Video Boshqaruv
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Darslarni qo&apos;shing, tahrirlang yoki video linkini yangilang
            </p>
          </div>
          <div className="flex gap-2">
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
            {selectedCourse && (
              <Button
                onClick={openCreate}
                className="bg-red-500 hover:bg-red-600 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Yangi dars qo&apos;shish
              </Button>
            )}
          </div>
        </div>

        {/* Course selector */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                Kursni tanlang
              </Label>
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
            </div>
            {selectedCourse && (
              <Button variant="outline" size="sm" onClick={loadLessons} className="gap-1.5 flex-shrink-0">
                <RefreshCw className="w-3.5 h-3.5" />
                Yangilash
              </Button>
            )}
          </div>

          {/* Info tip */}
          <div className="mt-4 flex gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Qanday ishlatiladi: </span>
              YouTube linkini to&apos;g&apos;ridan-to&apos;g&apos;ri yozing (masalan: <code className="bg-blue-100 px-1 rounded">https://youtu.be/VIDEO_ID</code>).
              Yangi dars qo&apos;shish uchun &quot;Yangi dars qo&apos;shish&quot; tugmasini bosing.
            </div>
          </div>
        </div>

        {/* Lessons list */}
        {!selectedCourse ? (
          <div className="text-center py-24 text-slate-300">
            <VideoIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-slate-500 font-medium">Darslarni ko&apos;rish uchun kursni tanlang</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Yuklanmoqda...</span>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            {lessons.length > 0 && (
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  Jami <span className="font-semibold text-slate-700">{lessons.length}</span> ta dars
                  {' · '}
                  <span className="font-semibold text-green-600">
                    {lessons.filter(l => l.video_url).length}
                  </span> ta videoli
                  {' · '}
                  <span className="font-semibold text-amber-600">
                    {lessons.filter(l => !l.video_url).length}
                  </span> ta videosiz
                </p>
              </div>
            )}

            {lessons.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <VideoIcon className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                <p className="text-slate-400 mb-4">Bu kursda hali darslar yo&apos;q</p>
                <Button onClick={openCreate} className="bg-red-500 hover:bg-red-600 text-white gap-2">
                  <Plus className="w-4 h-4" />
                  Birinchi darsni qo&apos;shing
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson, idx) => {
                  const videoId = extractYouTubeId(lesson.video_url || '');
                  const thumbUrl = videoId
                    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
                    : null;

                  return (
                    <div
                      key={lesson.id}
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${
                        lesson.changed
                          ? 'border-amber-400 ring-1 ring-amber-200'
                          : lesson.saved
                          ? 'border-green-400 ring-1 ring-green-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex gap-3 p-4 items-center">
                        {/* Drag handle visual */}
                        <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />

                        {/* Thumbnail */}
                        <div className="flex-shrink-0 w-28 h-16 rounded-lg overflow-hidden bg-slate-100 relative">
                          {thumbUrl ? (
                            <>
                              <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <PlayCircle className="w-6 h-6 text-white drop-shadow" />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Youtube className="w-6 h-6 text-slate-300" />
                              <span className="text-[10px] text-slate-300">Video yo&apos;q</span>
                            </div>
                          )}
                        </div>

                        {/* Info + URL input */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 bg-slate-100 rounded-full text-[11px] font-bold text-slate-500 flex items-center justify-center flex-shrink-0">
                              {idx + 1}
                            </span>
                            <p className="font-semibold text-slate-800 text-sm truncate">{lesson.title_uz}</p>
                            {!lesson.video_url && (
                              <Badge className="bg-orange-100 text-orange-600 border-orange-200 text-[10px] py-0">
                                Video yo&apos;q
                              </Badge>
                            )}
                            {lesson.saved && (
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] py-0">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                                Saqlandi
                              </Badge>
                            )}
                            {lesson.changed && (
                              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] py-0">
                                O&apos;zgartirildi
                              </Badge>
                            )}
                          </div>

                          {/* Inline URL field */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                              <Input
                                value={lesson.video_url || ''}
                                onChange={e => updateUrl(lesson.id, e.target.value)}
                                placeholder="https://youtu.be/... yoki video ID"
                                className="pl-9 text-xs font-mono h-9"
                                onKeyDown={e => { if (e.key === 'Enter') saveLesson(lesson); }}
                              />
                            </div>
                            {videoId && (
                              <a
                                href={`https://www.youtube.com/watch?v=${videoId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-300 hover:text-blue-500 transition-colors flex-shrink-0"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <Button
                              size="sm"
                              onClick={() => saveLesson(lesson)}
                              disabled={lesson.saving || !lesson.changed}
                              className={`flex-shrink-0 h-9 gap-1 text-xs ${
                                lesson.changed
                                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              {lesson.saving
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <Save className="w-3 h-3" />}
                              Saqlash
                            </Button>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-slate-400 hover:text-blue-500"
                            onClick={() => openEdit(lesson)}
                            title="To'liq tahrirlash"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-slate-400 hover:text-red-500"
                            onClick={() => { setDeleteId(lesson.id); setDeleteName(lesson.title_uz); }}
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add new at bottom */}
                <button
                  onClick={openCreate}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Yangi dars qo&apos;shish
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              {editingId ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Title */}
            <div>
              <Label className="font-semibold">
                Dars nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                className="mt-1"
                placeholder="Masalan: 1-dars: CorelDRAW ga kirish"
                value={form.title_uz}
                onChange={e => setForm(f => ({ ...f, title_uz: e.target.value }))}
              />
            </div>

            {/* YouTube URL */}
            <div>
              <Label className="font-semibold">YouTube Video URL</Label>
              <div className="relative mt-1">
                <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                <Input
                  className="pl-9 font-mono text-sm"
                  placeholder="https://youtu.be/VIDEO_ID"
                  value={form.video_url}
                  onChange={e => {
                    setForm(f => ({ ...f, video_url: e.target.value }));
                    setPreviewUrl(e.target.value);
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                YouTube link yoki video ID (masalan: <code>dQw4w9WgXcQ</code>)
              </p>
            </div>

            {/* Video preview */}
            {previewId && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-black">
                <div className="relative" style={{ paddingTop: '56.25%' }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${previewId}?rel=0&modestbranding=1`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Preview"
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900">
                  <span className="text-xs text-slate-400">
                    Video ID: <code className="text-green-400">{previewId}</code>
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${previewId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    YouTube&apos;da ko&apos;rish
                  </a>
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <Label className="font-semibold">Dars matni / Maruza</Label>
              <Textarea
                className="mt-1"
                rows={4}
                placeholder="Dars haqida qisqacha ma'lumot, asosiy tushunchalar..."
                value={form.content_uz}
                onChange={e => setForm(f => ({ ...f, content_uz: e.target.value }))}
              />
            </div>

            {/* Duration */}
            <div>
              <Label className="font-semibold">Davomiyligi (daqiqa)</Label>
              <Input
                className="mt-1 max-w-[150px]"
                type="number"
                min={0}
                placeholder="0"
                value={form.duration_minutes || ''}
                onChange={e => setForm(f => ({ ...f, duration_minutes: +e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="w-4 h-4 mr-1" />
              Bekor
            </Button>
            <Button
              onClick={saveForm}
              disabled={formSaving || !form.title_uz.trim()}
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {formSaving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {editingId ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Darsni o&apos;chirish</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteName}&quot; darsini o&apos;chirasizmi? Bu amalni qaytarib bo&apos;lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              O&apos;chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
