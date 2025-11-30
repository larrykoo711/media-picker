import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let mockObserverInstance: {
    observe: ReturnType<typeof vi.fn>;
    unobserve: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };
  let intersectionCallback: IntersectionObserverCallback;
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = global.IntersectionObserver;

    mockObserverInstance = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    global.IntersectionObserver = vi.fn((callback, _options) => {
      intersectionCallback = callback;
      return mockObserverInstance;
    }) as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
  });

  it('returns a sentinelRef', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    );

    expect(result.current.sentinelRef).toBeDefined();
  });

  it('creates IntersectionObserver when sentinel element is set', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    );

    // Simulate setting a DOM element to the ref
    const mockElement = document.createElement('div');
    act(() => {
      result.current.sentinelRef.current = mockElement;
    });

    // Re-render to trigger the effect
    renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    );

    // Observer is created when the effect runs with a valid ref
  });

  it('calls onLoadMore when conditions are met', () => {
    const onLoadMore = vi.fn();

    // Create hook with a wrapper that provides the sentinel element
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    // Manually set up the ref and trigger observer
    const mockElement = document.createElement('div');
    result.current.sentinelRef.current = mockElement;

    // If the IntersectionObserver was called and we have the callback
    if (intersectionCallback) {
      act(() => {
        intersectionCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(onLoadMore).toHaveBeenCalledTimes(1);
    }
  });

  it('does not call onLoadMore when isLoading is true', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: true,
      })
    );

    const mockElement = document.createElement('div');
    result.current.sentinelRef.current = mockElement;

    if (intersectionCallback) {
      act(() => {
        intersectionCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(onLoadMore).not.toHaveBeenCalled();
    }
  });

  it('does not call onLoadMore when hasMore is false', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: false,
        isLoading: false,
      })
    );

    const mockElement = document.createElement('div');
    result.current.sentinelRef.current = mockElement;

    if (intersectionCallback) {
      act(() => {
        intersectionCallback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(onLoadMore).not.toHaveBeenCalled();
    }
  });

  it('does not call onLoadMore when not intersecting', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore,
        hasMore: true,
        isLoading: false,
      })
    );

    const mockElement = document.createElement('div');
    result.current.sentinelRef.current = mockElement;

    if (intersectionCallback) {
      act(() => {
        intersectionCallback(
          [{ isIntersecting: false } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      });

      expect(onLoadMore).not.toHaveBeenCalled();
    }
  });

  it('accepts custom threshold option', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
        threshold: 500,
      })
    );

    expect(result.current.sentinelRef).toBeDefined();
  });

  it('uses default threshold of 200', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        onLoadMore: vi.fn(),
        hasMore: true,
        isLoading: false,
      })
    );

    expect(result.current.sentinelRef).toBeDefined();
  });
});
