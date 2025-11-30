# Media Picker - Implementation Plan

> Spec-driven development roadmap for @koo-labs/media-picker

---

## Stage 1: Project Foundation

**Goal**: Establish project structure, build system, and development environment

**Success Criteria**:
- Project builds successfully with `pnpm build`
- TypeScript strict mode enabled
- ESLint and Prettier configured
- Vitest test runner working
- Package exports correctly configured

**Tasks**:
- [x] Create directory structure
- [ ] Initialize package.json with pnpm
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Setup Vite for library build
- [ ] Configure ESLint + Prettier
- [ ] Setup Vitest
- [ ] Configure package exports
- [ ] Add .gitignore and editor configs

**Status**: In Progress

---

## Stage 2: Core Types & API Layer

**Goal**: Define public types and implement Pexels API client

**Success Criteria**:
- All public types exported from `types/index.ts`
- PexelsClient class with full type coverage
- Unit tests for API client (mocked)

**Tasks**:
- [ ] Define MediaItem, FilterState, ApiConfig types
- [ ] Define Pexels API response types
- [ ] Implement PexelsClient class
- [ ] Add media transform utilities
- [ ] Write unit tests for transforms
- [ ] Write unit tests for client

**Status**: Not Started

---

## Stage 3: State Management

**Goal**: Implement Zustand store with React Query integration

**Success Criteria**:
- PickerStore with atomic selectors
- useMediaPicker hook working
- usePexelsPhotos/Videos hooks with infinite query
- Unit tests for store actions

**Tasks**:
- [ ] Create picker-store.ts with Zustand
- [ ] Define selectors for optimal re-renders
- [ ] Create useMediaPicker hook
- [ ] Setup QueryClient provider
- [ ] Implement usePexelsPhotos hook
- [ ] Implement usePexelsVideos hook
- [ ] Implement useInfiniteScroll hook
- [ ] Write unit tests

**Status**: Not Started

---

## Stage 4: Core Components

**Goal**: Build the main UI components

**Success Criteria**:
- All components render correctly
- Components use Tailwind CSS
- Unit tests for each component
- Accessibility attributes present

**Tasks**:
- [ ] MediaCard (photo/video variants)
- [ ] MediaGrid with infinite scroll
- [ ] SearchBar with IME support
- [ ] MediaTabs
- [ ] EmptyState
- [ ] ErrorState
- [ ] SkeletonGrid
- [ ] Write unit tests
- [ ] Add accessibility attributes

**Status**: Not Started

---

## Stage 5: Modal & Preview

**Goal**: Implement modal wrapper and Lightbox preview

**Success Criteria**:
- MediaPicker modal opens/closes correctly
- Focus trap working
- Lightbox preview functional
- Selection persists through preview
- Keyboard navigation working

**Tasks**:
- [ ] MediaPicker modal component
- [ ] MediaPickerButton convenience component
- [ ] PreviewModal with Lightbox
- [ ] Focus management
- [ ] Keyboard navigation
- [ ] Integration tests

**Status**: Not Started

---

## Stage 6: Styling & Theming

**Goal**: Finalize CSS architecture and theming system

**Success Criteria**:
- CSS custom properties for theming
- Responsive grid layout
- Reduced motion support
- Dark mode compatible

**Tasks**:
- [ ] Create base CSS file
- [ ] Define CSS custom properties
- [ ] Implement responsive breakpoints
- [ ] Add reduced motion support
- [ ] Test dark mode
- [ ] Document theming API

**Status**: Not Started

---

## Stage 7: Testing & Quality

**Goal**: Comprehensive test coverage and quality assurance

**Success Criteria**:
- ≥80% code coverage
- All accessibility tests passing
- Cross-browser testing complete
- Performance benchmarks met

**Tasks**:
- [ ] Complete unit test coverage
- [ ] Integration tests for user flows
- [ ] Accessibility audit (axe-core)
- [ ] Performance profiling
- [ ] Bundle size analysis
- [ ] Cross-browser testing

**Status**: Not Started

---

## Stage 8: Documentation & Examples

**Goal**: Create comprehensive documentation

**Success Criteria**:
- README with quick start
- API documentation complete
- Example projects working
- Storybook stories

**Tasks**:
- [ ] Write README.md
- [ ] API reference documentation
- [ ] Next.js example project
- [ ] Vite example project
- [ ] Storybook stories
- [ ] CONTRIBUTING.md
- [ ] CHANGELOG.md

**Status**: Not Started

---

## Stage 9: Release Preparation

**Goal**: Prepare for npm publication

**Success Criteria**:
- npm package builds correctly
- All peer deps declared
- CI/CD pipeline working
- Package published to npm

**Tasks**:
- [ ] Finalize package.json metadata
- [ ] Setup GitHub Actions CI
- [ ] Configure semantic-release
- [ ] Test npm pack locally
- [ ] Publish to npm
- [ ] Create GitHub release

**Status**: Not Started

---

## Current Focus

**Active Stage**: Stage 1 - Project Foundation

**Next Action**: Initialize package.json with pnpm

---

## Notes

- Migrating from: `koo-labs-next/koo-labs/src/components/media-picker/`
- Target npm package: `@koo-labs/media-picker`
- Peer dependencies: React 18/19, React DOM
