import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import { Button } from './Button'

export type DrawerSide = 'bottom' | 'right' | 'left'

export type DrawerProps = {
  trigger: React.ReactElement
  title: string
  description?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  side?: DrawerSide
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  style?: React.CSSProperties
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
      '-mb-12 w-full max-h-[calc(85vh+3rem)] rounded-t-[12px] border border-border-strong bg-background-elevated px-6 pb-[calc(1.5rem+3rem)] pt-4 shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateY(calc(100%-3rem+2px))] data-[starting-style]:[transform:translateY(calc(100%-3rem+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
    handleClass: 'mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong',
  },
  right: {
    swipeDirection: 'right',
    viewportClass: 'fixed inset-0 flex items-stretch justify-end',
    popupClass:
      '-mr-12 h-full w-[calc(22rem+3rem)] max-w-[calc(100vw-3rem)] border-l border-border-strong bg-background-elevated px-6 pb-6 pr-[calc(1.5rem+3rem)] pt-6 shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateX(var(--drawer-swipe-movement-x))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateX(calc(100%-3rem+2px))] data-[starting-style]:[transform:translateX(calc(100%-3rem+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
  },
  left: {
    swipeDirection: 'left',
    viewportClass: 'fixed inset-0 flex items-stretch justify-start',
    popupClass:
      '-ml-12 h-full w-[calc(22rem+3rem)] max-w-[calc(100vw-3rem)] border-r border-border-strong bg-background-elevated px-6 pb-6 pl-[calc(1.5rem+3rem)] pt-6 shadow-dialog overflow-y-auto overscroll-contain touch-auto [transform:translateX(calc(-1*var(--drawer-swipe-movement-x)))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateX(calc(-100%+3rem-2px))] data-[starting-style]:[transform:translateX(calc(-100%+3rem-2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)]',
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
            className={[cfg.popupClass, className].filter(Boolean).join(' ')}
            style={style}>
            {cfg.handleClass && <div className={cfg.handleClass} aria-hidden />}
            <BaseDrawer.Content className='mx-auto w-full max-w-[32rem]'>
              <div className='mb-4 flex items-start justify-between gap-4'>
                <div>
                  <BaseDrawer.Title className='m-0 text-base font-semibold tracking-[-0.01em] text-foreground'>
                    {title}
                  </BaseDrawer.Title>
                  {description && (
                    <BaseDrawer.Description className='m-0 mt-1.5 text-sm leading-[1.55] text-foreground-muted'>
                      {description}
                    </BaseDrawer.Description>
                  )}
                </div>
                {side !== 'bottom' && (
                  <BaseDrawer.Close
                    type='button'
                    aria-label='Close drawer'
                    className='flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-foreground-subtle outline-none hover:bg-background-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
                    <CloseIcon />
                  </BaseDrawer.Close>
                )}
              </div>

              {children && <div className='mb-6'>{children}</div>}

              <div
                className={[
                  'flex gap-2',
                  side === 'bottom' ? 'justify-center' : 'justify-end',
                ].join(' ')}>
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
