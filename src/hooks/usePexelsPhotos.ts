import { useInfiniteQuery } from '@tanstack/react-query';
import { getPexelsClient } from '../api/pexels-client';
import type { FilterState, PhotosResponse } from '../types';

interface UsePexelsPhotosOptions {
  query?: string;
  filters?: FilterState;
  perPage?: number;
  enabled?: boolean;
}

export function usePexelsPhotos(options: UsePexelsPhotosOptions = {}) {
  const { query, filters, perPage = 20, enabled = true } = options;

  return useInfiniteQuery<PhotosResponse>({
    queryKey: ['pexels', 'photos', query, filters],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const client = getPexelsClient();

      if (query && query.trim()) {
        return client.searchPhotos({
          query: query.trim(),
          orientation: filters?.orientation,
          size: filters?.size,
          color: filters?.color,
          page,
          per_page: perPage,
        });
      }

      return client.getCuratedPhotos({
        page,
        per_page: perPage,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.next_page) {
        try {
          const url = new URL(lastPage.next_page);
          const nextPage = url.searchParams.get('page');
          return nextPage ? Number(nextPage) : undefined;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}
