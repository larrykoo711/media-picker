import { createContext, useContext, useRef, type ReactNode } from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';
import type {
  MediaType,
  FilterState,
  MediaItem,
  Photo,
  Video,
} from '../types';

// ============ Store Types ============

interface ToastState {
  message: string;
  type: 'info' | 'warning' | 'error';
  visible: boolean;
}

interface PickerState {
  mediaType: MediaType;
  query: string;
  filters: FilterState;
  selectedMedia: MediaItem[];
  previewIndex: number | null;
  toast: ToastState | null;
}

interface PickerActions {
  setMediaType: (type: MediaType) => void;
  setQuery: (query: string) => void;
  setFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;
  resetFilters: () => void;
  toggleSelect: (
    media: MediaItem,
    multiple: boolean,
    maxSelection: number
  ) => void;
  clearSelection: () => void;
  setPreviewIndex: (index: number | null) => void;
  showToast: (message: string, type?: 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
  reset: () => void;
}

export type PickerStore = PickerState & PickerActions;

// ============ Initial State ============

const initialFilters: FilterState = {
  orientation: undefined,
  size: undefined,
  color: undefined,
  minDuration: undefined,
  maxDuration: undefined,
};

const initialState: PickerState = {
  mediaType: 'photos',
  query: '',
  filters: initialFilters,
  selectedMedia: [],
  previewIndex: null,
  toast: null,
};

// ============ Store Factory ============

function createPickerStore() {
  return createStore<PickerStore>((set) => ({
    ...initialState,

    setMediaType: (type) =>
      set(() => ({
        mediaType: type,
        filters: initialFilters,
        selectedMedia: [],
      })),

    setQuery: (query) => set(() => ({ query })),

    setFilter: (key, value) =>
      set((state) => ({
        filters: { ...state.filters, [key]: value },
      })),

    resetFilters: () => set(() => ({ filters: initialFilters })),

    toggleSelect: (media, multiple, maxSelection) =>
      set((state) => {
        const index = state.selectedMedia.findIndex((m) => m.id === media.id);

        if (index > -1) {
          return {
            selectedMedia: state.selectedMedia.filter(
              (m) => m.id !== media.id
            ),
          };
        }

        if (multiple) {
          if (state.selectedMedia.length < maxSelection) {
            return { selectedMedia: [...state.selectedMedia, media] };
          }
          return state;
        }

        return { selectedMedia: [media] };
      }),

    clearSelection: () => set(() => ({ selectedMedia: [] })),

    setPreviewIndex: (index) => set(() => ({ previewIndex: index })),

    showToast: (message, type = 'warning') =>
      set(() => ({
        toast: { message, type, visible: true },
      })),

    hideToast: () => set(() => ({ toast: null })),

    reset: () => set(() => initialState),
  }));
}

// ============ Context ============

type PickerStoreApi = StoreApi<PickerStore>;

const PickerContext = createContext<PickerStoreApi | null>(null);

// ============ Provider ============

interface PickerProviderProps {
  children: ReactNode;
}

export function PickerProvider({ children }: PickerProviderProps) {
  const storeRef = useRef<PickerStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createPickerStore();
  }

  return (
    <PickerContext.Provider value={storeRef.current}>
      {children}
    </PickerContext.Provider>
  );
}

// ============ Hook ============

export function usePickerStore<T>(selector: (state: PickerStore) => T): T {
  const store = useContext(PickerContext);

  if (!store) {
    throw new Error('usePickerStore must be used within a PickerProvider');
  }

  return useStore(store, selector);
}

// ============ Selectors (Optimize re-renders) ============

export const pickerSelectors = {
  mediaType: (state: PickerStore) => state.mediaType,
  query: (state: PickerStore) => state.query,
  filters: (state: PickerStore) => state.filters,
  selectedMedia: (state: PickerStore) => state.selectedMedia,
  selectedCount: (state: PickerStore) => state.selectedMedia.length,
  previewIndex: (state: PickerStore) => state.previewIndex,
  toast: (state: PickerStore) => state.toast,

  // Actions
  setMediaType: (state: PickerStore) => state.setMediaType,
  setQuery: (state: PickerStore) => state.setQuery,
  setFilter: (state: PickerStore) => state.setFilter,
  resetFilters: (state: PickerStore) => state.resetFilters,
  toggleSelect: (state: PickerStore) => state.toggleSelect,
  clearSelection: (state: PickerStore) => state.clearSelection,
  setPreviewIndex: (state: PickerStore) => state.setPreviewIndex,
  showToast: (state: PickerStore) => state.showToast,
  hideToast: (state: PickerStore) => state.hideToast,
  reset: (state: PickerStore) => state.reset,
};

// ============ Helper: Transform Functions ============

export function photoToMedia(photo: Photo): MediaItem {
  return {
    id: photo.id,
    type: 'photo',
    width: photo.width,
    height: photo.height,
    url: photo.url,
    author: photo.photographer,
    authorUrl: photo.photographer_url,
    thumbnail: photo.src.medium,
    avgColor: photo.avg_color,
    src: {
      original: photo.src.original,
      large: photo.src.large,
      medium: photo.src.medium,
      small: photo.src.small,
    },
  };
}

export function videoToMedia(video: Video): MediaItem {
  const hdFile = video.video_files.find((f) => f.quality === 'hd');
  const sdFile = video.video_files.find((f) => f.quality === 'sd');
  const anyFile = video.video_files[0];

  return {
    id: video.id,
    type: 'video',
    width: video.width,
    height: video.height,
    url: video.url,
    author: video.user.name,
    authorUrl: video.user.url,
    thumbnail: video.image,
    src: {
      original: hdFile?.link ?? anyFile?.link ?? '',
      large: hdFile?.link ?? anyFile?.link ?? '',
      medium: sdFile?.link ?? anyFile?.link ?? '',
      small: sdFile?.link ?? anyFile?.link ?? '',
    },
    duration: video.duration,
    videoFiles: video.video_files,
  };
}
