import { useRef, type KeyboardEvent } from 'react';
import { usePickerStore, pickerSelectors } from '../store/picker-store';
import type { MediaType, MediaPickerTexts } from '../types';

interface MediaTabsProps {
  defaultValue?: MediaType;
  texts?: Pick<MediaPickerTexts, 'photosTab' | 'videosTab'>;
}

export function MediaTabs({ defaultValue: _defaultValue, texts }: MediaTabsProps) {
  const TABS: { type: MediaType; label: string }[] = [
    { type: 'photos', label: texts?.photosTab ?? 'Photos' },
    { type: 'videos', label: texts?.videosTab ?? 'Videos' },
  ];
  const mediaType = usePickerStore(pickerSelectors.mediaType);
  const setMediaType = usePickerStore(pickerSelectors.setMediaType);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Keyboard navigation support
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.type === mediaType);

    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = TABS.length - 1;
        break;
    }

    if (nextIndex !== null) {
      const nextTab = TABS[nextIndex];
      if (nextTab) {
        setMediaType(nextTab.type);
        tabsRef.current[nextIndex]?.focus();
      }
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Media type"
      className="flex gap-1 bg-base-100 p-1"
      onKeyDown={handleKeyDown}
    >
      {TABS.map((tab, index) => {
        const isSelected = mediaType === tab.type;
        return (
          <button
            key={tab.type}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`tabpanel-${tab.type}`}
            tabIndex={isSelected ? 0 : -1}
            className={`cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-1 ${
              isSelected
                ? 'bg-neutral text-neutral-content'
                : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
            }`}
            onClick={() => setMediaType(tab.type)}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
