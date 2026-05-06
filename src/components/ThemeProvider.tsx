import { useEffect, useLayoutEffect, useRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react';

export type ThemeAppearance = 'dark' | 'light'
export type ThemeAccent =
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'crimson'
  | 'teal'
  | 'orange'
export type ThemeRadius = 'sm' | 'md' | 'lg'
export type ThemeScope = 'subtree' | 'global'

/**
 * HTML div passthrough props are applied only when scope is "subtree".
 * Global scope renders children without a wrapper and applies attributes to <html>.
 */
export type ThemeProviderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Where theme attributes are written. Global scope renders no wrapper. */
  scope?: ThemeScope
  /** Theme color mode written to data-appearance. */
  appearance?: ThemeAppearance
  /** Accent palette written to data-accent. */
  accent?: ThemeAccent
  /** Radius scale written to data-radius. */
  radius?: ThemeRadius
  children: ReactNode
}

const themeAttributeNames = [
  'data-appearance',
  'data-accent',
  'data-radius',
] as const

type ThemeAttributeName = (typeof themeAttributeNames)[number]
type ThemeAttributeSnapshot = Record<ThemeAttributeName, string | null>
type ThemeAttributeValues = {
  'data-appearance': ThemeAppearance
  'data-accent': ThemeAccent
  'data-radius': ThemeRadius
}
type GlobalThemeEntry = {
  id: symbol
  values: ThemeAttributeValues
}

const useIsomorphicLayoutEffect =
  typeof document === 'undefined' ? useEffect : useLayoutEffect

const globalThemeEntries: GlobalThemeEntry[] = []
let previousGlobalThemeAttributes: ThemeAttributeSnapshot | null = null

function getThemeAttributeValues(
  appearance: ThemeAppearance,
  accent: ThemeAccent,
  radius: ThemeRadius,
): ThemeAttributeValues {
  return {
    'data-appearance': appearance,
    'data-accent': accent,
    'data-radius': radius,
  }
}

function readThemeAttributes(root: HTMLElement): ThemeAttributeSnapshot {
  return {
    'data-appearance': root.getAttribute('data-appearance'),
    'data-accent': root.getAttribute('data-accent'),
    'data-radius': root.getAttribute('data-radius'),
  }
}

function applyThemeAttributes(
  root: HTMLElement,
  attributes: ThemeAttributeValues,
) {
  themeAttributeNames.forEach((name) => {
    root.setAttribute(name, attributes[name])
  })
}

function restoreThemeAttributes(
  root: HTMLElement,
  attributes: ThemeAttributeSnapshot,
) {
  themeAttributeNames.forEach((name) => {
    const value = attributes[name]

    if (value === null) {
      root.removeAttribute(name)
    } else {
      root.setAttribute(name, value)
    }
  })
}

function syncGlobalThemeAttributes(root: HTMLElement) {
  const activeEntry = globalThemeEntries.at(-1)

  if (activeEntry) {
    applyThemeAttributes(root, activeEntry.values)
    return
  }

  if (previousGlobalThemeAttributes) {
    restoreThemeAttributes(root, previousGlobalThemeAttributes)
    previousGlobalThemeAttributes = null
  }
}

export function ThemeProvider({
  scope = 'subtree',
  appearance = 'dark',
  accent = 'violet',
  radius = 'md',
  children,
  className,
  style,
  ...props
}: ThemeProviderProps) {
  const globalEntryRef = useRef<GlobalThemeEntry | null>(null)
  const themeAttributes = getThemeAttributeValues(appearance, accent, radius)

  useIsomorphicLayoutEffect(() => {
    if (scope !== 'global' || typeof document === 'undefined') return

    const root = document.documentElement
    const entry: GlobalThemeEntry = {
      id: Symbol('caindev-ui-theme'),
      values: themeAttributes,
    }

    if (globalThemeEntries.length === 0) {
      previousGlobalThemeAttributes = readThemeAttributes(root)
    }

    globalEntryRef.current = entry
    globalThemeEntries.push(entry)
    syncGlobalThemeAttributes(root)

    return () => {
      const entryIndex = globalThemeEntries.findIndex(
        ({ id }) => id === entry.id,
      )

      if (entryIndex !== -1) {
        globalThemeEntries.splice(entryIndex, 1)
      }

      globalEntryRef.current = null
      syncGlobalThemeAttributes(root)
    }
  }, [scope])

  useIsomorphicLayoutEffect(() => {
    if (scope !== 'global' || typeof document === 'undefined') return

    const entry = globalEntryRef.current

    if (!entry) return

    entry.values = themeAttributes
    syncGlobalThemeAttributes(document.documentElement)
  }, [scope, appearance, accent, radius])

  if (scope === 'global') {
    return <>{children}</>
  }

  return (
    <div
      {...props}
      data-appearance={appearance}
      data-accent={accent}
      data-radius={radius}
      className={className}
      style={style}>
      {children}
    </div>
  )
}
