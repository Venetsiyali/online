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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Bell } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Announcement } from '@/lib/types';

const emptyForm = {
  title_uz: '',
  title_ru: '',
  title_en: '',
  content_uz: '',
  content_ru: '',
  content_en: '',
  is_published: false,
};

export default function AdminAnnouncementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    if (status === 'authenticated') load();
  }, [status]);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/announcements');
    if (res.ok) setAnnouncements(await res.json());
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setForm({
      title_uz: ann.title_uz,
      title_ru: ann.title_ru,
      title_en: ann.title_en,
      content_uz: ann.content_uz,
      content_ru: ann.content_ru,
      content_en: ann.content_en,
      is_published: ann.is_published,
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
      const url = editingId
        ? `/api/admin/announcements/${editingId}`
        : '/api/admin/announcements';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(editingId ? 'Announcement updated!' : 'Announcement created!');
      setDialogOpen(false);
      load();
    } catch {
      toast.error('Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/announcements/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Announcement deleted');
      setAnnouncements((a) => a.filter((x) => x.id !== deleteId));
    } catch {
      toast.error('Failed to delete announcement');
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
              <Bell className="w-6 h-6" />
              Announcements
            </h1>
            <p className="text-slate-500 mt-1">{announcements.length} total announcements</p>
          </div>
          <Button onClick={openCreate} variant="gold" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Announcement
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title (UZ)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400">
                    No announcements yet.
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((ann) => (
                  <TableRow key={ann.id}>
                    <TableCell className="font-medium">{ann.title_uz}</TableCell>
                    <TableCell>
                      <Badge variant={ann.is_published ? 'success' : 'secondary'}>
                        {ann.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {formatDate(ann.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(ann)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(ann.id)}
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

        {/* Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Announcement' : 'Add Announcement'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-2">
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

              <div>
                <Label className="text-base font-semibold">Content</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger>
                    <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uz">
                    <Textarea
                      placeholder="Content in Uzbek"
                      rows={5}
                      value={form.content_uz}
                      onChange={(e) => setForm((f) => ({ ...f, content_uz: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="ru">
                    <Textarea
                      placeholder="Content in Russian"
                      rows={5}
                      value={form.content_ru}
                      onChange={(e) => setForm((f) => ({ ...f, content_ru: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      placeholder="Content in English"
                      rows={5}
                      value={form.content_en}
                      onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_published_ann"
                  checked={form.is_published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_published: v }))}
                />
                <Label htmlFor="is_published_ann">Published</Label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure? This cannot be undone.
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
