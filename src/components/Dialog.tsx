import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Button } from './Button';
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type DialogProps = {
  trigger?: ReactElement;
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
  const overlayStyle: CSSProperties = { position: 'fixed', top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <BaseDialog.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}
    >
      {trigger && <BaseDialog.Trigger render={trigger} />}

      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className="fixed inset-0 min-h-dvh bg-overlay-backdrop backdrop-blur-[4px] transition-opacity duration-150 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute"
          style={overlayStyle}
        />

        <BaseDialog.Popup
          className={cn(
            'fixed left-1/2 top-1/2 z-[9999] w-[440px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background-elevated p-[24px] text-foreground shadow-dialog outline-none transition-[transform,opacity] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
            className,
          )}
          style={style}
        >
          <BaseDialog.Close
            type="button"
            aria-label="Close dialog"
            className="absolute right-[14px] top-[14px] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-[0px] text-foreground-subtle outline-none hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <CloseIcon />
          </BaseDialog.Close>

          <div className={description || children ? 'mb-[18px] pr-[34px]' : 'mb-[24px] pr-[34px]'}>
            <BaseDialog.Title
              className="m-0 text-base font-semibold leading-normal text-foreground"
            >
              {title}
            </BaseDialog.Title>
            {description && (
              <BaseDialog.Description
                className="m-0 mt-[6px] text-sm leading-[1.55] text-foreground-muted"
              >
                {description}
              </BaseDialog.Description>
            )}
          </div>

          {children && (
            <div className="cd-dialog-content mb-[24px] text-sm leading-[1.6] text-foreground-muted">{children}</div>
          )}

          <div className="flex justify-end gap-[8px]">
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

export const DialogClose: typeof BaseDialog.Close = BaseDialog.Close;
