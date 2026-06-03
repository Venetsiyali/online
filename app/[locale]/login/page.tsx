'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';

export default function LoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const L = {
    uz: {
      title: 'Xush kelibsiz',
      sub: 'Hisobingizga kiring',
      email: 'Elektron pochta',
      pass: 'Parol',
      btn: 'Kirish',
      loading: 'Kirish...',
      err: 'Email yoki parol noto\'g\'ri',
      noAcc: 'Hisobingiz yo\'qmi?',
      reg: 'Ro\'yxatdan o\'ting',
      back: 'Bosh sahifa',
    },
    ru: {
      title: 'Добро пожаловать',
      sub: 'Войдите в аккаунт',
      email: 'Электронная почта',
      pass: 'Пароль',
      btn: 'Войти',
      loading: 'Вход...',
      err: 'Неверный email или пароль',
      noAcc: 'Нет аккаунта?',
      reg: 'Зарегистрироваться',
      back: 'Главная',
    },
    en: {
      title: 'Welcome back',
      sub: 'Sign in to your account',
      email: 'Email address',
      pass: 'Password',
      btn: 'Sign In',
      loading: 'Signing in...',
      err: 'Invalid email or password',
      noAcc: 'No account?',
      reg: 'Register',
      back: 'Home',
    },
  }[locale as 'uz' | 'ru' | 'en'] ?? {
    title: 'Sign In', sub: '', email: 'Email', pass: 'Password',
    btn: 'Sign In', loading: 'Loading...', err: 'Invalid credentials',
    noAcc: 'No account?', reg: 'Register', back: 'Home',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(L.err);
      } else {
        // Check if admin logged in — redirect to admin panel
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;

        if (role === 'admin') {
          router.replace('/admin');
        } else {
          router.replace(`/${locale}/dashboard`);
        }
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
      <a
        href={`/${locale}`}
        className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {L.back}
      </a>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href={`/${locale}`} className="inline-flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-[#0F172A]">
              Online<span className="text-amber-500">Academy</span>
            </span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{L.title}</h1>
          <p className="text-slate-500 text-sm mb-6">{L.sub}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{L.email}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{L.pass}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? L.loading : L.btn}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {L.noAcc}{' '}
            <a
              href={`/${locale}/register`}
              className="text-amber-500 hover:text-amber-600 font-semibold"
            >
              {L.reg}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
