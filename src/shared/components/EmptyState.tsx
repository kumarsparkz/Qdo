import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /**
   * Icon to display (from lucide-react)
   */
  icon?: LucideIcon;
  /**
   * Emoji to display as alternative to icon
   */
  emoji?: string;
  /**
   * Title of the empty state
   */
  title: string;
  /**
   * Description message
   */
  description?: string;
  /**
   * Action button label
   */
  actionLabel?: string;
  /**
   * Action button callback
   */
  onAction?: () => void;
  /**
   * Whether to render as fullscreen centered empty state
   */
  fullscreen?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  fullscreen = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8 text-center',
        fullscreen && 'min-h-screen',
        className
      )}
    >
      {/* Icon or Emoji */}
      {Icon ? (
        <div className="rounded-full bg-muted p-4">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
      ) : emoji ? (
        <div className="text-5xl">{emoji}</div>
      ) : null}

      {/* Title and Description */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Empty state for lists/collections
 */
export function EmptyList({
  title = 'No items yet',
  description = 'Get started by creating your first item.',
  actionLabel,
  onAction,
  className,
}: Omit<EmptyStateProps, 'icon' | 'emoji' | 'fullscreen'> & {
  title?: string;
  description?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-12 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50',
        className
      )}
    >
      <div className="space-y-1.5 text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
