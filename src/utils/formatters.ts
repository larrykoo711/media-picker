/**
 * Format video duration
 * @param seconds Duration in seconds
 * @returns Formatted duration string (e.g., "1:23" or "0:05")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format file size
 * @param bytes Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Format dimensions
 * @param width Width in pixels
 * @param height Height in pixels
 * @returns Formatted dimensions string (e.g., "1920 × 1080")
 */
export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height}`;
}
