import type { ReactNode } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { mediaPickerQueryClient } from '../api/query-client';
import { configurePexelsClient } from '../api/pexels-client';
import type { ApiConfig } from '../types';

interface MediaPickerProviderProps {
  children: ReactNode;
  /** Custom QueryClient instance */
  queryClient?: QueryClient;
  /** Pexels API configuration */
  apiConfig?: ApiConfig;
}

export function MediaPickerProvider({
  children,
  queryClient = mediaPickerQueryClient,
  apiConfig,
}: MediaPickerProviderProps) {
  // Configure API client if config provided
  if (apiConfig) {
    configurePexelsClient(apiConfig);
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
