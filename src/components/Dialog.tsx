import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './Button';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type DialogProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
};

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 3l8 8M11 3l-8 8" />
    </svg>
  );
}

export function Dialog({
  trigger,
  title,
  description,
  children,
  actions,
  open,
  defaultOpen,
  onOpenChange,
  className,
  style,
}: DialogProps) {
  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      <BaseDialog.Trigger render={trigger} />

      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className="fixed inset-0 min-h-dvh bg-overlay-backdrop backdrop-blur-[4px] transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute"
        />

        <BaseDialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 w-[420px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border-strong bg-background-elevated p-6 shadow-dialog outline-none transition-[transform,opacity] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            className,
          )}
          style={style}
        >
          <BaseDialog.Close
            type="button"
            aria-label="Close dialog"
            className="absolute right-3.5 top-3.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-foreground-subtle outline-none hover:bg-background-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <CloseIcon />
          </BaseDialog.Close>

          <div className={description || children ? 'mb-4' : 'mb-6'}>
            <BaseDialog.Title
              className="m-0 text-base font-semibold tracking-[-0.01em] text-foreground"
            >
              {title}
            </BaseDialog.Title>
            {description && (
              <BaseDialog.Description
                className="m-0 mt-1.5 text-sm leading-[1.55] text-foreground-muted"
              >
                {description}
              </BaseDialog.Description>
            )}
          </div>

          {children && (
            <div className="mb-6">{children}</div>
          )}

          <div className="flex justify-end gap-2">
            {actions ?? (
              <BaseDialog.Close render={<Button type="button" variant="outline" />}>
                Close
              </BaseDialog.Close>
            )}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export const DialogClose = BaseDialog.Close;
