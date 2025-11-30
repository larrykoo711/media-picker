// Main components
export { MediaPicker } from './components/MediaPicker';
export { MediaPickerButton } from './components/MediaPickerButton';

// Provider
export { MediaPickerProvider } from './providers/MediaPickerProvider';

// Hooks
export { useInfiniteScroll } from './hooks/useInfiniteScroll';
export { usePexelsPhotos } from './hooks/usePexelsPhotos';
export { usePexelsVideos } from './hooks/usePexelsVideos';

// Store
export {
  usePickerStore,
  pickerSelectors,
  photoToMedia,
  videoToMedia,
  PickerProvider,
} from './store/picker-store';

// API
export {
  PexelsClient,
  PexelsApiError,
  getPexelsClient,
  configurePexelsClient,
} from './api/pexels-client';

// UI Components (for customization)
export {
  MediaGrid,
  MediaTabs,
  SearchBar,
  PreviewModal,
  EmptyState,
  ErrorState,
  SkeletonGrid,
  PhotoCard,
  VideoCard,
  BaseMediaCard,
} from './components';

// Utils
export { cn } from './utils/cn';
export { formatDuration, formatFileSize, formatDimensions } from './utils/formatters';

// Types
export type {
  // Core types
  MediaItem,
  MediaType,
  MediaPickerProps,
  MediaPickerButtonProps,
  ApiConfig,
  FilterState,
  // Photo types
  Photo,
  PhotoSrc,
  PhotoSearchParams,
  PhotosResponse,
  // Video types
  Video,
  VideoUser,
  VideoFile,
  VideoPicture,
  VideoSearchParams,
  VideoPopularParams,
  VideosResponse,
  // Common types
  Orientation,
  Size,
  PreviewItem,
  // Deprecated (backwards compatibility)
  PexelsMedia,
  PexelsMediaPickerProps,
  PexelsPickerButtonProps,
} from './types';

// Deprecated exports for backwards compatibility
export { MediaPicker as PexelsMediaPicker } from './components/MediaPicker';
export { MediaPickerButton as PexelsPickerButton } from './components/MediaPickerButton';

// CSS import helper
import './styles/media-picker.css';
