import { Toast as BaseToast } from '@base-ui/react/toast';
import { cn } from '../lib/cn';
import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export type ToastOptions = {
  description?: string;
  variant?: ToastVariant;
  className?: string;
  style?: CSSProperties;
};

export type ToastProviderProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const variantConfig: Record<ToastVariant, { color: string; icon: ReactNode }> = {
  default: {
    color: 'var(--color-foreground-muted)',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M8 7v4M8 5.5v.5" /></svg>,
  },
  success: {
    color: 'var(--color-success)',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6" /><path d="M5 8l2 2 4-4" /></svg>,
  },
  error: {
    color: 'var(--color-error)',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6" /><path d="M6 6l4 4M10 6l-4 4" /></svg>,
  },
  warning: {
    color: 'var(--color-warning)',
    icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2L1 14h14L8 2z" /><path d="M8 7v3M8 12v.5" /></svg>,
  },
};

function ToastList() {
  const { toasts } = BaseToast.useToastManager();

  return (
    <>
      {toasts.map((toast) => {
        const variant = (toast.data?.variant as ToastVariant) ?? 'default';
        const className = toast.data?.className as string | undefined;
        const style = toast.data?.style as CSSProperties | undefined;
        const cfg = variantConfig[variant];
        const role = variant === 'error' || variant === 'warning' ? 'alert' : 'status';

        return (
          <BaseToast.Root
            key={toast.id}
            toast={toast}
            role={role}
            aria-atomic="true"
            className={cn(
              'pointer-events-auto absolute bottom-0 right-0 flex w-full select-none items-start gap-[12px] rounded-md border border-border bg-background-elevated px-[16px] py-[14px] shadow-toast outline-none transition-[transform,translate,opacity] duration-200 [transform:translateY(calc(var(--toast-offset-y)*-1))] data-[starting-style]:translate-y-full data-[starting-style]:opacity-0 data-[ending-style]:translate-y-full data-[ending-style]:opacity-0 data-[swiping]:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              className,
            )}
            style={style}
          >
            <span aria-hidden="true" className="mt-px shrink-0" style={{ color: cfg.color }}>{cfg.icon}</span>
            <div className="flex flex-1 flex-col gap-[4px]">
              <BaseToast.Title className="m-0 text-sm font-semibold leading-normal text-foreground" />
              <BaseToast.Description className="m-0 text-[0.8125rem] leading-[1.5] text-foreground-muted" />
            </div>
            <BaseToast.Close
              type="button"
              aria-label="Dismiss toast"
              className="flex h-[24px] w-[24px] shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-[0px] text-foreground-subtle outline-none hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M3 3l8 8M11 3l-8 8" />
              </svg>
            </BaseToast.Close>
          </BaseToast.Root>
        );
      })}
    </>
  );
}

export function ToastProvider({ children, className, style }: ToastProviderProps) {
  return (
    <BaseToast.Provider>
      {children}
      <BaseToast.Portal>
        <BaseToast.Viewport
          className={cn(
            'pointer-events-none fixed z-[9999] m-0 h-[var(--toast-frontmost-height)] max-w-[calc(100vw-2rem)] list-none overflow-visible p-0 outline-none',
            className,
          )}
          style={{
            bottom: 'max(1rem, env(safe-area-inset-bottom))',
            right: 'max(1rem, env(safe-area-inset-right))',
            width: 'min(calc(100vw - 2rem), 24rem)',
            ...style,
          }}
        >
          <ToastList />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export function useToast() {
  const manager = BaseToast.useToastManager();

  return useMemo(
    () => ({
      toast: (title: string, options?: ToastOptions) =>
        manager.add({
          title,
          description: options?.description,
          data: {
            variant: options?.variant ?? 'default',
            className: options?.className,
            style: options?.style,
          },
        }),
      success: (title: string, description?: string) =>
        manager.add({ title, description, data: { variant: 'success' } }),
      error: (title: string, description?: string) =>
        manager.add({ title, description, data: { variant: 'error' } }),
      warning: (title: string, description?: string) =>
        manager.add({ title, description, data: { variant: 'warning' } }),
    }),
    [manager],
  );
}
