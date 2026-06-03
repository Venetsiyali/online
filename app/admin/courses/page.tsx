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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Course } from '@/lib/types';

const CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Languages',
  'Personal Development',
  'Other',
];

const emptyForm = {
  title_uz: '',
  title_ru: '',
  title_en: '',
  description_uz: '',
  description_ru: '',
  description_en: '',
  youtube_url: '',
  thumbnail_url: '',
  category: '',
  is_free: true,
  is_published: false,
};

export default function AdminCoursesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') loadCourses();
  }, [status]);

  const loadCourses = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/courses');
    if (res.ok) setCourses(await res.json());
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingId(course.id);
    setForm({
      title_uz: course.title_uz,
      title_ru: course.title_ru,
      title_en: course.title_en,
      description_uz: course.description_uz,
      description_ru: course.description_ru,
      description_en: course.description_en,
      youtube_url: course.youtube_url,
      thumbnail_url: course.thumbnail_url || '',
      category: course.category || '',
      is_free: course.is_free,
      is_published: course.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title_uz.trim()) {
      toast.error('Uzbek title is required');
      return;
    }
    setSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed (${res.status})`);
      }
      toast.success(editingId ? 'Course updated!' : 'Course created!');
      setDialogOpen(false);
      loadCourses();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/courses/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Course deleted');
      setCourses((c) => c.filter((x) => x.id !== deleteId));
    } catch {
      toast.error('Failed to delete course');
    } finally {
      setDeleteId(null);
    }
  };

  if (!session && status !== 'loading') return null;

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Courses
            </h1>
            <p className="text-slate-500 mt-1">{courses.length} total courses</p>
          </div>
          <Button onClick={openCreate} variant="gold" className="gap-2">
            <Plus className="w-4 h-4" />
            Add New Course
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title (UZ)</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Free</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : courses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      No courses yet. Add your first course.
                    </TableCell>
                  </TableRow>
                ) : (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium max-w-xs">
                        <div className="truncate">{course.title_uz}</div>
                        {course.youtube_url && (
                          <a
                            href={`https://www.youtube.com/watch?v=${course.youtube_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1 mt-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                            YouTube
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {course.category ? (
                          <Badge variant="secondary">{course.category}</Badge>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.is_published ? 'success' : 'secondary'}>
                          {course.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={course.is_free ? 'gold' : 'navy'}>
                          {course.is_free ? 'Free' : 'Premium'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatDate(course.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(course)}
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteId(course.id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Course Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Course' : 'Add New Course'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-2">
              {/* Titles */}
              <div>
                <Label className="text-base font-semibold">Title</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger>
                    <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uz">
                    <Input
                      placeholder="Title in Uzbek *"
                      value={form.title_uz}
                      onChange={(e) => setForm((f) => ({ ...f, title_uz: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="ru">
                    <Input
                      placeholder="Title in Russian"
                      value={form.title_ru}
                      onChange={(e) => setForm((f) => ({ ...f, title_ru: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      placeholder="Title in English"
                      value={form.title_en}
                      onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Descriptions */}
              <div>
                <Label className="text-base font-semibold">Description</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger>
                    <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uz">
                    <Textarea
                      placeholder="Description in Uzbek"
                      rows={4}
                      value={form.description_uz}
                      onChange={(e) => setForm((f) => ({ ...f, description_uz: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="ru">
                    <Textarea
                      placeholder="Description in Russian"
                      rows={4}
                      value={form.description_ru}
                      onChange={(e) => setForm((f) => ({ ...f, description_ru: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      placeholder="Description in English"
                      rows={4}
                      value={form.description_en}
                      onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* YouTube URL */}
              <div>
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                  value={form.youtube_url}
                  onChange={(e) => setForm((f) => ({ ...f, youtube_url: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Paste the full YouTube URL — the video ID will be extracted automatically
                </p>
              </div>

              {/* Thumbnail URL */}
              <div>
                <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
                <Input
                  id="thumbnail_url"
                  placeholder="https://..."
                  value={form.thumbnail_url}
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail_url: e.target.value }))}
                  className="mt-1"
                />
              </div>

              {/* Category */}
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_free"
                    checked={form.is_free}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_free: v }))}
                  />
                  <Label htmlFor="is_free">Free Course</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_published"
                    checked={form.is_published}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Course</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this course? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Sidebar>
  );
}
