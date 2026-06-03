import { Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { LocalizedAnnouncement } from '@/lib/types';

interface AnnouncementCardProps {
  announcement: LocalizedAnnouncement;
  readMoreLabel: string;
  locale: string;
}

export default function AnnouncementCard({
  announcement,
  readMoreLabel,
  locale,
}: AnnouncementCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-center gap-2 text-amber-500 mb-3">
        <Calendar className="w-4 h-4" />
        <span className="text-xs font-medium text-slate-500">
          {formatDate(announcement.created_at, locale)}
        </span>
      </div>
      <h3 className="font-semibold text-slate-900 text-lg mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
        {announcement.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
        {announcement.content}
      </p>
      <a
        href={`/${locale}/announcements/${announcement.id}`}
        className="inline-flex items-center gap-1.5 text-amber-500 hover:text-amber-600 text-sm font-semibold transition-colors group/link"
      >
        {readMoreLabel}
        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}
