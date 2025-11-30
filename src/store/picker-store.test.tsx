import { describe, it, expect } from 'vitest';
import { photoToMedia, videoToMedia } from './picker-store';
import type { Photo, Video } from '../types';

const mockPhoto: Photo = {
  id: 123,
  width: 1920,
  height: 1080,
  url: 'https://www.pexels.com/photo/123/',
  photographer: 'John Doe',
  photographer_url: 'https://www.pexels.com/@johndoe',
  photographer_id: 456,
  avg_color: '#336699',
  liked: false,
  alt: 'A beautiful sunset',
  src: {
    original: 'https://images.pexels.com/photos/123/original.jpg',
    large2x: 'https://images.pexels.com/photos/123/large2x.jpg',
    large: 'https://images.pexels.com/photos/123/large.jpg',
    medium: 'https://images.pexels.com/photos/123/medium.jpg',
    small: 'https://images.pexels.com/photos/123/small.jpg',
    portrait: 'https://images.pexels.com/photos/123/portrait.jpg',
    landscape: 'https://images.pexels.com/photos/123/landscape.jpg',
    tiny: 'https://images.pexels.com/photos/123/tiny.jpg',
  },
};

const mockVideo: Video = {
  id: 789,
  width: 1920,
  height: 1080,
  url: 'https://www.pexels.com/video/789/',
  image: 'https://images.pexels.com/videos/789/poster.jpg',
  duration: 30,
  user: {
    id: 101,
    name: 'Jane Smith',
    url: 'https://www.pexels.com/@janesmith',
  },
  video_files: [
    {
      id: 1,
      quality: 'hd',
      file_type: 'video/mp4',
      width: 1920,
      height: 1080,
      fps: 30,
      link: 'https://videos.pexels.com/789/hd.mp4',
    },
    {
      id: 2,
      quality: 'sd',
      file_type: 'video/mp4',
      width: 640,
      height: 360,
      fps: 30,
      link: 'https://videos.pexels.com/789/sd.mp4',
    },
  ],
  video_pictures: [
    {
      id: 1,
      picture: 'https://images.pexels.com/videos/789/pic1.jpg',
      nr: 0,
    },
  ],
};

describe('photoToMedia', () => {
  it('transforms Photo to MediaItem', () => {
    const result = photoToMedia(mockPhoto);

    expect(result).toEqual({
      id: 123,
      type: 'photo',
      width: 1920,
      height: 1080,
      url: 'https://www.pexels.com/photo/123/',
      author: 'John Doe',
      authorUrl: 'https://www.pexels.com/@johndoe',
      thumbnail: 'https://images.pexels.com/photos/123/medium.jpg',
      avgColor: '#336699',
      src: {
        original: 'https://images.pexels.com/photos/123/original.jpg',
        large: 'https://images.pexels.com/photos/123/large.jpg',
        medium: 'https://images.pexels.com/photos/123/medium.jpg',
        small: 'https://images.pexels.com/photos/123/small.jpg',
      },
    });
  });
});

describe('videoToMedia', () => {
  it('transforms Video to MediaItem', () => {
    const result = videoToMedia(mockVideo);

    expect(result).toEqual({
      id: 789,
      type: 'video',
      width: 1920,
      height: 1080,
      url: 'https://www.pexels.com/video/789/',
      author: 'Jane Smith',
      authorUrl: 'https://www.pexels.com/@janesmith',
      thumbnail: 'https://images.pexels.com/videos/789/poster.jpg',
      src: {
        original: 'https://videos.pexels.com/789/hd.mp4',
        large: 'https://videos.pexels.com/789/hd.mp4',
        medium: 'https://videos.pexels.com/789/sd.mp4',
        small: 'https://videos.pexels.com/789/sd.mp4',
      },
      duration: 30,
      videoFiles: mockVideo.video_files,
    });
  });

  it('handles video with only HD file', () => {
    const videoWithOnlyHd: Video = {
      ...mockVideo,
      video_files: [mockVideo.video_files[0]!],
    };

    const result = videoToMedia(videoWithOnlyHd);

    expect(result.src.medium).toBe('https://videos.pexels.com/789/hd.mp4');
    expect(result.src.small).toBe('https://videos.pexels.com/789/hd.mp4');
  });
});
