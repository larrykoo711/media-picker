import { memo, useState, type MouseEvent } from 'react';
import { Eye } from 'lucide-react';
import {
  BaseMediaCard,
  AuthorOverlay,
  LoadingPlaceholder,
} from './BaseMediaCard';
import type { Photo } from '../../types';

interface PhotoCardProps {
  photo: Photo;
  selected: boolean;
  onClick: () => void;
  onPreview?: () => void;
  className?: string;
}

export const PhotoCard = memo(function PhotoCard({
  photo,
  selected,
  onClick,
  onPreview,
  className,
}: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false);

  const handlePreviewClick = (e: MouseEvent) => {
    e.stopPropagation();
    onPreview?.();
  };

  return (
    <BaseMediaCard selected={selected} onClick={onClick} aspectRatio="photo" className={className}>
      {/* Background color placeholder */}
      <LoadingPlaceholder loaded={loaded} bgColor={photo.avg_color} />

      {/* Image */}
      <img
        src={photo.src.medium}
        alt={photo.alt || ''}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />

      {/* Preview button (top left) */}
      {onPreview && (
        <button
          className="absolute left-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-primary group-hover:opacity-100"
          onClick={handlePreviewClick}
          aria-label="Preview image"
        >
          <Eye className="h-4 w-4 text-white" />
        </button>
      )}

      {/* Author info */}
      <AuthorOverlay author={photo.photographer} />
    </BaseMediaCard>
  );
});
