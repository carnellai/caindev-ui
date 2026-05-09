import { useCallback, useEffect, useMemo, useState } from 'react'

export type Appearance = 'light' | 'dark' | 'system'
export type ResolvedAppearance = 'light' | 'dark'

export type UseAppearanceResult = {
  appearance: Appearance
  resolvedAppearance: ResolvedAppearance
  setAppearance: (next: Appearance) => void
  toggle: () => void
}

const appearanceStorageKey = '@caindev/ui:appearance'
const colorSchemeQuery = '(prefers-color-scheme: dark)'

function isAppearance(value: string | null): value is Appearance {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getSystemAppearance(): ResolvedAppearance {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'light'
  }

  return window.matchMedia(colorSchemeQuery).matches ? 'dark' : 'light'
}

function readStoredAppearance(): Appearance {
  if (typeof window === 'undefined') {
    return 'system'
  }

  try {
    const storedAppearance = window.localStorage.getItem(appearanceStorageKey)
    return isAppearance(storedAppearance) ? storedAppearance : 'system'
  } catch {
    return 'system'
  }
}

function persistAppearance(appearance: Appearance) {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(appearanceStorageKey, appearance)
  } catch {
    // Browsers can deny storage access; the in-memory preference still applies.
  }
}

function applyAppearance(appearance: ResolvedAppearance) {
  if (typeof document === 'undefined') return

  document.documentElement.setAttribute('data-appearance', appearance)
}

export function useAppearance(): UseAppearanceResult {
  const [appearance, setAppearanceState] = useState<Appearance>('system')
  const [resolvedAppearance, setResolvedAppearance] =
    useState<ResolvedAppearance>('light')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const storedAppearance = readStoredAppearance()
    const nextResolvedAppearance =
      storedAppearance === 'system' ? getSystemAppearance() : storedAppearance

    setAppearanceState(storedAppearance)
    setResolvedAppearance(nextResolvedAppearance)
    applyAppearance(nextResolvedAppearance)
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return

    const nextResolvedAppearance =
      appearance === 'system' ? getSystemAppearance() : appearance

    setResolvedAppearance(nextResolvedAppearance)
    persistAppearance(appearance)
    applyAppearance(nextResolvedAppearance)

    if (
      appearance !== 'system' ||
      typeof window === 'undefined' ||
      !window.matchMedia
    ) {
      return
    }

    const colorScheme = window.matchMedia(colorSchemeQuery)
    const handleChange = () => {
      const changedAppearance = colorScheme.matches ? 'dark' : 'light'
      setResolvedAppearance(changedAppearance)
      applyAppearance(changedAppearance)
    }

    colorScheme.addEventListener('change', handleChange)

    return () => {
      colorScheme.removeEventListener('change', handleChange)
    }
  }, [appearance, isReady])

  const setAppearance = useCallback((next: Appearance) => {
    setAppearanceState(next)
  }, [])

  const toggle = useCallback(() => {
    setAppearanceState(resolvedAppearance === 'dark' ? 'light' : 'dark')
  }, [resolvedAppearance])

  return useMemo(
    () => ({
      appearance,
      resolvedAppearance,
      setAppearance,
      toggle,
    }),
    [appearance, resolvedAppearance, setAppearance, toggle],
  )
}
