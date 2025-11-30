import { memo, useState, useRef, useMemo, type MouseEvent } from 'react';
import { Play, Eye } from 'lucide-react';
import { BaseMediaCard, LoadingPlaceholder } from './BaseMediaCard';
import type { Video } from '../../types';

interface VideoCardProps {
  video: Video;
  selected: boolean;
  onClick: () => void;
  onPreview?: () => void;
  className?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const VideoCard = memo(function VideoCard({
  video,
  selected,
  onClick,
  onPreview,
  className,
}: VideoCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePreviewClick = (e: MouseEvent) => {
    e.stopPropagation();
    onPreview?.();
  };

  // Cache preview file lookup result
  const previewFile = useMemo(() => {
    return (
      video.video_files.find((f) => f.quality === 'sd') ??
      video.video_files.find((f) => f.quality === 'hd') ??
      video.video_files[0]
    );
  }, [video.video_files]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay failure (browser policy restriction)
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <BaseMediaCard selected={selected} onClick={onClick} aspectRatio="video" className={className}>
        {/* Loading placeholder */}
        <LoadingPlaceholder loaded={loaded} />

        {/* Cover image */}
        <img
          src={video.image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${isHovering && previewFile ? 'opacity-0' : ''}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />

        {/* Preview video (hover play) */}
        {previewFile && (
          <video
            ref={videoRef}
            src={previewFile.link}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
            preload="none"
          />
        )}

        {/* Preview button (top left) */}
        {onPreview && (
          <button
            className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
            onClick={handlePreviewClick}
            aria-label="Preview video"
          >
            <Eye className="h-4 w-4 text-white" />
          </button>
        )}

        {/* Play icon (visible when not hovering) */}
        {!isHovering && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
              <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Bottom info bar: duration (left) + author (right) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center justify-between">
            <span className="rounded bg-black/50 px-1.5 py-0.5 text-xs text-white">
              {formatDuration(video.duration)}
            </span>
            <span className="ml-2 truncate text-xs text-white">
              {video.user.name}
            </span>
          </div>
        </div>

        {/* Duration label when not hovering (bottom left) */}
        <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white transition-opacity group-hover:opacity-0">
          {formatDuration(video.duration)}
        </div>
      </BaseMediaCard>
    </div>
  );
});
