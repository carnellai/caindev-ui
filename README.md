# @caindev/ui

ESM-only React components for AI product interfaces. The package ships typed React components, Base UI-backed interaction primitives, AI chat and observability UI, and a compiled stylesheet with Caindev theme tokens.

## Install

```sh
pnpm add @caindev/ui
```

`react` and `react-dom` are peer dependencies and should be installed by the consuming app.

## Setup

Import the package stylesheet once in your app entry:

```ts
import '@caindev/ui/styles.css'
```

Then wrap your app with `ThemeProvider`. Use `scope="global"` for normal app-root setup so portal-based components inherit the same theme tokens.

```tsx
import '@caindev/ui/styles.css'

import { Button, ThemeProvider } from '@caindev/ui'

export function App() {
  return (
    <ThemeProvider scope="global" appearance="dark" accent="violet" radius="md">
      <Button>Run evaluation</Button>
    </ThemeProvider>
  )
}
```

Supported appearances are `dark` and `light`.

Supported accents: `violet`, `blue`, `emerald`, `crimson`, `teal`, `orange`.

## Styles

`@caindev/ui/styles.css` is compiled ahead of time. Consumers do not need Tailwind scanning, Tailwind configuration, or package source inclusion.

The stylesheet includes a minimal baseline for clean app rendering:

- global `box-sizing: border-box`
- `body` margin, min-height, background, color, and font-family defaults
- inherited font styles for `button`, `input`, `textarea`, and `select`

This is not full Tailwind Preflight. Consumers still control app layout and broader document styles such as headings, paragraphs, links, lists, and media.

Non-Vite or non-bundler TypeScript setups may need a declaration for the CSS import:

```ts
declare module '@caindev/ui/styles.css'
```

## Card

```tsx
import { Button, Card, Input, ThemeProvider } from '@caindev/ui'

export function ProjectCard() {
  return (
    <ThemeProvider scope="global" appearance="dark" accent="violet" radius="md">
      <Card header={<h2>Project</h2>} footer={<Button>Save</Button>}>
        <Input label="Name" placeholder="Carnell" />
      </Card>
    </ThemeProvider>
  )
}
```

Card normalizes native heading and paragraph margins only inside its own slots, so common `h2` and `p` usage does not require app-level reset CSS.

## Dialogs And Portals

Portal components render outside their React subtree. Use `scope="global"` when using dialogs, drawers, menus, tooltips, selects, or toasts in a full app.

```tsx
import { Button, Dialog, ThemeProvider } from '@caindev/ui'

export function ConfirmDialog() {
  return (
    <ThemeProvider scope="global" appearance="light" accent="blue">
      <Dialog
        trigger={<Button variant="outline">Open dialog</Button>}
        title="Archive run"
        description="This keeps the run available in history.">
        Review the run details before archiving.
      </Dialog>
    </ThemeProvider>
  )
}
```

## Toasts

Wrap the part of your app that calls `useToast` in `ToastProvider`. Trigger toasts from event handlers.

```tsx
import { Button, ThemeProvider, ToastProvider, useToast } from '@caindev/ui'

function SaveButton() {
  const { success } = useToast()

  return (
    <Button onClick={() => success('Saved', 'Your changes were stored.')}>
      Save
    </Button>
  )
}

export function App() {
  return (
    <ThemeProvider scope="global" appearance="dark" accent="emerald">
      <ToastProvider>
        <SaveButton />
      </ToastProvider>
    </ThemeProvider>
  )
}
```

## Package Notes

- ESM-only package.
- React 19 peer dependency.
- `@base-ui/react` is managed by `@caindev/ui`.
- Compiled stylesheet export: `@caindev/ui/styles.css`.
