'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  BookOpen,
  Bell,
  Users,
  Tag,
  LogOut,
  Menu,
  X,
  GraduationCap,
  PlaySquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/lessons', label: 'Lessons & Quizzes', icon: PlaySquare },
  { href: '/admin/announcements', label: 'Announcements', icon: Bell },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/pricing', label: 'Pricing', icon: Tag },
];

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <a href="/admin" className="flex items-center gap-2 text-white font-bold text-lg">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span>
            Online<span className="text-amber-400">Academy</span>
          </span>
        </a>
        <p className="text-slate-500 text-xs mt-1 ml-10">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0F172A] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#0F172A] flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center justify-between bg-[#0F172A] px-4 py-3">
          <a href="/admin" className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 bg-amber-500 rounded-md flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm">
              Online<span className="text-amber-400">Academy</span>
            </span>
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-white p-2"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
