import { useRef, useEffect, useCallback, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { mediaPickerQueryClient } from '../api/query-client';
import { PickerProvider, usePickerStore, pickerSelectors } from '../store';
import { MediaTabs } from './MediaTabs';
import { SearchBar } from './SearchBar';
import { MediaGrid } from './MediaGrid';
import { Toast } from './Toast';
import type {
  MediaPickerProps,
  MediaPickerTexts,
  SelectionChangeEvent,
} from '../types';

// Default text values for i18n
const DEFAULT_TEXTS: Required<MediaPickerTexts> = {
  title: 'Select Media',
  confirm: 'Confirm',
  cancel: 'Cancel',
  searchPlaceholder: 'Search...',
  photosTab: 'Photos',
  videosTab: 'Videos',
  emptyMessage: 'No results found',
  errorMessage: 'Failed to load media',
  loadingText: 'Loading...',
  maxSelectionWarning: 'Maximum {max} items allowed',
  selectedCount: '{count} item(s) selected',
};

// Format text with placeholders
function formatText(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(`{${key}}`, String(value)),
    template
  );
}

// Modal size classes
const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  full: 'max-w-full mx-4',
} as const;

function MediaPickerInner({
  open,
  onOpenChange,
  // Selection props
  multiple = false,
  maxSelection = 10,
  minSelection = 0,
  value: _value,
  defaultValue: _defaultValue,
  // Default state props
  defaultMediaType = 'photos',
  defaultQuery,
  defaultFilters: _defaultFilters,
  // Feature flags
  showSearch = true,
  showTabs = true,
  enablePreview = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  // Layout props
  size = 'xl',
  // Callbacks
  onSelect,
  onCancel,
  onSelectionChange,
  onMaxSelectionReached,
  onMediaTypeChange,
  onSearchChange,
  onPreview,
  onError,
  onToast,
  // Customization
  texts: customTexts,
  classNames,
  className,
  // Render props
  renderHeader,
  renderFooter,
}: MediaPickerProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const prevSelectedRef = useRef<typeof selectedMedia>([]);

  // Merge custom texts with defaults
  const texts = useMemo(
    () => ({ ...DEFAULT_TEXTS, ...customTexts }),
    [customTexts]
  );

  // Use selectors to optimize re-renders
  const selectedMedia = usePickerStore(pickerSelectors.selectedMedia);
  const mediaType = usePickerStore(pickerSelectors.mediaType);
  const query = usePickerStore(pickerSelectors.query);
  const reset = usePickerStore(pickerSelectors.reset);
  const setMediaType = usePickerStore(pickerSelectors.setMediaType);
  const setQuery = usePickerStore(pickerSelectors.setQuery);
  const showToastAction = usePickerStore(pickerSelectors.showToast);

  // Handle max selection reached
  const handleMaxSelectionReached = useCallback(() => {
    const message = formatText(texts.maxSelectionWarning, { max: maxSelection });

    // Use custom toast handler if provided
    if (onToast) {
      onToast({ message, type: 'warning' });
    } else {
      showToastAction(message, 'warning');
    }

    // Call user callback
    onMaxSelectionReached?.(maxSelection);
  }, [maxSelection, texts.maxSelectionWarning, onToast, showToastAction, onMaxSelectionReached]);

  // Track selection changes for onSelectionChange callback
  useEffect(() => {
    if (!onSelectionChange) return;

    const prev = prevSelectedRef.current;
    const curr = selectedMedia;

    // Find added/removed items
    const added = curr.find((item) => !prev.some((p) => p.id === item.id));
    const removed = prev.find((item) => !curr.some((c) => c.id === item.id));

    if (added || removed) {
      const event: SelectionChangeEvent = {
        selected: curr,
        added,
        removed,
        count: curr.length,
      };
      onSelectionChange(event);
    }

    prevSelectedRef.current = curr;
  }, [selectedMedia, onSelectionChange]);

  // Track media type changes
  useEffect(() => {
    onMediaTypeChange?.(mediaType);
  }, [mediaType, onMediaTypeChange]);

  // Track search query changes
  useEffect(() => {
    onSearchChange?.(query);
  }, [query, onSearchChange]);

  // Initialize state when dialog opens
  useEffect(() => {
    if (open) {
      setMediaType(defaultMediaType);
      if (defaultQuery) {
        setQuery(defaultQuery);
      }
      // Filters are managed by the store and can be customized via props if needed
    }
  }, [open, defaultMediaType, defaultQuery, setMediaType, setQuery]);

  // Sync open state with dialog
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  // Handle ESC key
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !closeOnEscape) {
        e.preventDefault();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEscape]);

  // Listen to dialog close event
  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onOpenChange(false);
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onOpenChange]);

  const canConfirm = selectedMedia.length >= minSelection && selectedMedia.length > 0;

  const handleConfirm = () => {
    if (onSelect && canConfirm) {
      const result = multiple ? selectedMedia : selectedMedia[0];
      if (result) {
        onSelect(result);
      }
    }
    modalRef.current?.close();
    reset();
  };

  const handleCancel = () => {
    onCancel?.();
    modalRef.current?.close();
    reset();
  };

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      handleCancel();
    }
  };

  // Format selected count text
  const selectedCountText = formatText(texts.selectedCount, {
    count: selectedMedia.length,
  }).replace('(s)', selectedMedia.length > 1 ? 's' : '');

  // Modal size class
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.xl;

  return (
    <dialog ref={modalRef} className={`modal ${classNames?.modal ?? ''}`}>
      {/* Modal Box */}
      <div
        className={`modal-box flex h-[85vh] w-11/12 ${sizeClass} flex-col p-0 ${className ?? ''}`}
      >
        {/* Header */}
        {renderHeader ? (
          renderHeader({ title: texts.title, onClose: handleCancel })
        ) : (
          <div
            className={`flex items-center justify-between border-b border-base-300 px-6 py-4 ${classNames?.header ?? ''}`}
          >
            <h3 className="text-lg font-bold">{texts.title}</h3>
            <button
              className="btn btn-circle btn-ghost btn-sm"
              onClick={handleCancel}
              aria-label={texts.cancel}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tabs & Search - merged */}
        {(showTabs || showSearch) && (
          <div className="border-b border-base-300 px-6 py-4">
            <div className="flex items-center overflow-hidden rounded-lg border border-base-300">
              {showTabs && <MediaTabs defaultValue={defaultMediaType} texts={texts} />}
              {showSearch && (
                <div
                  className={`flex-1 ${showTabs ? 'border-l border-base-300' : ''}`}
                >
                  <SearchBar placeholder={texts.searchPlaceholder} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media Grid - scroll area */}
        <div
          className={`relative flex-1 overflow-y-auto ${classNames?.content ?? ''}`}
        >
          <MediaGrid
            multiple={multiple}
            maxSelection={maxSelection}
            enablePreview={enablePreview}
            onMaxSelectionReached={handleMaxSelectionReached}
            onPreview={onPreview}
            onError={onError}
            classNames={{
              grid: classNames?.grid,
              card: classNames?.card,
            }}
          />
          {/* Only render built-in toast if no custom handler */}
          {!onToast && <Toast />}
        </div>

        {/* Footer */}
        {renderFooter ? (
          renderFooter({
            selectedCount: selectedMedia.length,
            onCancel: handleCancel,
            onConfirm: handleConfirm,
            canConfirm,
          })
        ) : (
          <div
            className={`flex items-center justify-between border-t border-base-300 px-6 py-4 ${classNames?.footer ?? ''}`}
          >
            <div className="text-sm text-base-content/60">
              {selectedMedia.length > 0 && <span>{selectedCountText}</span>}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-ghost" onClick={handleCancel}>
                {texts.cancel}
              </button>
              <button
                className="btn btn-neutral"
                disabled={!canConfirm}
                onClick={handleConfirm}
              >
                {texts.confirm}
                {selectedMedia.length > 0 && (
                  <span className="badge badge-neutral-content ml-1 bg-neutral-content text-neutral">
                    {selectedMedia.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop - click to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleBackdropClick}>close</button>
      </form>
    </dialog>
  );
}

export function MediaPicker(props: MediaPickerProps) {
  return (
    <QueryClientProvider client={mediaPickerQueryClient}>
      <PickerProvider>
        <MediaPickerInner {...props} />
      </PickerProvider>
    </QueryClientProvider>
  );
}
