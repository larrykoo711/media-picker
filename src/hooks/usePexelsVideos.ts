import { useInfiniteQuery } from '@tanstack/react-query';
import { getPexelsClient } from '../api/pexels-client';
import type { FilterState, VideosResponse } from '../types';

interface UsePexelsVideosOptions {
  query?: string;
  filters?: FilterState;
  perPage?: number;
  enabled?: boolean;
}

export function usePexelsVideos(options: UsePexelsVideosOptions = {}) {
  const { query, filters, perPage = 20, enabled = true } = options;

  return useInfiniteQuery<VideosResponse>({
    queryKey: ['pexels', 'videos', query, filters],
    queryFn: async ({ pageParam }) => {
      const page = pageParam as number;
      const client = getPexelsClient();

      if (query && query.trim()) {
        return client.searchVideos({
          query: query.trim(),
          orientation: filters?.orientation,
          size: filters?.size,
          page,
          per_page: perPage,
        });
      }

      return client.getPopularVideos({
        min_duration: filters?.minDuration,
        max_duration: filters?.maxDuration,
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
    staleTime: 5 * 60 * 1000,
  });
}
