// === Common Types ===
export type MediaType = 'photos' | 'videos';
export type Orientation = 'landscape' | 'portrait' | 'square';
export type Size = 'large' | 'medium' | 'small';

// === Photo Types ===
export interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PhotoSrc;
  liked: boolean;
  alt: string;
}

export interface PhotoSrc {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PhotoSearchParams {
  query: string;
  orientation?: Orientation;
  size?: Size;
  color?: string;
  locale?: string;
  page?: number;
  per_page?: number;
}

export interface PhotosResponse {
  page: number;
  per_page: number;
  total_results: number;
  photos: Photo[];
  next_page?: string;
}

// === Video Types ===
export interface Video {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: VideoUser;
  video_files: VideoFile[];
  video_pictures: VideoPicture[];
}

export interface VideoUser {
  id: number;
  name: string;
  url: string;
}

export interface VideoFile {
  id: number;
  quality: 'hd' | 'sd' | 'uhd';
  file_type: string;
  width: number;
  height: number;
  fps: number;
  link: string;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface VideoSearchParams {
  query: string;
  orientation?: Orientation;
  size?: Size;
  page?: number;
  per_page?: number;
}

export interface VideoPopularParams {
  min_width?: number;
  min_height?: number;
  min_duration?: number;
  max_duration?: number;
  page?: number;
  per_page?: number;
}

export interface VideosResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: Video[];
  next_page?: string;
}

// === Component Types ===
export interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  width: number;
  height: number;
  url: string;
  author: string;
  authorUrl: string;
  thumbnail: string;
  avgColor?: string;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  duration?: number;
  videoFiles?: VideoFile[];
}

/** @deprecated Use MediaItem instead */
export type PexelsMedia = MediaItem;

// === State Types ===
export interface FilterState {
  orientation?: Orientation;
  size?: Size;
  color?: string;
  minDuration?: number;
  maxDuration?: number;
}

// === Preview Types ===
export type PreviewItem =
  | { type: 'photo'; data: Photo }
  | { type: 'video'; data: Video };

// === API Config ===
export interface ApiConfig {
  /** Pexels API key (for direct mode) */
  apiKey?: string;
  /** Proxy endpoint URL (recommended for production) */
  proxyUrl?: string;
  /** Results per page (default: 20) */
  perPage?: number;
}

// === Toast Types ===
export type ToastType = 'info' | 'warning' | 'error' | 'success';

export interface ToastOptions {
  /** Toast message */
  message: string;
  /** Toast type */
  type?: ToastType;
  /** Duration in milliseconds (default: 3000) */
  duration?: number;
}

// === Customization Types ===
export interface MediaPickerTexts {
  /** Modal title (default: "Select Media") */
  title?: string;
  /** Confirm button text (default: "Confirm") */
  confirm?: string;
  /** Cancel button text (default: "Cancel") */
  cancel?: string;
  /** Search placeholder (default: "Search...") */
  searchPlaceholder?: string;
  /** Photos tab label (default: "Photos") */
  photosTab?: string;
  /** Videos tab label (default: "Videos") */
  videosTab?: string;
  /** Empty state message (default: "No results found") */
  emptyMessage?: string;
  /** Error message (default: "Failed to load media") */
  errorMessage?: string;
  /** Loading text (default: "Loading...") */
  loadingText?: string;
  /** Max selection warning (default: "Maximum {max} items allowed") */
  maxSelectionWarning?: string;
  /** Selected count text (default: "{count} item(s) selected") */
  selectedCount?: string;
}

export interface MediaPickerStyles {
  /** Custom class for modal container */
  modal?: string;
  /** Custom class for header */
  header?: string;
  /** Custom class for content area */
  content?: string;
  /** Custom class for footer */
  footer?: string;
  /** Custom class for grid */
  grid?: string;
  /** Custom class for media cards */
  card?: string;
}

// === Selection Event Types ===
export interface SelectionChangeEvent {
  /** Currently selected items */
  selected: MediaItem[];
  /** Item that was just added (if any) */
  added?: MediaItem;
  /** Item that was just removed (if any) */
  removed?: MediaItem;
  /** Current selection count */
  count: number;
}

// === Component Props ===
export interface MediaPickerProps {
  // === Core Props ===
  /** Controls modal visibility */
  open: boolean;
  /** Callback when visibility changes */
  onOpenChange: (open: boolean) => void;

  // === Selection Props ===
  /** Enable multi-selection mode */
  multiple?: boolean;
  /** Maximum items selectable in multi-mode (default: 10) */
  maxSelection?: number;
  /** Minimum items required for confirmation (default: 0) */
  minSelection?: number;
  /** Pre-selected items (controlled mode) */
  value?: MediaItem[];
  /** Default selected items (uncontrolled mode) */
  defaultValue?: MediaItem[];

