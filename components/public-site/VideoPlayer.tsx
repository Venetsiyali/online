'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { extractYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

interface VideoPlayerProps {
  youtubeUrl: string;
  title?: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({ youtubeUrl, title, thumbnailUrl }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractYouTubeId(youtubeUrl);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center">
        <p className="text-slate-500 text-sm">Video not available</p>
      </div>
    );
  }

  const thumbnail = thumbnailUrl || getYouTubeThumbnail(videoId, 'max');
  const embedUrl = getYouTubeEmbedUrl(videoId) + '&autoplay=1';

  if (isPlaying) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-2xl">
        <div className="video-container">
          <iframe
            src={embedUrl}
            title={title || 'Course Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-2xl cursor-pointer relative group"
      onClick={() => setIsPlaying(true)}
      role="button"
      aria-label={`Play ${title || 'video'}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setIsPlaying(true)}
    >
      <div className="video-container">
        <img
          src={thumbnail}
          alt={title || 'Course thumbnail'}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-200">
            <Play className="w-9 h-9 text-white ml-1" fill="white" />
          </div>
        </div>
        {/* Title overlay */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-medium text-sm line-clamp-2">{title}</p>
          </div>
        )}
      </div>
    </div>
  );
}
