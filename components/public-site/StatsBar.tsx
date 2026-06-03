import { useTranslations } from 'next-intl';
import { BookOpen, Users, Globe, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  coursesCount: number;
  studentsCount: number;
}

export default function StatsBar({ coursesCount, studentsCount }: StatsBarProps) {
  const t = useTranslations('stats');

  const stats = [
    {
      icon: BookOpen,
      value: coursesCount,
      suffix: '+',
      label: t('courses_label'),
      color: 'from-amber-400/20 to-orange-500/10',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50',
    },
    {
      icon: Users,
      value: studentsCount,
      suffix: '+',
      label: t('students_label'),
      color: 'from-blue-400/20 to-indigo-500/10',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
    },
    {
      icon: Globe,
      value: 3,
      suffix: '',
      label: t('languages_label'),
      color: 'from-emerald-400/20 to-teal-500/10',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50',
    },
    {
      icon: TrendingUp,
      value: 98,
      suffix: '%',
      label: t('satisfaction_label') || "Mamnunlik darajasi",
      color: 'from-violet-400/20 to-purple-500/10',
      iconColor: 'text-violet-500',
      iconBg: 'bg-violet-50',
    },
  ];

  return (
    <section className="relative bg-white border-b border-slate-100 py-14 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 to-white pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i}
                className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-11 h-11 ${stat.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>

                  {/* Value */}
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 tabular-nums">
                    {stat.value > 999
                      ? `${(stat.value / 1000).toFixed(1)}k`
                      : stat.value.toLocaleString()}
                    <span className="text-amber-500">{stat.suffix}</span>
                  </div>

                  {/* Label */}
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
