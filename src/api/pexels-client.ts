import type {
  PhotoSearchParams,
  PhotosResponse,
  Photo,
  VideoSearchParams,
  VideosResponse,
  Video,
  VideoPopularParams,
  ApiConfig,
} from '../types';

interface PaginationParams {
  page?: number;
  per_page?: number;
}

export class PexelsApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'PexelsApiError';
  }
}

export class PexelsClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.proxyUrl ?? 'https://api.pexels.com';
    this.apiKey = config.apiKey;
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    // Build URL - handle both absolute URLs and relative paths
    let urlStr: string;
    if (this.baseUrl.startsWith('http')) {
      const url = new URL(endpoint, this.baseUrl);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
          }
        });
      }
      urlStr = url.toString();
    } else {
      // Relative path (proxy mode)
      const searchParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
      }
      const queryStr = searchParams.toString();
      urlStr = `${this.baseUrl}${endpoint}${queryStr ? `?${queryStr}` : ''}`;
    }

    const headers: HeadersInit = {};
    if (this.apiKey) {
      headers['Authorization'] = this.apiKey;
    }

    const response = await fetch(urlStr, { headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new PexelsApiError(
        response.status,
        (errorData as { error?: string }).error ?? 'Request failed'
      );
    }

    return response.json() as Promise<T>;
  }

  // Photo API
  async searchPhotos(params: PhotoSearchParams): Promise<PhotosResponse> {
    return this.request<PhotosResponse>(
      '/v1/search',
      params as unknown as Record<string, unknown>
    );
  }

  async getCuratedPhotos(params: PaginationParams): Promise<PhotosResponse> {
    return this.request<PhotosResponse>(
      '/v1/curated',
      params as unknown as Record<string, unknown>
    );
  }

  async getPhoto(id: number): Promise<Photo> {
    return this.request<Photo>(`/v1/photos/${id}`);
  }

  // Video API
  async searchVideos(params: VideoSearchParams): Promise<VideosResponse> {
    return this.request<VideosResponse>(
      '/videos/search',
      params as unknown as Record<string, unknown>
    );
  }

  async getPopularVideos(params: VideoPopularParams): Promise<VideosResponse> {
    return this.request<VideosResponse>(
      '/videos/popular',
      params as unknown as Record<string, unknown>
    );
  }

  async getVideo(id: number): Promise<Video> {
    return this.request<Video>(`/videos/videos/${id}`);
  }
}

// Default instance (can be overridden via provider)
let defaultClient: PexelsClient | null = null;

export function getPexelsClient(): PexelsClient {
  if (!defaultClient) {
    defaultClient = new PexelsClient();
  }
  return defaultClient;
}

export function configurePexelsClient(config: ApiConfig): void {
  defaultClient = new PexelsClient(config);
}
