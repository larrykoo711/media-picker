import { useMemo, useCallback, useEffect } from 'react';
import {
  usePickerStore,
  pickerSelectors,
  photoToMedia,
  videoToMedia,
} from '../store/picker-store';
import { usePexelsPhotos } from '../hooks/usePexelsPhotos';
import { usePexelsVideos } from '../hooks/usePexelsVideos';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PhotoCard, VideoCard } from './cards';
import { PreviewModal } from './PreviewModal';
import { SkeletonGrid } from './SkeletonGrid';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import type { Photo, Video, MediaItem } from '../types';

interface MediaGridProps {
  multiple: boolean;
  maxSelection: number;
  enablePreview?: boolean;
  onMaxSelectionReached?: () => void;
  onPreview?: (media: MediaItem) => void;
  onError?: (error: Error) => void;
  classNames?: {
    grid?: string;
    card?: string;
  };
}

export function MediaGrid({
  multiple,
  maxSelection,
  enablePreview = true,
  onMaxSelectionReached,
  onPreview,
  onError,
  classNames,
}: MediaGridProps) {
  // Use selectors to optimize re-renders
  const mediaType = usePickerStore(pickerSelectors.mediaType);
  const query = usePickerStore(pickerSelectors.query);
  const filters = usePickerStore(pickerSelectors.filters);
  const selectedMedia = usePickerStore(pickerSelectors.selectedMedia);
  const toggleSelect = usePickerStore(pickerSelectors.toggleSelect);
  const previewIndex = usePickerStore(pickerSelectors.previewIndex);
  const setPreviewIndex = usePickerStore(pickerSelectors.setPreviewIndex);

  // Photo query
  const photosQuery = usePexelsPhotos({
    query,
    filters,
    enabled: mediaType === 'photos',
  });

  // Video query
  const videosQuery = usePexelsVideos({
    query,
    filters,
    enabled: mediaType === 'videos',
  });

  const activeQuery = mediaType === 'photos' ? photosQuery : videosQuery;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = activeQuery;

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchNextPage,
    hasMore: hasNextPage ?? false,
    isLoading: isFetchingNextPage,
  });

  // Get items list based on media type
  const photos = useMemo(() => {
    if (mediaType !== 'photos' || !data?.pages) return [];
    return data.pages.flatMap((page) => (page as { photos: Photo[] }).photos);
  }, [data, mediaType]);

  const videos = useMemo(() => {
    if (mediaType !== 'videos' || !data?.pages) return [];
    return data.pages.flatMap((page) => (page as { videos: Video[] }).videos);
  }, [data, mediaType]);

  // Use Set for optimized lookup
  const selectedIds = useMemo(
    () => new Set(selectedMedia.map((m) => m.id)),
    [selectedMedia]
  );

  const isSelected = useCallback(
    (id: number) => selectedIds.has(id),
    [selectedIds]
  );

  const handleSelectPhoto = useCallback(
    (photo: Photo) => {
      const media = photoToMedia(photo);
      const alreadySelected = selectedIds.has(photo.id);

      if (
        multiple &&
        !alreadySelected &&
        selectedMedia.length >= maxSelection
      ) {
        onMaxSelectionReached?.();
        return;
      }

      toggleSelect(media, multiple, maxSelection);
    },
    [
      selectedIds,
      selectedMedia.length,
      multiple,
      maxSelection,
      toggleSelect,
      onMaxSelectionReached,
    ]
  );

  const handleSelectVideo = useCallback(
    (video: Video) => {
      const media = videoToMedia(video);
      const alreadySelected = selectedIds.has(video.id);

      if (
        multiple &&
        !alreadySelected &&
        selectedMedia.length >= maxSelection
      ) {
        onMaxSelectionReached?.();
        return;
      }

      toggleSelect(media, multiple, maxSelection);
    },
    [
      selectedIds,
      selectedMedia.length,
      multiple,
      maxSelection,
      toggleSelect,
      onMaxSelectionReached,
    ]
  );

  // Preview handling - now uses index
  const handlePreviewPhoto = useCallback(
    (index: number) => {
      if (!enablePreview) return;
      setPreviewIndex(index);
      // Call onPreview callback
      const photo = photos[index];
      if (photo && onPreview) {
        onPreview(photoToMedia(photo));
      }
    },
    [setPreviewIndex, enablePreview, photos, onPreview]
  );

  const handlePreviewVideo = useCallback(
    (index: number) => {
      if (!enablePreview) return;
      setPreviewIndex(index);
      // Call onPreview callback
      const video = videos[index];
      if (video && onPreview) {
        onPreview(videoToMedia(video));
      }
    },
    [setPreviewIndex, enablePreview, videos, onPreview]
  );

  const handleClosePreview = useCallback(() => {
    setPreviewIndex(null);
  }, [setPreviewIndex]);

  const handlePreviewIndexChange = useCallback(
    (newIndex: number) => {
      setPreviewIndex(newIndex);
    },
    [setPreviewIndex]
  );

  // Select in preview
  const handlePreviewSelect = useCallback(
    (index: number) => {
      if (mediaType === 'photos') {
        const photo = photos[index];
        if (photo) {
          handleSelectPhoto(photo);
        }
      } else {
        const video = videos[index];
        if (video) {
          handleSelectVideo(video);
        }
      }
    },
    [mediaType, photos, videos, handleSelectPhoto, handleSelectVideo]
  );

  // Report errors to parent - MUST be before any conditional returns
  useEffect(() => {
    if (isError && onError) {
      onError(new Error('Failed to fetch media'));
    }
  }, [isError, onError]);

  // Loading - show skeleton
  if (isLoading) {
    return <SkeletonGrid />;
  }

  // Error state
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // Empty state
  const isEmpty =
    mediaType === 'photos' ? photos.length === 0 : videos.length === 0;
  if (isEmpty) {
    return <EmptyState query={query} />;
  }

  return (
    <div className="p-4">
      {/* Grid layout */}
      <div className={`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${classNames?.grid ?? ''}`}>
        {mediaType === 'photos'
          ? photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                selected={isSelected(photo.id)}
                onClick={() => handleSelectPhoto(photo)}
                onPreview={enablePreview ? () => handlePreviewPhoto(index) : undefined}
                className={classNames?.card}
              />
            ))
          : videos.map((video, index) => (
              <VideoCard
                key={video.id}
                video={video}
                selected={isSelected(video.id)}
                onClick={() => handleSelectVideo(video)}
                onPreview={enablePreview ? () => handlePreviewVideo(index) : undefined}
                className={classNames?.card}
              />
            ))}
      </div>

      {/* Load more indicator */}
      <div ref={sentinelRef} className="flex justify-center py-6">
        {isFetchingNextPage && (
          <span className="loading loading-dots loading-md"></span>
        )}
        {!hasNextPage && (photos.length > 0 || videos.length > 0) && (
          <span className="text-sm text-base-content/50">
            All content loaded
          </span>
        )}
      </div>

      {/* Preview modal */}
      <PreviewModal
        photos={photos}
        videos={videos}
        mediaType={mediaType}
        index={previewIndex}
        onClose={handleClosePreview}
        onIndexChange={handlePreviewIndexChange}
        onSelect={handlePreviewSelect}
        multiple={multiple}
        selectedIds={selectedIds}
      />
    </div>
  );
}
