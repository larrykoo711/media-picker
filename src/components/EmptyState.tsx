import { ImageOff } from 'lucide-react';

interface EmptyStateProps {
  query?: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center px-4 text-center">
      <ImageOff className="mb-4 h-12 w-12 text-base-content/30" />
      <div role="alert" className="alert max-w-md">
        <span>
          {query
            ? `No media found for "${query}"`
            : 'No media available'}
        </span>
      </div>
      {query && (
        <p className="mt-2 text-sm text-base-content/50">
          Try a different search term?
        </p>
      )}
    </div>
  );
}
