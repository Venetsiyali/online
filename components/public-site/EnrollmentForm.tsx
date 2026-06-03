'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface EnrollmentFormProps {
  courseId: string;
}

export default function EnrollmentForm({ courseId }: EnrollmentFormProps) {
  const t = useTranslations('course_detail');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.phone.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, course_id: courseId }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      toast.success(t('success'));
    } catch {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlus className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-green-800 font-semibold">{t('success')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-amber-500" />
          {t('enroll_title')}
        </h3>
        <p className="text-slate-500 text-sm mt-1">{t('enroll_subtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="full_name">{t('name_label')} *</Label>
          <Input
            id="full_name"
            placeholder={t('name_placeholder')}
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="phone">{t('phone_label')} *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t('phone_placeholder')}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="email">{t('email_label')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('email_placeholder')}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1"
          />
        </div>
        <Button type="submit" variant="gold" className="w-full" disabled={loading}>
          {loading ? t('submitting') : t('submit')}
        </Button>
      </form>
    </div>
  );
}
