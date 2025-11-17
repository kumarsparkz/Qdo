import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  /**
   * Size variant for the loading spinner
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether to render as fullscreen centered loader
   */
  fullscreen?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function LoadingState({
  message,
  size = 'md',
  fullscreen = false,
  className,
}: LoadingStateProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3',
        fullscreen && 'min-h-screen',
        className
      )}
    >
      <Loader2 className={cn('animate-spin text-primary', sizeMap[size])} />
      {message && (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );

  return content;
}

/**
 * Skeleton loader for list items
 */
export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 animate-pulse">
      <div className="h-5 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="flex gap-2 mt-2">
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-6 bg-muted rounded w-20"></div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for multiple cards
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
