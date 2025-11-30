import { forwardRef, type ReactNode, type KeyboardEvent } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

// ============ Sub-component: Selection Indicator ============

interface SelectionIndicatorProps {
  selected: boolean;
}

export function SelectionIndicator({ selected }: SelectionIndicatorProps) {
  return (
    <div
      className={cn(
        'absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full',
        'transition-all duration-200',
        selected
          ? 'bg-neutral text-neutral-content'
          : 'bg-base-100/80 opacity-0 group-hover:opacity-100'
      )}
    >
      {selected && <Check className="h-4 w-4" />}
    </div>
  );
}

// ============ Sub-component: Author Overlay ============

interface AuthorOverlayProps {
  author: string;
}

export function AuthorOverlay({ author }: AuthorOverlayProps) {
  return (
    <div
      className={cn(
        'absolute bottom-0 left-0 right-0 p-2 pt-6',
        'bg-gradient-to-t from-black/60 to-transparent',
        'opacity-0 transition-opacity group-hover:opacity-100'
      )}
    >
      <p className="truncate text-xs text-white">{author}</p>
    </div>
  );
}

// ============ Sub-component: Loading Placeholder ============

interface LoadingPlaceholderProps {
  loaded: boolean;
  bgColor?: string;
}

export function LoadingPlaceholder({
  loaded,
  bgColor,
}: LoadingPlaceholderProps) {
  if (loaded) return null;

  return (
    <div
      className="absolute inset-0 animate-pulse bg-base-300"
      style={bgColor ? { backgroundColor: bgColor } : undefined}
    />
  );
}

// ============ Main Component: BaseMediaCard ============

export type AspectRatio = 'video' | 'photo';

interface BaseMediaCardProps {
  selected: boolean;
  onClick: () => void;
  aspectRatio?: AspectRatio;
  className?: string;
  children: ReactNode;
}

export const BaseMediaCard = forwardRef<HTMLDivElement, BaseMediaCardProps>(
  function BaseMediaCard(
    { selected, onClick, aspectRatio = 'photo', className, children },
    ref
  ) {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-lg',
          aspectRatio === 'video' ? 'aspect-video' : 'aspect-[4/3]',
          'ring-2 ring-offset-2 transition-all duration-200',
          selected ? 'ring-neutral' : 'ring-transparent hover:ring-base-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-2',
          className
        )}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        {children}

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

        {/* Selection indicator */}
        <SelectionIndicator selected={selected} />
      </div>
    );
  }
);
