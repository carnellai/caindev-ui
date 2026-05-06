# @caindev/ui

ESM-only React components for AI product interfaces. The package ships typed React components, Base UI-backed interaction primitives, AI chat and observability UI, and a compiled stylesheet with Caindev theme tokens.

## Install

```sh
pnpm add @caindev/ui @base-ui/react
```

Install `react` and `react-dom` in the consuming app if they are not already present. This package is prepared for npm publishing, but availability depends on the package having been published to the registry.

## Styles

Import the package stylesheet once in your app entry:

```ts
import '@caindev/ui/styles.css'
```

Consumers do not need Tailwind scanning, Tailwind configuration, or package source inclusion. The stylesheet is compiled ahead of time and does not include Tailwind Preflight or a global reset.

## Usage

```tsx
import '@caindev/ui/styles.css'

import { Button, Card, ThemeProvider } from '@caindev/ui'

export function App() {
  return (
    <ThemeProvider appearance="dark" accent="violet" radius="md">
      <Card
        header={<h2>Generation run</h2>}
        footer={<Button>Review output</Button>}>
        Ready for evaluation.
      </Card>
    </ThemeProvider>
  )
}
```

## ThemeProvider

`ThemeProvider` sets Caindev theme attributes and tokens for dark or light UI. It writes `data-appearance`, `data-accent`, and `data-radius`.

Supported accents: `violet`, `blue`, `emerald`, `crimson`, `teal`, `orange`.

Subtree scope applies theme attributes to the provider element:

```tsx
import { ThemeProvider } from '@caindev/ui'

export function Panel() {
  return (
    <ThemeProvider scope="subtree" appearance="light" accent="blue">
      <YourInterface />
    </ThemeProvider>
  )
}
```

Global scope applies theme attributes to `document.documentElement` while the provider is mounted:

```tsx
import { ThemeProvider } from '@caindev/ui'

export function Root() {
  return (
    <ThemeProvider scope="global" appearance="dark" accent="violet">
      <YourApp />
    </ThemeProvider>
  )
}
```

Use `scope="global"` when portal-based components need access to the same theme tokens outside the React subtree, such as dialogs, drawers, menus, tooltips, and toasts.

Advanced users can apply `data-appearance`, `data-accent`, and `data-radius` manually to an element for isolated rendering, tests, Storybook stories, or embedded widgets. Prefer `ThemeProvider` for normal app usage.

## Package Notes

- ESM-only package.
- React 19 peer dependency.
- `@base-ui/react` peer dependency.
- Compiled stylesheet export: `@caindev/ui/styles.css`.
- Dark and light appearances are supported through `ThemeProvider` and CSS tokens.
