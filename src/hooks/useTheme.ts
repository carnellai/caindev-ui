import { useContext } from 'react'
import { ThemeContext } from '../components/Theme'
import type { ThemeContextValue } from '../components/Theme'

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (ctx === null) {
    throw new Error(
      'useTheme must be used within a <Theme> provider. ' +
        'Wrap your application root with <Theme> from @caindev/ui.',
    )
  }
  return ctx
}
