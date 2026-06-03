import { Lock, Star } from 'lucide-react';
import type { LocalizedCourse } from '@/lib/types';
import { getYouTubeThumbnail, extractYouTubeId } from '@/lib/youtube';

interface CourseCardProps {
  course: LocalizedCourse;
  watchLabel: string;
  freeLabel: string;
  premiumLabel?: string;
  locale: string;
}

export default function CourseCard({
  course,
  watchLabel,
  freeLabel,
  premiumLabel = 'PREMIUM',
  locale,
}: CourseCardProps) {
  const videoId = extractYouTubeId(course.youtube_url);
  const thumbnail =
    course.thumbnail_url ||
    (videoId ? getYouTubeThumbnail(videoId, 'hq') : '/placeholder-course.jpg');

  return (
    <a
      href={`/${locale}/courses/${course.id}`}
      className="group flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden shrink-0 border-b border-gray-100">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Free/Premium badge */}
        <div className="absolute top-2 left-2">
          {course.is_free ? (
            <span className="inline-flex items-center bg-white text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">
              {freeLabel}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-[#1e2229] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">
              <Lock className="w-3 h-3" />
              {premiumLabel}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Provider */}
        <div className="flex items-center mb-2 gap-2">
          <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-gray-500">OA</span>
          </div>
          <span className="text-xs font-semibold text-gray-600">
            OnlineAcademy by Global University
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight mb-1 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-gray-500 mb-2 font-medium">
          {course.title.toLowerCase().includes('coreldraw') || course.title.toLowerCase().includes('corel')
            ? "Kamolova Fazilat"
            : "Prof. O'qituvchi Ismi"}
        </p>

        {/* Description / Skills */}
        <p className="text-sm text-gray-600 line-clamp-1 mb-3">
          Ko'nikmalar: {course.category || 'Veb Dasturlash, Muammolarni hal qilish'}
        </p>

        <div className="mt-auto">
          {/* Rating (Static for display) */}
          <div className="flex items-center gap-1 text-sm text-gray-800 mb-2 font-medium">
            <span>4.8</span>
            <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
            <span className="text-gray-500 font-normal ml-1">(12k sharhlar)</span>
          </div>

          {/* Type / Category */}
          <div className="text-xs text-gray-500 font-medium">
            {course.is_free ? 'Boshlang\'ich' : 'Professional'} · Sertifikat mavjud
          </div>
        </div>
      </div>
    </a>
  );
}
