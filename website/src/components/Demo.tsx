'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { MediaPickerButton, MediaPicker, type MediaItem, configurePexelsClient } from '@larrykoo711/media-picker';
import { ShikiCode } from './ShikiCode';

// Configure API proxy
if (typeof window !== 'undefined') {
  configurePexelsClient({
    proxyUrl: '/api/pexels',
  });
}

interface DemoProps {
  children: ReactNode;
}

export function Demo({ children }: DemoProps) {
  return (
    <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center min-h-[200px]">
        {children}
      </div>
    </div>
  );
}

// JSON display component using Shiki for syntax highlighting
function JsonDisplay({ data, title = 'response.json' }: { data: unknown; title?: string }) {
  if (!data) return null;

  const jsonString = JSON.stringify(data, null, 2);

  return <ShikiCode code={jsonString} lang="json" filename={title} theme="dracula" />;
}

// Type guard for photo media
function isPhotoMedia(media: MediaItem): media is MediaItem & { src: { medium?: string; small?: string } } {
  return media.type === 'photo' && 'src' in media;
}

// Type guard for video media
function isVideoMedia(media: MediaItem): media is MediaItem & { image?: string; video_pictures?: Array<{ picture: string }> } {
  return media.type === 'video';
}

// Get thumbnail URL from media item
function getThumbnailUrl(media: MediaItem): string | undefined {
  if (isVideoMedia(media)) {
    return media.image || media.video_pictures?.[0]?.picture;
  }
  if (isPhotoMedia(media)) {
    return media.src?.medium || media.src?.small;
  }
  return undefined;
}

// Thumbnail preview component for selected media
function MediaThumbnail({ media }: { media: MediaItem | null }) {
  if (!media) return null;

  const isVideo = media.type === 'video';
  const thumbnailUrl = getThumbnailUrl(media);

  return (
    <div className="relative group">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 ring-2 ring-black/10 dark:ring-white/10">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={(media as { alt?: string }).alt || 'Selected media'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            {isVideo ? (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            )}
          </div>
        )}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// Multiple thumbnails preview
function MediaThumbnails({ mediaList }: { mediaList: MediaItem[] }) {
  if (mediaList.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {mediaList.map((media, index) => (
        <MediaThumbnail key={media.id || index} media={media} />
      ))}
    </div>
  );
}

export function BasicDemo() {
  const [media, setMedia] = useState<MediaItem | null>(null);

  return (
    <Demo>
      <div className="flex flex-col items-center gap-4 w-full">
        <MediaPickerButton
          onSelect={(m) => setMedia(Array.isArray(m) ? m[0] : m)}
          className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Select Media
        </MediaPickerButton>
        <MediaThumbnail media={media} />
        <JsonDisplay data={media} title="Selected Media" />
      </div>
    </Demo>
  );
}

export function MultipleDemo() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  return (
    <Demo>
      <div className="flex flex-col items-center gap-4 w-full">
        <MediaPickerButton
          multiple
          maxSelection={5}
          onSelect={(m) => setMediaList(Array.isArray(m) ? m : [m])}
          className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Select Multiple (max 5)
        </MediaPickerButton>
        <MediaThumbnails mediaList={mediaList} />
        {mediaList.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Selected: {mediaList.length} item{mediaList.length > 1 ? 's' : ''}
          </div>
        )}
        <JsonDisplay data={mediaList.length > 0 ? mediaList : null} title="Selected Media Array" />
      </div>
    </Demo>
  );
}

export function CallbacksDemo() {
  const [events, setEvents] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | MediaItem[] | null>(null);

  const logEvent = useCallback((name: string, data?: unknown) => {
    const msg = data ? `${name}: ${JSON.stringify(data)}` : name;
    setEvents((prev) => [msg, ...prev].slice(0, 10));
  }, []);

  return (
    <Demo>
      <div className="flex flex-col items-center gap-4 w-full">
        <MediaPickerButton
          multiple
          maxSelection={3}
          onSelect={(m) => {
            setSelectedMedia(m);
            logEvent('onSelect', { count: Array.isArray(m) ? m.length : 1 });
          }}
          onCancel={() => logEvent('onCancel')}
          onSelectionChange={(e) => logEvent('onSelectionChange', e)}
          onMaxSelectionReached={(max) => logEvent('onMaxSelectionReached', { max })}
          onMediaTypeChange={(type) => logEvent('onMediaTypeChange', { type })}
          onSearchChange={(query) => logEvent('onSearchChange', { query })}
          className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Open Picker
        </MediaPickerButton>

        {selectedMedia && (
          Array.isArray(selectedMedia)
            ? <MediaThumbnails mediaList={selectedMedia} />
            : <MediaThumbnail media={selectedMedia} />
        )}

        <div className="w-full">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">Event Log</div>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 h-32 overflow-auto">
            <div className="text-xs font-mono space-y-1">
              {events.length === 0 ? (
                <div className="text-gray-400">Events will appear here...</div>
              ) : (
                events.map((e, i) => (
                  <div key={i} className="text-gray-600 dark:text-gray-300">{e}</div>
                ))
              )}
            </div>
          </div>
        </div>

        <JsonDisplay data={selectedMedia} title="Selected Media" />
      </div>
    </Demo>
  );
}

export function I18nDemo() {
  const [lang, setLang] = useState<'en' | 'zh' | 'ja'>('zh');
  const [media, setMedia] = useState<MediaItem | null>(null);

  const texts = {
    en: {
      title: 'Select Media',
      searchPlaceholder: 'Search photos or videos...',
      photosTab: 'Photos',
      videosTab: 'Videos',
      cancel: 'Cancel',
      confirm: 'Confirm',
    },
    zh: {
      title: '选择素材',
      searchPlaceholder: '搜索图片或视频...',
      photosTab: '图片',
      videosTab: '视频',
      cancel: '取消',
      confirm: '确认',
    },
    ja: {
      title: 'メディアを選択',
      searchPlaceholder: '画像や動画を検索...',
      photosTab: '写真',
      videosTab: '動画',
      cancel: 'キャンセル',
      confirm: '確認',
    },
  };

  return (
    <Demo>
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {(['en', 'zh', 'ja'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`cursor-pointer px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                lang === l
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
              }`}
            >
              {l === 'en' ? 'English' : l === 'zh' ? '中文' : '日本語'}
            </button>
          ))}
        </div>
        <MediaPickerButton
          texts={texts[lang]}
          onSelect={(m) => setMedia(Array.isArray(m) ? m[0] : m)}
          className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          {texts[lang].title}
        </MediaPickerButton>
        <MediaThumbnail media={media} />
        <JsonDisplay data={media} title="Selected Media" />
      </div>
    </Demo>
  );
}

export function ControlledDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem | null>(null);

  return (
    <Demo>
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Open Picker
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>State:</span>
            <span className={`px-2 py-0.5 rounded ${isOpen ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800'}`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>

        <MediaPicker
          open={isOpen}
          onOpenChange={setIsOpen}
          onSelect={(m) => {
            setMedia(Array.isArray(m) ? m[0] : m);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />

        <MediaThumbnail media={media} />
        <JsonDisplay data={media} title="Selected Media" />
      </div>
    </Demo>
  );
}
