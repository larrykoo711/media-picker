import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center px-4">
      <div role="alert" className="alert alert-error max-w-md">
        <AlertCircle className="h-6 w-6" />
        <span>Loading failed. Please check your network and try again.</span>
        <button className="btn btn-ghost btn-sm" onClick={onRetry}>
          <RefreshCw className="mr-1 h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}
