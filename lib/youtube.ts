/**
 * Extracts YouTube video ID from various URL formats or returns the ID if already provided.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Already an 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return url.trim();

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function getYouTubeThumbnail(
  videoId: string,
  quality: 'default' | 'hq' | 'mq' | 'sd' | 'max' = 'hq'
): string {
  const qualityMap = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    max: 'maxresdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
}
