'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, Mail, GraduationCap, Copy, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const ADMIN_EMAIL = 'admin@onlineacademy.uz';
const ADMIN_PASSWORD = 'Admin2024!';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/admin');
    }
  }, [session, status, router]);

  if (status === 'loading' || (status === 'authenticated' && session)) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setCopiedEmail(true);
        setEmail(text);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPass(true);
        setPassword(text);
        setTimeout(() => setCopiedPass(false), 2000);
      }
      toast.success('Nusxalandi va kiritildi!');
    });
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
        toast.error('Email yoki parol noto\'g\'ri');
      } else {
        toast.success('Xush kelibsiz!');
        router.replace('/admin');
      }
    } catch {
      toast.error('Xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4 shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Online<span className="text-amber-400">Academy</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Admin boshqaruv paneli
          </p>
        </div>

        {/* Credentials info card */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-4 backdrop-blur-sm">
          <p className="text-slate-300 text-xs font-semibold mb-3 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Kirish ma'lumotlari:
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2">
              <div>
                <p className="text-slate-500 text-xs">Email</p>
                <p className="text-amber-300 text-sm font-mono">{ADMIN_EMAIL}</p>
              </div>
              <button
                onClick={() => copyToClipboard(ADMIN_EMAIL, 'email')}
                className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                title="Nusxala va kirish maydoniga qo'y"
              >
                {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between bg-slate-900/50 rounded-lg px-3 py-2">
              <div>
                <p className="text-slate-500 text-xs">Parol</p>
                <p className="text-amber-300 text-sm font-mono">{ADMIN_PASSWORD}</p>
              </div>
              <button
                onClick={() => copyToClipboard(ADMIN_PASSWORD, 'pass')}
                className="text-slate-500 hover:text-amber-400 transition-colors p-1"
                title="Nusxala va kirish maydoniga qo'y"
              >
                {copiedPass ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Admin kirish</h2>
          <p className="text-slate-500 text-sm mb-6">Admin hisobingizga kiring</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email manzil</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@onlineacademy.uz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Parol</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
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
              className="w-full bg-[#0F172A] hover:bg-slate-800 h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Kirilmoqda...
                </span>
              ) : 'Kirish'}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Himoyalangan admin zona — ruxsatsiz kirish taqiqlangan
        </p>
      </div>
    </div>
  );
}
