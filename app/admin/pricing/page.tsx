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
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { PricingPlan } from '@/lib/types';

const emptyForm = {
  name_uz: '',
  name_ru: '',
  name_en: '',
  price: '0',
  currency: 'UZS',
  features_uz: '',
  features_ru: '',
  features_en: '',
  is_popular: false,
  is_active: true,
};

export default function AdminPricingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
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
    const res = await fetch('/api/admin/pricing');
    if (res.ok) setPlans(await res.json());
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (plan: PricingPlan) => {
    setEditingId(plan.id);
    setForm({
      name_uz: plan.name_uz,
      name_ru: plan.name_ru,
      name_en: plan.name_en,
      price: String(plan.price),
      currency: plan.currency,
      features_uz: plan.features_uz?.join('\n') || '',
      features_ru: plan.features_ru?.join('\n') || '',
      features_en: plan.features_en?.join('\n') || '',
      is_popular: plan.is_popular,
      is_active: plan.is_active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_uz.trim()) {
      toast.error('Uzbek name is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        features_uz: form.features_uz.split('\n').filter(Boolean),
        features_ru: form.features_ru.split('\n').filter(Boolean),
        features_en: form.features_en.split('\n').filter(Boolean),
      };
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/admin/pricing/${editingId}` : '/api/admin/pricing';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(editingId ? 'Plan updated!' : 'Plan created!');
      setDialogOpen(false);
      load();
    } catch {
      toast.error('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/pricing/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast.success('Plan deleted');
      setPlans((p) => p.filter((x) => x.id !== deleteId));
    } catch {
      toast.error('Failed to delete plan');
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
              <Tag className="w-6 h-6" />
              Pricing Plans
            </h1>
            <p className="text-slate-500 mt-1">{plans.length} plans</p>
          </div>
          <Button onClick={openCreate} variant="gold" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Plan
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (UZ)</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Popular</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-400">
                    No pricing plans yet.
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name_uz}</TableCell>
                    <TableCell>
                      {plan.price === 0 ? (
                        <Badge variant="success">Free</Badge>
                      ) : (
                        <span className="font-semibold text-slate-700">
                          {formatPrice(plan.price, plan.currency)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {plan.is_popular ? (
                        <Badge variant="gold">Popular</Badge>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_active ? 'success' : 'secondary'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(plan)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setDeleteId(plan.id)}
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
              <DialogTitle>{editingId ? 'Edit Plan' : 'Add Pricing Plan'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-2">
              {/* Names */}
              <div>
                <Label className="text-base font-semibold">Plan Name</Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger>
                    <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uz">
                    <Input
                      placeholder="Name in Uzbek *"
                      value={form.name_uz}
                      onChange={(e) => setForm((f) => ({ ...f, name_uz: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="ru">
                    <Input
                      placeholder="Name in Russian"
                      value={form.name_ru}
                      onChange={(e) => setForm((f) => ({ ...f, name_ru: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      placeholder="Name in English"
                      value={form.name_en}
                      onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Price + Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="UZS"
                    value={form.currency}
                    onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <Label className="text-base font-semibold">
                  Features{' '}
                  <span className="text-slate-400 font-normal text-xs">(one per line)</span>
                </Label>
                <Tabs defaultValue="uz" className="mt-2">
                  <TabsList>
                    <TabsTrigger value="uz">🇺🇿 UZ</TabsTrigger>
                    <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                    <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uz">
                    <Textarea
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      rows={5}
                      value={form.features_uz}
                      onChange={(e) => setForm((f) => ({ ...f, features_uz: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="ru">
                    <Textarea
                      placeholder="Функция 1&#10;Функция 2"
                      rows={5}
                      value={form.features_ru}
                      onChange={(e) => setForm((f) => ({ ...f, features_ru: e.target.value }))}
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      placeholder="Feature 1&#10;Feature 2"
                      rows={5}
                      value={form.features_en}
                      onChange={(e) => setForm((f) => ({ ...f, features_en: e.target.value }))}
                    />
                  </TabsContent>
                </Tabs>
              </div>

              {/* Toggles */}
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_popular_plan"
                    checked={form.is_popular}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_popular: v }))}
                  />
                  <Label htmlFor="is_popular_plan">Mark as Popular</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="is_active_plan"
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                  />
                  <Label htmlFor="is_active_plan">Active</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update Plan' : 'Create Plan'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirm */}
        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Pricing Plan</AlertDialogTitle>
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
