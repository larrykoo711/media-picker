# Media Picker - Technical Specification

> A headless, composable React component library for media selection with Pexels integration.

**Version**: 1.0.0
**Status**: Draft
**Author**: Larry Koo
**Date**: 2025-11-30

---

## 1. Overview

### 1.1 Purpose

`@koo-labs/media-picker` is a production-ready React component library that provides a beautiful, accessible media picker UI with built-in Pexels API integration. It enables developers to quickly add stock photo and video selection capabilities to their applications.

### 1.2 Design Philosophy

Following Facebook/Meta's React design principles:

1. **Composition over Configuration** - Small, focused components that compose together
2. **Controlled & Uncontrolled Patterns** - Support both for maximum flexibility
3. **Headless Architecture** - Logic separated from presentation
4. **Progressive Enhancement** - Works out of the box, customizable when needed
5. **Zero Runtime CSS-in-JS** - Tailwind CSS for optimal performance
6. **Type Safety First** - Full TypeScript with strict mode

### 1.3 Key Features

- Single and multi-selection modes
- Photo and video support
- Infinite scroll with virtualization
- Full-screen Lightbox preview
- Search with debounce and IME support
- Responsive grid layout
- Accessible (WCAG 2.1 AA)
- SSR compatible
- Tree-shakeable

---

## 2. Architecture

### 2.1 Package Structure

```
@koo-labs/media-picker/
├── src/
│   ├── components/           # React components
│   │   ├── MediaPicker.tsx   # Main orchestrator
│   │   ├── MediaGrid.tsx     # Grid container
│   │   ├── MediaCard.tsx     # Unified card component
│   │   ├── SearchBar.tsx     # Search input
│   │   ├── MediaTabs.tsx     # Photo/Video switcher
│   │   ├── PreviewModal.tsx  # Lightbox wrapper
│   │   ├── EmptyState.tsx    # No results state
│   │   ├── ErrorState.tsx    # Error display
│   │   └── SkeletonGrid.tsx  # Loading skeleton
│   ├── hooks/                # Custom React hooks
│   │   ├── useMediaPicker.ts # Main state hook
│   │   ├── useInfiniteScroll.ts
│   │   ├── usePexelsPhotos.ts
│   │   ├── usePexelsVideos.ts
│   │   └── useDebounce.ts
│   ├── providers/            # Context providers
│   │   ├── MediaPickerProvider.tsx
│   │   └── QueryClientProvider.tsx
│   ├── api/                  # API layer
│   │   ├── pexels-client.ts  # Pexels API client
│   │   └── types.ts          # API response types
│   ├── store/                # State management
│   │   └── picker-store.ts   # Zustand store
│   ├── types/                # Public type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   ├── cn.ts             # classnames helper
│   │   ├── formatters.ts     # Display formatters
│   │   └── media-transforms.ts
│   ├── styles/               # CSS
│   │   └── media-picker.css  # Tailwind styles
│   └── index.ts              # Public API exports
├── tests/                    # Test suites
├── stories/                  # Storybook stories
├── examples/                 # Usage examples
│   ├── nextjs/
│   └── vite/
└── docs/                     # Documentation
```

### 2.2 Component Hierarchy

```
MediaPickerProvider (Context + QueryClient)
└── MediaPicker (Modal orchestrator)
    ├── MediaTabs (Photo/Video switch)
    ├── SearchBar (Query input)
    ├── MediaGrid (Virtualized grid)
    │   ├── MediaCard[] (Photo or Video card)
    │   └── LoadMoreSentinel (Infinite scroll trigger)
    ├── EmptyState | ErrorState | SkeletonGrid
    └── PreviewModal (Lightbox)
```

### 2.3 State Management

**Zustand Store** with atomic selectors for optimal re-render performance:

```typescript
interface PickerState {
  // UI State
  mediaType: 'photos' | 'videos';
  query: string;
  filters: FilterState;

  // Selection State
  selectedMedia: MediaItem[];

  // Preview State
  previewIndex: number | null;
}
```

**React Query** for server state:
- 5-minute stale time
- Automatic retry on failure
- Infinite query for pagination

---

## 3. Public API

### 3.1 Components

#### `<MediaPicker />`

Main component - renders as a modal dialog.

```typescript
interface MediaPickerProps {
  /** Controls modal visibility */
  open: boolean;
  /** Callback when visibility changes */
  onOpenChange: (open: boolean) => void;
  /** Enable multi-selection mode */
  multiple?: boolean;
  /** Maximum items selectable (multi-mode) */
  maxSelection?: number;
  /** Initial media type tab */
  defaultMediaType?: 'photos' | 'videos';
  /** Initial search query */
  defaultQuery?: string;
  /** Callback when selection confirmed */
  onSelect?: (media: MediaItem | MediaItem[]) => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Custom class name for modal */
  className?: string;
  /** API configuration */
  apiConfig?: ApiConfig;
}
```

