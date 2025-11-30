import { describe, it, expect } from 'vitest';
import { formatDuration, formatFileSize, formatDimensions } from './formatters';

describe('formatDuration', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(59)).toBe('0:59');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(90)).toBe('1:30');
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(3661)).toBe('61:01');
  });
});

describe('formatFileSize', () => {
  it('formats bytes to human readable size', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });
});

describe('formatDimensions', () => {
  it('formats width and height to dimension string', () => {
    expect(formatDimensions(1920, 1080)).toBe('1920 × 1080');
    expect(formatDimensions(800, 600)).toBe('800 × 600');
    expect(formatDimensions(100, 100)).toBe('100 × 100');
  });
});
