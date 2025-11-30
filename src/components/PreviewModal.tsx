import { useEffect, useMemo, useRef, useCallback, lazy, Suspense } from 'react';
import type { Slide, RenderThumbnailProps } from 'yet-another-react-lightbox';
import { useLightboxState } from 'yet-another-react-lightbox';
import { Check } from 'lucide-react';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import type { Photo, Video as VideoType } from '../types';

// Lazy load Lightbox to reduce initial bundle size
const Lightbox = lazy(() => import('yet-another-react-lightbox'));

// Import plugins
import VideoPlugin from 'yet-another-react-lightbox/plugins/video';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';

// ============ Thumbnail Content Component ============
// Uses useLightboxState to get real-time current index to avoid flicker

interface ThumbnailContentProps {
  slide: Slide;
  slideIndex: number;
  isSelected: boolean;
  onSelectClick: (e: React.MouseEvent) => void;
}

function ThumbnailContent({
  slide,
  slideIndex,
  isSelected,
  onSelectClick,
}: ThumbnailContentProps) {
  const { currentIndex } = useLightboxState();
  const isActive = slideIndex === currentIndex;
  const imgSrc =
    slide.type === 'image'
      ? (slide as { src: string }).src
      : (slide as { poster?: string }).poster;

  return (
    <div className="group relative h-full w-full">
      <img src={imgSrc} alt="" className="h-full w-full object-cover" />
      {/* Selected state - centered green checkmark (always visible when not active, visible when not hovering when active) */}
      {isSelected && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 ${
            isActive ? 'opacity-100 group-hover:opacity-0' : 'opacity-100'
          } transition-opacity`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success shadow-lg">
            <Check className="h-5 w-5 text-success-content" />
          </div>
        </div>
      )}
      {/* Select button - only visible on hover for active thumbnail */}
      {/* Using div + role="button" to avoid nested buttons (lightbox thumbnail is already a button) */}
      {isActive && (
        <div
          role="button"
          tabIndex={0}
          className={`absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 ${
            isSelected ? 'bg-black/50' : 'bg-black/40'
          }`}
          onClick={onSelectClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectClick(e as unknown as React.MouseEvent);
            }
          }}
          title={isSelected ? 'Deselect' : 'Select this item'}
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-lg ${
              isSelected
                ? 'bg-error text-error-content'
                : 'bg-success text-success-content'
            }`}
          >
            <Check className="h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}

interface PreviewModalProps {
  photos: Photo[];
  videos: VideoType[];
  mediaType: 'photos' | 'videos';
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  onSelect: (index: number) => void;
  multiple: boolean;
  selectedIds: Set<number>;
}

export function PreviewModal({
  photos,
  videos,
  mediaType,
  index,
  onClose,
  onIndexChange,
  onSelect,
  multiple,
  selectedIds,
}: PreviewModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Open/close dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (index !== null) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [index]);

  // Listen to dialog close event
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Build slides
  const slides = useMemo<Slide[]>(() => {
    if (mediaType === 'photos') {
      return photos.map((photo) => ({
        type: 'image' as const,
        src: photo.src.large2x || photo.src.large,
        alt: photo.alt || '',
        width: photo.width,
        height: photo.height,
      }));
    }

    return videos.map((video) => {
      const hdFile = video.video_files.find((f) => f.quality === 'hd');
      const sdFile = video.video_files.find((f) => f.quality === 'sd');
      const videoFile = hdFile ?? sdFile ?? video.video_files[0];

      return {
        type: 'video' as const,
        width: video.width,
        height: video.height,
        poster: video.image,
        sources: videoFile
          ? [{ src: videoFile.link, type: videoFile.file_type || 'video/mp4' }]
          : [],
      };
    });
  }, [photos, videos, mediaType]);

  // Check if an item at index is selected
  const isIndexSelected = useCallback(
    (idx: number) => {
      if (mediaType === 'photos') {
        const photo = photos[idx];
        return photo ? selectedIds.has(photo.id) : false;
      }
      const video = videos[idx];
      return video ? selectedIds.has(video.id) : false;
    },
    [mediaType, photos, videos, selectedIds]
  );

  // Handle index change
  const handleView = useCallback(
    ({ index: newIndex }: { index: number }) => {
      onIndexChange(newIndex);
    },
    [onIndexChange]
  );

  // Handle select button click
  const handleSelectClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const currentIdx = index ?? 0;
      const currentId =
        mediaType === 'photos'
          ? photos[currentIdx]?.id
          : videos[currentIdx]?.id;
      const isCurrentlySelected =
        currentId !== undefined && selectedIds.has(currentId);

      onSelect(currentIdx);

      // In single-select mode, close only when selecting new (not deselecting)
      if (!multiple && !isCurrentlySelected) {
        onClose();
      }
    },
    [onSelect, multiple, onClose, index, mediaType, photos, videos, selectedIds]
  );

  // Custom thumbnail render - uses ThumbnailContent component for real-time currentIndex
  const renderThumbnail = useCallback(
    ({ slide }: RenderThumbnailProps) => {
      const slideIndex = slides.findIndex((s) => s === slide);
      const isSelected = isIndexSelected(slideIndex);

      return (
        <ThumbnailContent
          slide={slide}
          slideIndex={slideIndex}
          isSelected={isSelected}
          onSelectClick={handleSelectClick}
        />
      );
    },
    [slides, isIndexSelected, handleSelectClick]
  );

  if (index === null) {
    return (
      <dialog ref={dialogRef} className="hidden">
        <div ref={containerRef} />
      </dialog>
    );
  }

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-0 h-screen max-h-none w-screen max-w-none border-none bg-transparent p-0 outline-none"
    >
      <div ref={containerRef} className="h-full w-full">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-black">
              <span className="loading loading-spinner loading-lg text-white" />
            </div>
          }
        >
          <Lightbox
            open={true}
            close={onClose}
            slides={slides}
            index={index}
            on={{ view: handleView }}
            plugins={[VideoPlugin, Thumbnails]}
            portal={{ root: containerRef.current }}
            video={{
              autoPlay: true,
              muted: true,
              loop: true,
              controls: true,
            }}
            thumbnails={{
              position: 'bottom',
              width: 100,
              height: 70,
              border: 2,
              borderRadius: 4,
              padding: 4,
              gap: 8,
              imageFit: 'cover',
              showToggle: false,
            }}
            carousel={{
              finite: false,
              preload: 2,
            }}
            controller={{
              closeOnBackdropClick: true,
              closeOnPullDown: true,
              closeOnPullUp: true,
            }}
            styles={{
              container: {
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
              },
            }}
            animation={{
              fade: 200,
              swipe: 300,
            }}
            render={{
              thumbnail: renderThumbnail,
            }}
          />
        </Suspense>
      </div>
    </dialog>
  );
}
