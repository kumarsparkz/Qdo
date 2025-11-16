import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  /**
   * Error title - defaults to "Something went wrong"
   */
  title?: string;
  /**
   * Error message to display to the user
   */
  message?: string;
  /**
   * Retry callback function
   */
  onRetry?: () => void;
  /**
   * Label for retry button
   */
  retryLabel?: string;
  /**
   * Whether to render as fullscreen centered error
   */
  fullscreen?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  fullscreen = false,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center',
        fullscreen && 'min-h-screen',
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Inline error message for forms and small components
 */
export function InlineError({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive',
        className
      )}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/**
 * Normalize API errors to user-friendly messages
 */
export function normalizeError(error: unknown): string {
  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('Failed to fetch')) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.message.includes('401')) {
      return 'Authentication required. Please log in again.';
    }
    if (error.message.includes('403')) {
      return 'You do not have permission to perform this action.';
    }
    if (error.message.includes('404')) {
      return 'The requested resource was not found.';
    }
    if (error.message.includes('500')) {
      return 'Server error. Please try again later.';
    }
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred. Please try again.';
}
