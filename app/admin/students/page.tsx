'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Search, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Student } from '@/lib/types';

export default function AdminStudentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') load();
  }, [status]);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/students');
    if (res.ok) {
      const data = await res.json();
      setStudents(data.students || []);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(
      (s) =>
        s.full_name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q)
    );
  }, [students, search]);

  const exportCSV = () => {
    const headers = ['Name', 'Phone', 'Email', 'Course', 'Enrolled At'];
    const rows = filtered.map((s) => [
      s.full_name,
      s.phone,
      s.email || '',
      s.courses?.title_en || '',
      s.enrolled_at,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!session && status !== 'loading') return null;

  return (
    <Sidebar>
      <Toaster />
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Students
            </h1>
            <p className="text-slate-500 mt-1">
              {students.length} total enrollments
            </p>
          </div>
          <Button onClick={exportCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Enrolled Course</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                      {search ? 'No students match your search.' : 'No students enrolled yet.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((student, i) => (
                    <TableRow key={student.id}>
                      <TableCell className="text-slate-400 text-sm">{i + 1}</TableCell>
                      <TableCell className="font-medium">{student.full_name}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell className="text-slate-500">
                        {student.email || <span className="text-slate-300">—</span>}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {student.courses?.title_en || (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatDate(student.enrolled_at)}
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
