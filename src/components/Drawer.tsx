import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import { Button } from './Button'
import { cn } from '../lib/cn';
import type { CSSProperties, ReactElement, ReactNode } from 'react';

export type DrawerSide = 'bottom' | 'right' | 'left'

export type DrawerProps = {
  trigger: ReactElement
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
  side?: DrawerSide
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: CSSProperties
}

function CloseIcon() {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'>
      <path d='M3 3l8 8M11 3l-8 8' />
    </svg>
  )
}

const sideConfig: Record<
  DrawerSide,
  {
    swipeDirection: 'down' | 'left' | 'right'
    viewportClass: string
    popupClass: string
    handleClass?: string
  }
> = {
  bottom: {
    swipeDirection: 'down',
    viewportClass: 'fixed inset-0 flex items-end justify-center',
    popupClass:
      '-mb-12 w-full max-h-[calc(85vh+3rem)] rounded-t-lg border border-border bg-background-elevated px-[24px] pb-[calc(1.5rem+3rem)] pt-[16px] shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateY(calc(100%-3rem+2px))] data-[starting-style]:[transform:translateY(calc(100%-3rem+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
    handleClass: 'mx-auto mb-[18px] h-[4px] w-[42px] rounded-full bg-border-strong',
  },
  right: {
    swipeDirection: 'right',
    viewportClass: 'fixed inset-0 flex items-stretch justify-end',
    popupClass:
      '-mr-12 h-full w-[calc(22rem+3rem)] max-w-[calc(100vw-3rem)] border-l border-border bg-background-elevated px-[24px] pb-[24px] pr-[calc(1.5rem+3rem)] pt-[24px] shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateX(calc(100%-3rem+2px))] data-[starting-style]:[transform:translateX(calc(100%-3rem+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
  },
  left: {
    swipeDirection: 'left',
    viewportClass: 'fixed inset-0 flex items-stretch justify-start',
    popupClass:
      '-ml-12 h-full w-[calc(22rem+3rem)] max-w-[calc(100vw-3rem)] border-r border-border bg-background-elevated px-[24px] pb-[24px] pl-[calc(1.5rem+3rem)] pt-[24px] shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateX(calc(-1*var(--drawer-swipe-movement-x)))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateX(calc(-100%+3rem-2px))] data-[starting-style]:[transform:translateX(calc(-100%+3rem-2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
  },
}

export function Drawer({
  trigger,
  title,
  description,
  children,
  actions,
  side = 'bottom',
  open,
  defaultOpen,
  onOpenChange,
  className,
  style,
}: DrawerProps) {
  const cfg = sideConfig[side]

  return (
    <BaseDrawer.Root
      swipeDirection={cfg.swipeDirection}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(nextOpen) => onOpenChange?.(nextOpen)}>
      <BaseDrawer.Trigger render={trigger} />
      <BaseDrawer.Portal>
        <BaseDrawer.Backdrop className='fixed inset-0 min-h-dvh bg-overlay-backdrop backdrop-blur-[4px] opacity-[calc(1*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:duration-0 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute' />
        <BaseDrawer.Viewport className={cfg.viewportClass}>
          <BaseDrawer.Popup
            className={cn(cfg.popupClass, className)}
            style={style}>
            {cfg.handleClass && <div className={cfg.handleClass} aria-hidden />}
            <BaseDrawer.Content className='mx-auto w-full max-w-[32rem]'>
              <div className='mb-[18px] flex items-start justify-between gap-[16px]'>
                <div>
                  <BaseDrawer.Title className='m-0 text-base font-semibold leading-normal text-foreground'>
                    {title}
                  </BaseDrawer.Title>
                  {description && (
                    <BaseDrawer.Description className='m-0 mt-[6px] text-sm leading-[1.55] text-foreground-muted'>
                      {description}
                    </BaseDrawer.Description>
                  )}
                </div>
                {side !== 'bottom' && (
                  <BaseDrawer.Close
                    type='button'
                    aria-label='Close drawer'
                    className='flex h-[30px] w-[30px] shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-[0px] text-foreground-subtle outline-none hover:bg-surface-hover hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
                    <CloseIcon />
                  </BaseDrawer.Close>
                )}
              </div>

              {children && <div className='mb-[24px] text-sm leading-[1.6] text-foreground-muted'>{children}</div>}

              <div
                className={cn(
                  'flex gap-[8px]',
                  side === 'bottom' ? 'justify-center' : 'justify-end',
                )}>
                {actions ?? (
                  <BaseDrawer.Close
                    render={<Button type='button' variant='outline' />}>
                    Close
                  </BaseDrawer.Close>
                )}
              </div>
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </BaseDrawer.Root>
  )
}

export const DrawerClose = BaseDrawer.Close
