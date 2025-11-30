import { QueryClient } from '@tanstack/react-query';

/**
 * Media Picker dedicated QueryClient instance
 * Module-level singleton to avoid recreating on component re-renders
 */
export const mediaPickerQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});
