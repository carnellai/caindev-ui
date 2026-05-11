import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { ToastProvider } from './Toast'
import { TooltipProvider } from './Tooltip'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Appearance = 'dark' | 'light' | 'system'
export type ResolvedAppearance = 'dark' | 'light'
export type AccentPreset =
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'crimson'
  | 'teal'
  | 'orange'
export type RadiusPreset = 'sm' | 'md' | 'lg'

export type ThemeContextValue = {
  appearance: Appearance
  resolvedAppearance: ResolvedAppearance
  accent: AccentPreset
  radius: RadiusPreset
  setAppearance: (v: Appearance) => void
  setAccent: (v: AccentPreset) => void
  setRadius: (v: RadiusPreset) => void
  toggle: () => void
}

export type ThemeProps = {
  children: ReactNode
  appearance?: Appearance
  accent?: AccentPreset
  radius?: RadiusPreset
  storageKey?: string
  disablePersistence?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_APPEARANCE: ResolvedAppearance = 'dark'
const DEFAULT_ACCENT: AccentPreset = 'violet'
const DEFAULT_RADIUS: RadiusPreset = 'md'
const DEFAULT_STORAGE_KEY = 'caindev-ui-theme'

const VALID_APPEARANCES: readonly string[] = ['dark', 'light', 'system']
const VALID_ACCENTS: readonly string[] = [
  'violet',
  'blue',
  'emerald',
  'crimson',
  'teal',
  'orange',
]
const VALID_RADII: readonly string[] = ['sm', 'md', 'lg']

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const ThemeContext = createContext<ThemeContextValue | null>(null)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type StoredBlob = { appearance?: unknown; accent?: unknown; radius?: unknown }

function readStorage(key: string): StoredBlob | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as StoredBlob
  } catch {
    return null
  }
}

function resolveAppearance(appearance: Appearance): ResolvedAppearance {
  if (appearance !== 'system') return appearance
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? 'dark' : 'light'
  }
  return DEFAULT_APPEARANCE
}

function initThemeState(
  storageKey: string,
  disablePersistence: boolean,
  appearanceProp: Appearance | undefined,
  accentProp: AccentPreset | undefined,
  radiusProp: RadiusPreset | undefined,
) {
  const blob = disablePersistence ? null : readStorage(storageKey)
  const appearance = (blob && VALID_APPEARANCES.includes(blob.appearance as string))
    ? (blob.appearance as Appearance)
    : (appearanceProp ?? DEFAULT_APPEARANCE)
  const accent = (blob && VALID_ACCENTS.includes(blob.accent as string))
    ? (blob.accent as AccentPreset)
    : (accentProp ?? DEFAULT_ACCENT)
  const radius = (blob && VALID_RADII.includes(blob.radius as string))
    ? (blob.radius as RadiusPreset)
    : (radiusProp ?? DEFAULT_RADIUS)
  return { appearance, accent, radius }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Theme({
  children,
  appearance: appearanceProp,
  accent: accentProp,
  radius: radiusProp,
  storageKey = DEFAULT_STORAGE_KEY,
  disablePersistence = false,
}: ThemeProps) {
  const initialRef = useRef<ReturnType<typeof initThemeState> | null>(null)
  if (initialRef.current === null) {
    initialRef.current = initThemeState(storageKey, disablePersistence, appearanceProp, accentProp, radiusProp)
  }
  const initial = initialRef.current

  const [appearance, setAppearanceState] = useState<Appearance>(initial.appearance)
  const [accent, setAccentState] = useState<AccentPreset>(initial.accent)
  const [radius, setRadiusState] = useState<RadiusPreset>(initial.radius)

  const [resolvedAppearance, setResolvedAppearance] =
    useState<ResolvedAppearance>(() => resolveAppearance(appearance))

  // Track whether this is the initial mount (skip transition suppression)
  const mountedRef = useRef(false)
  const prevResolvedRef = useRef(resolvedAppearance)

  // -------------------------------------------------------------------------
  // Props-as-controlled-overrides
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (appearanceProp !== undefined) {
      setAppearanceState(prev => prev !== appearanceProp ? appearanceProp : prev)
    }
  }, [appearanceProp])

  useEffect(() => {
    if (accentProp !== undefined) {
      setAccentState(prev => prev !== accentProp ? accentProp : prev)
    }
  }, [accentProp])

  useEffect(() => {
    if (radiusProp !== undefined) {
      setRadiusState(prev => prev !== radiusProp ? radiusProp : prev)
    }
  }, [radiusProp])

  // -------------------------------------------------------------------------
  // Effect 1: DOM attributes + transition suppression
  // -------------------------------------------------------------------------

  useEffect(() => {
    const el = document.documentElement
    el.setAttribute('data-appearance', resolvedAppearance)
    el.setAttribute('data-accent', accent)
    el.setAttribute('data-radius', radius)

    if (
      mountedRef.current &&
      prevResolvedRef.current !== resolvedAppearance
    ) {
      const style = document.createElement('style')
      style.textContent = '* { transition: none !important }'
      document.head.appendChild(style)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          style.remove()
        })
      })
    }

    prevResolvedRef.current = resolvedAppearance
    mountedRef.current = true
  }, [resolvedAppearance, accent, radius])

  // -------------------------------------------------------------------------
  // Effect 2: matchMedia listener
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (appearance !== 'system') {
      setResolvedAppearance(resolveAppearance(appearance))
      return
    }

    const mql = window.matchMedia(COLOR_SCHEME_QUERY)
    setResolvedAppearance(mql.matches ? 'dark' : 'light')

    const handler = (e: MediaQueryListEvent) => {
      setResolvedAppearance(e.matches ? 'dark' : 'light')
    }

    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [appearance])

  // -------------------------------------------------------------------------
  // Effect 3: Persistence
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (disablePersistence) return
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ appearance, accent, radius }),
      )
    } catch {
      // Storage access may be denied; in-memory state still applies.
    }
  }, [appearance, accent, radius, storageKey, disablePersistence])

  // -------------------------------------------------------------------------
  // Context value
  // -------------------------------------------------------------------------

  const toggle = useCallback(() => {
    setAppearanceState(resolvedAppearance === 'dark' ? 'light' : 'dark')
  }, [resolvedAppearance])

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      appearance,
      resolvedAppearance,
      accent,
      radius,
      setAppearance: setAppearanceState,
      setAccent: setAccentState,
      setRadius: setRadiusState,
      toggle,
    }),
    [appearance, resolvedAppearance, accent, radius, toggle],
  )

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <ThemeContext value={contextValue}>
      <ToastProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ToastProvider>
    </ThemeContext>
  )
}