#### `<MediaPickerButton />`

Convenience component with built-in trigger button.

```typescript
interface MediaPickerButtonProps
  extends Omit<MediaPickerProps, 'open' | 'onOpenChange'> {
  /** Button content */
  children?: React.ReactNode;
  /** Button class name */
  className?: string;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

#### `<MediaPickerProvider />`

Context provider for advanced usage patterns.

```typescript
interface MediaPickerProviderProps {
  children: React.ReactNode;
  /** Custom QueryClient instance */
  queryClient?: QueryClient;
  /** Pexels API configuration */
  apiConfig: ApiConfig;
}
```

### 3.2 Hooks

#### `useMediaPicker()`

Access picker state and actions from child components.

```typescript
function useMediaPicker(): {
  // State
  mediaType: MediaType;
  query: string;
  selectedMedia: MediaItem[];
  selectedCount: number;

  // Actions
  setMediaType: (type: MediaType) => void;
  setQuery: (query: string) => void;
  toggleSelect: (item: MediaItem) => void;
  clearSelection: () => void;
  confirmSelection: () => void;
};
```

#### `usePexelsPhotos(options)`

Fetch photos with infinite pagination.

```typescript
function usePexelsPhotos(options: {
  query?: string;
  filters?: FilterState;
  enabled?: boolean;
}): UseInfiniteQueryResult<Photo[]>;
```

#### `usePexelsVideos(options)`

Fetch videos with infinite pagination.

```typescript
function usePexelsVideos(options: {
  query?: string;
  filters?: FilterState;
  enabled?: boolean;
}): UseInfiniteQueryResult<Video[]>;
```

### 3.3 Types

```typescript
// Core media item (normalized from API)
interface MediaItem {
  id: number;
  type: 'photo' | 'video';
  width: number;
  height: number;
  url: string;          // Pexels page URL
  author: string;
  authorUrl: string;
  thumbnail: string;    // Display thumbnail
  avgColor?: string;    // Photo only
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
  };
  duration?: number;    // Video only (seconds)
  videoFiles?: VideoFile[];
}

// Filter options
interface FilterState {
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  minDuration?: number; // Video only
  maxDuration?: number; // Video only
}

// API configuration
interface ApiConfig {
  /** Pexels API key (for direct mode) */
  apiKey?: string;
  /** Proxy endpoint URL (recommended) */
  proxyUrl?: string;
  /** Results per page */
  perPage?: number;
}
```

---

## 4. API Integration

### 4.1 Two Integration Modes

#### Direct Mode (Development/Prototyping)
```typescript
<MediaPickerProvider
  apiConfig={{ apiKey: 'your-pexels-api-key' }}
>
```

#### Proxy Mode (Production - Recommended)
```typescript
<MediaPickerProvider
  apiConfig={{ proxyUrl: '/api/pexels' }}
>
```

### 4.2 Proxy Endpoint Specification

The proxy endpoint must handle these routes:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/search` | Search photos |
| GET | `/v1/curated` | Curated photos |
| GET | `/videos/search` | Search videos |
| GET | `/videos/popular` | Popular videos |

Query parameters are passed through unchanged.

### 4.3 Response Normalization

Internal `mediaTransforms` convert Pexels API responses to unified `MediaItem` format:

```typescript
// Photo → MediaItem
function photoToMediaItem(photo: PexelsPhoto): MediaItem;

// Video → MediaItem
function videoToMediaItem(video: PexelsVideo): MediaItem;
```

---

## 5. Styling

### 5.1 CSS Architecture

- **Base**: Tailwind CSS v4
- **Component Library**: DaisyUI v5 (optional, for pre-styled version)
- **Approach**: CSS custom properties for theming

### 5.2 Theme Variables

```css
:root {
  /* Colors */
  --mp-bg-primary: theme('colors.base-100');
  --mp-bg-secondary: theme('colors.base-200');
  --mp-text-primary: theme('colors.base-content');
  --mp-accent: theme('colors.primary');

  /* Spacing */
  --mp-grid-gap: 0.75rem;
  --mp-card-radius: 0.5rem;

  /* Animation */
  --mp-transition-fast: 150ms ease;
  --mp-transition-normal: 300ms ease;
}
```

### 5.3 Responsive Breakpoints

| Breakpoint | Grid Columns |
|------------|--------------|
| < 640px    | 2            |
| 640-768px  | 3            |
| 768-1024px | 4            |
| ≥ 1024px   | 5            |

### 5.4 CSS Layers

