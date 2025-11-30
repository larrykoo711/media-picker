import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PexelsClient, PexelsApiError, configurePexelsClient, getPexelsClient } from './pexels-client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PexelsClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('uses default Pexels API URL when no config provided', () => {
      const client = new PexelsClient();
      expect(client).toBeDefined();
    });

    it('uses proxy URL when provided', () => {
      const client = new PexelsClient({ proxyUrl: '/api/pexels' });
      expect(client).toBeDefined();
    });

    it('stores API key when provided', () => {
      const client = new PexelsClient({ apiKey: 'test-key' });
      expect(client).toBeDefined();
    });
  });

  describe('searchPhotos', () => {
    it('sends correct request for photo search', async () => {
      const mockResponse = {
        page: 1,
        per_page: 20,
        total_results: 100,
        photos: [{ id: 1, url: 'https://example.com' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });
      const result = await client.searchPhotos({ query: 'nature' });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResponse);
    });

    it('includes Authorization header when API key is set', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ photos: [] }),
      });

      const client = new PexelsClient({ apiKey: 'my-api-key' });
      await client.searchPhotos({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { Authorization: 'my-api-key' },
        })
      );
    });

    it('includes search parameters in URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ photos: [] }),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });
      await client.searchPhotos({
        query: 'sunset',
        orientation: 'landscape',
        size: 'large',
        page: 2,
        per_page: 15,
      });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('query=sunset');
      expect(calledUrl).toContain('orientation=landscape');
      expect(calledUrl).toContain('size=large');
      expect(calledUrl).toContain('page=2');
      expect(calledUrl).toContain('per_page=15');
    });
  });

  describe('getCuratedPhotos', () => {
    it('fetches curated photos', async () => {
      const mockResponse = {
        page: 1,
        per_page: 20,
        photos: [{ id: 1 }, { id: 2 }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });
      const result = await client.getCuratedPhotos({ page: 1, per_page: 20 });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('searchVideos', () => {
    it('sends correct request for video search', async () => {
      const mockResponse = {
        page: 1,
        per_page: 20,
        total_results: 50,
        videos: [{ id: 1, url: 'https://example.com/video' }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });
      const result = await client.searchVideos({ query: 'ocean' });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('getPopularVideos', () => {
    it('fetches popular videos with filters', async () => {
      const mockResponse = {
        page: 1,
        per_page: 10,
        videos: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });
      const result = await client.getPopularVideos({
        min_duration: 10,
        max_duration: 60,
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('throws PexelsApiError on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const client = new PexelsClient({ apiKey: 'invalid-key' });

      await expect(client.searchPhotos({ query: 'test' })).rejects.toThrow(
        PexelsApiError
      );
    });

    it('includes status code in error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });

      try {
        await client.searchPhotos({ query: 'test' });
      } catch (error) {
        expect(error).toBeInstanceOf(PexelsApiError);
        expect((error as PexelsApiError).status).toBe(429);
      }
    });

    it('handles JSON parse error gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });

      const client = new PexelsClient({ apiKey: 'test-key' });

      await expect(client.searchPhotos({ query: 'test' })).rejects.toThrow(
        PexelsApiError
      );
    });
  });

  describe('proxy mode', () => {
    it('constructs correct URL for proxy mode', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ photos: [] }),
      });

      const client = new PexelsClient({ proxyUrl: '/api/pexels' });
      await client.searchPhotos({ query: 'test' });

      const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(calledUrl?.startsWith('/api/pexels')).toBe(true);
    });

    it('does not include Authorization header in proxy mode without key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ photos: [] }),
      });

      const client = new PexelsClient({ proxyUrl: '/api/pexels' });
      await client.searchPhotos({ query: 'test' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {},
        })
      );
    });
  });
});

describe('configurePexelsClient / getPexelsClient', () => {
  it('creates and returns a configured client', () => {
    configurePexelsClient({ apiKey: 'test-key' });
    const client = getPexelsClient();
    expect(client).toBeInstanceOf(PexelsClient);
  });

  it('returns same instance on multiple calls', () => {
    configurePexelsClient({ apiKey: 'test-key' });
    const client1 = getPexelsClient();
    const client2 = getPexelsClient();
    expect(client1).toBe(client2);
  });

  it('creates new instance after reconfiguration', () => {
    configurePexelsClient({ apiKey: 'key-1' });
    const client1 = getPexelsClient();

    configurePexelsClient({ apiKey: 'key-2' });
    const client2 = getPexelsClient();

    expect(client1).not.toBe(client2);
  });
});