  // === Default State Props ===
  /** Initial media type tab (default: "photos") */
  defaultMediaType?: MediaType;
  /** Initial search query */
  defaultQuery?: string;
  /** Initial filter state */
  defaultFilters?: Partial<FilterState>;

  // === Feature Flags ===
  /** Show search bar (default: true) */
  showSearch?: boolean;
  /** Show media type tabs (default: true) */
  showTabs?: boolean;
  /** Show filter options (default: true) */
  showFilters?: boolean;
  /** Enable preview modal on hover/click (default: true) */
  enablePreview?: boolean;
  /** Allow closing modal by clicking backdrop (default: true) */
  closeOnBackdrop?: boolean;
  /** Allow closing modal with Escape key (default: true) */
  closeOnEscape?: boolean;

  // === Layout Props ===
  /** Grid columns configuration */
  gridColumns?: {
    /** Columns on small screens (default: 2) */
    sm?: number;
    /** Columns on medium screens (default: 3) */
    md?: number;
    /** Columns on large screens (default: 4) */
    lg?: number;
  };
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Items per page for API requests (default: 20) */
  perPage?: number;

  // === Callbacks ===
  /** Called when selection is confirmed */
  onSelect?: (media: MediaItem | MediaItem[]) => void;
  /** Called when modal is cancelled/closed without selection */
  onCancel?: () => void;
  /** Called when selection changes (real-time) */
  onSelectionChange?: (event: SelectionChangeEvent) => void;
  /** Called when max selection limit is reached */
  onMaxSelectionReached?: (maxSelection: number) => void;
  /** Called when media type tab changes */
  onMediaTypeChange?: (mediaType: MediaType) => void;
  /** Called when search query changes */
  onSearchChange?: (query: string) => void;
  /** Called when filters change */
  onFiltersChange?: (filters: FilterState) => void;
  /** Called when media is previewed */
  onPreview?: (media: MediaItem) => void;
  /** Called when an error occurs */
  onError?: (error: Error) => void;
  /** Custom toast handler (overrides default sonner toast) */
  onToast?: (options: ToastOptions) => void;

  // === Customization ===
  /** Custom text labels for i18n */
  texts?: MediaPickerTexts;
  /** Custom CSS classes */
  classNames?: MediaPickerStyles;
  /** Custom class name for modal (legacy, use classNames.modal instead) */
  className?: string;

  // === Render Props (Advanced) ===
  /** Custom render for media card */
  renderCard?: (media: MediaItem, props: {
    selected: boolean;
    onSelect: () => void;
    onPreview: () => void;
  }) => React.ReactNode;
  /** Custom render for empty state */
  renderEmpty?: () => React.ReactNode;
  /** Custom render for error state */
  renderError?: (error: Error, retry: () => void) => React.ReactNode;
  /** Custom render for loading state */
  renderLoading?: () => React.ReactNode;
  /** Custom header content */
  renderHeader?: (props: {
    title: string;
    onClose: () => void;
  }) => React.ReactNode;
  /** Custom footer content */
  renderFooter?: (props: {
    selectedCount: number;
    onCancel: () => void;
    onConfirm: () => void;
    canConfirm: boolean;
  }) => React.ReactNode;
}

/** @deprecated Use MediaPickerProps instead */
export type PexelsMediaPickerProps = MediaPickerProps;

export interface MediaPickerButtonProps
  extends Omit<MediaPickerProps, 'open' | 'onOpenChange'> {
  /** Button content */
  children?: React.ReactNode;
  /** Button class name */
  className?: string;
  /** Button disabled state */
  disabled?: boolean;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

/** @deprecated Use MediaPickerButtonProps instead */
export type PexelsPickerButtonProps = MediaPickerButtonProps;

// === Hook Types ===
export interface UseMediaPickerOptions {
  /** Enable multi-selection */
  multiple?: boolean;
  /** Max selection limit */
  maxSelection?: number;
  /** Default media type */
  defaultMediaType?: MediaType;
  /** API configuration */
  apiConfig?: ApiConfig;
}

export interface UseMediaPickerReturn {
  /** Current selected items */
  selectedMedia: MediaItem[];
  /** Current media type */
  mediaType: MediaType;
  /** Current search query */
  query: string;
  /** Current filters */
  filters: FilterState;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Set media type */
  setMediaType: (type: MediaType) => void;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Set filter */
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  /** Toggle item selection */
  toggleSelect: (media: MediaItem) => void;
  /** Clear all selections */
  clearSelection: () => void;
  /** Reset all state */
  reset: () => void;
}