```css
@layer media-picker {
  /* Base component styles */
}

@layer media-picker.utilities {
  /* Utility classes */
}
```

---

## 6. Accessibility

### 6.1 WCAG 2.1 AA Compliance

- **Focus Management**: Trap focus within modal, restore on close
- **Keyboard Navigation**:
  - `Tab` / `Shift+Tab` - Navigate items
  - `Enter` / `Space` - Select item
  - `Escape` - Close modal/preview
  - `Arrow keys` - Navigate grid
- **Screen Readers**:
  - Proper `aria-label` on all interactive elements
  - Live regions for selection count updates
  - Descriptive alt text for media items

### 6.2 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  .media-picker * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Performance

### 7.1 Bundle Size Target

| Entry Point | Target Size (gzip) |
|-------------|-------------------|
| Full bundle | < 25KB |
| Core only   | < 15KB |
| Types only  | 0KB (dev only) |

### 7.2 Optimization Strategies

1. **Tree Shaking**: Named exports only, no side effects
2. **Code Splitting**: Lightbox lazy-loaded
3. **Image Optimization**: Native lazy loading, blur placeholders
4. **Render Optimization**:
   - Zustand atomic selectors
   - `useMemo` for derived state
   - `useCallback` for stable references
5. **Network**:
   - React Query deduplication
   - 5-minute cache
   - Optimistic updates

### 7.3 Core Web Vitals

| Metric | Target |
|--------|--------|
| LCP    | < 2.5s |
| FID    | < 100ms |
| CLS    | < 0.1 |

---

## 8. Testing Strategy

### 8.1 Unit Tests (Vitest)

- Individual component rendering
- Hook behavior
- Utility functions
- State management

### 8.2 Integration Tests (Testing Library)

- User interaction flows
- Selection/deselection
- Search functionality
- Infinite scroll

### 8.3 E2E Tests (Playwright)

- Full modal workflow
- Keyboard navigation
- Cross-browser compatibility

### 8.4 Coverage Target

| Type | Target |
|------|--------|
| Statements | ≥ 80% |
| Branches | ≥ 75% |
| Functions | ≥ 80% |
| Lines | ≥ 80% |

---

## 9. Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | 15.4+ |
| Edge | Last 2 versions |

---

## 10. Dependencies

### 10.1 Peer Dependencies

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

### 10.2 Runtime Dependencies

```json
{
  "@tanstack/react-query": "^5.0.0",
  "zustand": "^5.0.0",
  "yet-another-react-lightbox": "^3.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^3.0.0"
}
```

### 10.3 Optional Dependencies

```json
{
  "lucide-react": "^0.400.0",  // Icons (can use custom)
  "daisyui": "^5.0.0"          // Pre-styled theme
}
```

---

## 11. Release Plan

### 11.1 Versioning

Follows [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes

### 11.2 Release Channels

| Channel | Purpose | Stability |
|---------|---------|-----------|
| `latest` | Production release | Stable |
| `next` | Preview features | Beta |
| `canary` | Nightly builds | Unstable |

### 11.3 Changelog

Follows [Keep a Changelog](https://keepachangelog.com/) format.

---

## 12. Implementation Milestones

### Phase 1: Core Foundation
- [ ] Project setup (tsconfig, build, test)
- [ ] Core types and interfaces
- [ ] Zustand store
- [ ] Pexels API client
- [ ] React Query integration

### Phase 2: Components
- [ ] MediaPicker (modal)
- [ ] MediaGrid (virtualized)
- [ ] MediaCard (photo/video)
- [ ] SearchBar (with IME)
- [ ] MediaTabs
- [ ] States (Empty, Error, Loading)

### Phase 3: Features
- [ ] Preview modal (Lightbox)
- [ ] Multi-selection
- [ ] Filters
- [ ] Keyboard navigation

### Phase 4: Polish
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Examples
- [ ] Storybook stories

### Phase 5: Release
- [ ] CI/CD setup
- [ ] npm publish
- [ ] GitHub release
- [ ] Documentation site

---

## Appendix A: API Reference Links

- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [React Query v5 Docs](https://tanstack.com/query/v5)
- [Zustand v5 Docs](https://zustand.docs.pmnd.rs/)
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/)

---

## Appendix B: Design Decisions

### Why Zustand over Context?

- Atomic selectors prevent unnecessary re-renders
- No provider nesting needed for store access
- DevTools support
- Simpler API than Redux

### Why React Query over SWR?

- Better infinite query support
- Built-in devtools
- More mature TypeScript types
- Broader community adoption

### Why Tailwind over CSS-in-JS?

- Zero runtime overhead
- Better tree-shaking
- Consistent with modern React ecosystem
- DaisyUI compatibility for pre-styled version

---

*This specification is a living document and will be updated as the project evolves.*
