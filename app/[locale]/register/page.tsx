'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';

export default function RegisterPage() {
  const locale = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const L = {
    uz: { title: 'Ro\'yxatdan o\'ting', sub: 'Yangi hisob yarating', name: 'Ism familiya', email: 'Elektron pochta', pass: 'Parol', confirm: 'Parolni tasdiqlang', btn: 'Ro\'yxatdan o\'tish', loading: 'Yuklanmoqda...', short: 'Parol kamida 6 ta belgi', mismatch: 'Parollar mos kelmaydi', exists: 'Bu email allaqachon ro\'yxatdan o\'tgan', err: 'Xatolik yuz berdi', success: 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!', hasAcc: 'Hisobingiz bormi?', login: 'Kirish', back: 'Bosh sahifa' },
    ru: { title: 'Регистрация', sub: 'Создайте новый аккаунт', name: 'Имя и фамилия', email: 'Электронная почта', pass: 'Пароль', confirm: 'Подтвердите пароль', btn: 'Зарегистрироваться', loading: 'Загрузка...', short: 'Пароль минимум 6 символов', mismatch: 'Пароли не совпадают', exists: 'Этот email уже зарегистрирован', err: 'Произошла ошибка', success: 'Вы успешно зарегистрированы!', hasAcc: 'Уже есть аккаунт?', login: 'Войти', back: 'Главная' },
    en: { title: 'Create Account', sub: 'Sign up for free', name: 'Full name', email: 'Email address', pass: 'Password', confirm: 'Confirm password', btn: 'Create Account', loading: 'Loading...', short: 'Password must be at least 6 characters', mismatch: 'Passwords do not match', exists: 'This email is already registered', err: 'An error occurred', success: 'Account created successfully!', hasAcc: 'Already have an account?', login: 'Sign In', back: 'Home' },
  }[locale as 'uz' | 'ru' | 'en'] ?? { title: 'Register', sub: '', name: 'Name', email: 'Email', pass: 'Password', confirm: 'Confirm', btn: 'Register', loading: 'Loading...', short: 'Min 6 chars', mismatch: 'Mismatch', exists: 'Exists', err: 'Error', success: 'Done!', hasAcc: 'Have account?', login: 'Login', back: 'Home' };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error(L.short); return; }
    if (form.password !== form.confirm) { toast.error(L.mismatch); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, full_name: form.name }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error?.toLowerCase().includes('already')) {
          toast.error(L.exists);
        } else {
          toast.error(data.error || L.err);
        }
        return;
      }

      // Auto sign in after registration
      const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
      if (result?.error) {
        toast.success(L.success);
        setTimeout(() => router.push(`/${locale}/login`), 1500);
      } else {
        toast.success(L.success);
        router.push(`/${locale}/dashboard`);
        router.refresh();
      }
    } catch {
      toast.error(L.err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Toaster />
      <a href={`/${locale}`} className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </a>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href={`/${locale}`} className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">Online<span className="text-amber-500">Academy</span></span>
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{L.title}</h1>
          <p className="text-slate-500 text-sm mb-6">{L.sub}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{L.name}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="name" type="text" placeholder="John Doe" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="pl-10" required />
              </div>
            </div>
            <div>
              <Label htmlFor="email">{L.email}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="pl-10" required autoComplete="email" />
              </div>
            </div>
            <div>
              <Label htmlFor="password">{L.pass}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="pl-10 pr-10" required autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm">{L.confirm}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input id="confirm" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="pl-10" required autoComplete="new-password" />
              </div>
            </div>
            <Button type="submit" variant="gold" className="w-full" size="lg" disabled={loading}>
              {loading ? L.loading : L.btn}
            </Button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-6">
            {L.hasAcc}{' '}
            <a href={`/${locale}/login`} className="text-amber-500 hover:text-amber-600 font-semibold">{L.login}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
