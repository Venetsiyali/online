'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { BookOpen, Users, Bell, Tag, TrendingUp } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { formatDate } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Stats {
  courses: number;
  students: number;
  announcements: number;
  pricing: number;
}

interface RecentStudent {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  enrolled_at: string;
  courses: { title_en: string } | null;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ courses: 0, students: 0, announcements: 0, pricing: 0 });
  const [recent, setRecent] = useState<RecentStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          fetch('/api/admin/dashboard'),
          fetch('/api/admin/students?limit=10'),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (recentRes.ok) {
          const data = await recentRes.json();
          setRecent(Array.isArray(data) ? data : data.students || []);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  const statCards = [
    { label: 'Total Courses', value: stats.courses, icon: BookOpen, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Announcements', value: stats.announcements, icon: Bell, color: 'bg-amber-50 text-amber-600' },
    { label: 'Pricing Plans', value: stats.pricing, icon: Tag, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Welcome back, {session.user?.name || 'Admin'}!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-500 text-sm font-medium">{card.label}</span>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Active
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-900">Recent Enrollments</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                      No enrollments yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recent.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell>{s.phone}</TableCell>
                      <TableCell className="text-slate-500">
                        {s.courses?.title_en || '—'}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatDate(s.enrolled_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
