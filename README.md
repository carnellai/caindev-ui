# @caindev/ui

ESM-only React component library for AI product interfaces. Ships typed components, Base UI-backed interaction primitives, AI chat and observability UI, and a compiled stylesheet with Caindev design tokens.

## Install

```sh
pnpm add @caindev/ui
```

`react` and `react-dom` (`>=19.0.0`) are peer dependencies. Install them in your consuming app.

## Basic usage

```tsx
import { Button } from '@caindev/ui'

export function SaveButton() {
  return <Button variant="solid" size="md">Save</Button>
}
```

## Stylesheet import

Import the compiled stylesheet once in your app entry point:

```ts
import '@caindev/ui/styles.css'
```

The stylesheet provides:

- Compiled component styles and design-token-driven utility output used by the package
- Design tokens (typography, spacing, radii, color palette) in `:root`
- `[data-appearance]`, `[data-accent]`, and `[data-radius]` theme overrides
- All component-specific `.cd-*` styles

The stylesheet includes a minimal baseline:

- `box-sizing: border-box` applied to `*`, `::before`, and `::after`
- `body` margin reset to `0`
- `body` min-height set to `100dvh`
- `body` background, foreground color, and font-family sourced from design tokens

Heading and paragraph margins are **not** reset globally; they are normalized only inside component slots (e.g. `Card` header and footer) where it matters.

Non-Vite TypeScript setups may need a CSS module declaration:

```ts
declare module '@caindev/ui/styles.css'
```

## Appearance and theming

Appearance is controlled through the `data-appearance`, `data-accent`, and `data-radius` HTML attributes and the `useAppearance` hook.

### `useAppearance`

The `useAppearance` hook manages the appearance value, persists it to `localStorage`, and applies `data-appearance` to `document.documentElement` automatically.

```tsx
import { useAppearance } from '@caindev/ui'

export function AppearanceToggle() {
  const { appearance, resolvedAppearance, setAppearance, toggle } = useAppearance()

  return (
    <div>
      <p>Mode: {resolvedAppearance}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setAppearance('system')}>Use system</button>
    </div>
  )
}
```

| Value | Type | Description |
|-------|------|-------------|
| `appearance` | `'light' \| 'dark' \| 'system'` | Stored preference |
| `resolvedAppearance` | `'light' \| 'dark'` | Actual resolved value |
| `isReady` | `boolean` | `true` after the first client-side effect has read `localStorage` and the system media query. `appearance` and `resolvedAppearance` are SSR defaults (`'system'` / `'light'`) until then. Gate appearance-dependent UI on this flag to prevent a theme flash. |
| `setAppearance` | `(next: Appearance) => void` | Set preference |
| `toggle` | `() => void` | Toggle between light and dark |

### `data-appearance`

`useAppearance` sets `data-appearance` on `document.documentElement` for you. If you manage appearance yourself, set the attribute on the document root:

```html
<html data-appearance="dark">
```

Portal-based components (`Dialog`, `Toast`) render outside the React subtree and always inherit theme attributes from `document.documentElement`. Nested ancestors can be used for scoped theming only for non-portal content.

### `data-accent`

`data-accent` is a CSS attribute hook. Set it on `document.documentElement` to apply an app-wide accent color. No JavaScript provider is required.

```html
<html data-appearance="dark" data-accent="violet">
```

Supported values: `violet`, `blue`, `emerald`, `crimson`, `teal`, `orange`.

### `data-radius`

`data-radius` is a CSS attribute hook for the global corner-radius scale. Set it on `document.documentElement`:

```html
<html data-appearance="dark" data-accent="violet" data-radius="md">
```

Supported values: `sm`, `md`, `lg`.

### CSS token contract

Theming is CSS-first. All visual properties derive from custom properties defined on `:root` and overridden via `[data-appearance]`, `[data-accent]`, and `[data-radius]` attribute selectors in the compiled stylesheet.

The following tokens are public contract and may be overridden in consumer CSS:

**Background**

| Variable | Role |
|---|---|
| `--color-background` | Page/app background |
| `--color-background-elevated` | Card, popover, dialog surface |
| `--color-background-subtle` | Secondary sections, table headers |

**Foreground**

| Variable | Role |
|---|---|
| `--color-foreground` | Primary text |
| `--color-foreground-muted` | Secondary text, labels |
| `--color-foreground-subtle` | Placeholder, hint, caption |

**Accent**

| Variable | Role |
|---|---|
| `--color-accent` | Primary interactive color (buttons, focus rings, active states) |
| `--color-accent-foreground` | Text on accent-filled surfaces |

**Border and ring**

| Variable | Role |
|---|---|
| `--color-border` | Default border |
| `--color-ring` | Focus ring color |

**Destructive**

| Variable | Role |
|---|---|
| `--color-destructive` | Danger/delete affordances |

**Status tokens** — each family exposes four variants:

| Pattern | Role |
|---|---|
| `--color-{status}` | Solid/icon color |
| `--color-{status}-foreground` | Text on solid status fill |
| `--color-{status}-muted` | Muted background tint |
| `--color-{status}-border` | Status-tinted border |

Status families: `success`, `warning`, `error`, `info`.

Override example — brand accent and a custom success color:

```css
:root {
  --color-accent: #0ea5e9;
  --color-accent-foreground: #fff;
  --color-success: #22c55e;
  --color-success-foreground: #052e16;
  --color-success-muted: rgba(34, 197, 94, 0.12);
  --color-success-border: rgba(34, 197, 94, 0.2);
}
```

Overrides scoped to a single subtree work for non-portal content. Portal-based components (`Dialog`, `Toast`) always read from `document.documentElement`.

## Components

### Button

```tsx
import { Button } from '@caindev/ui'

<Button variant="solid" size="md">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="ghost" loading>Running…</Button>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'solid'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `loading` | `boolean` | `false` |

`ButtonProps` extends all standard `<button>` element props.

### Card

```tsx
import { Button, Card, Input } from '@caindev/ui'

<Card
  header={<h2>New project</h2>}
  footer={<Button>Create</Button>}
  padding="md"
>
  <Input label="Name" placeholder="my-project" />
</Card>
```

| Prop | Type | Default |
|------|------|---------|
| `header` | `ReactNode` | — |
| `footer` | `ReactNode` | — |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` |

`CardProps` extends all standard `<div>` element props. Card normalizes heading and paragraph margins inside its own slots, so `h2` and `p` elements do not require app-level reset CSS.

### Dialog

Portal-based dialogs render outside their React subtree and inherit `data-appearance`, `data-accent`, and `data-radius` from `document.documentElement`.

```tsx
import { Button, Dialog, DialogClose } from '@caindev/ui'

<Dialog
  trigger={<Button variant="outline">Archive run</Button>}
  title="Archive run"
  description="The run stays visible in history."
  actions={
    <>
      <DialogClose>
        <Button variant="ghost">Cancel</Button>
      </DialogClose>
      <Button variant="solid">Confirm</Button>
    </>
  }
>
  Review the run before archiving.
</Dialog>
```

| Prop | Type |
|------|------|
| `trigger` | `ReactNode` |
| `title` | `string` |
| `description` | `string` |
| `children` | `ReactNode` |
| `actions` | `ReactNode` |
| `open` | `boolean` |
| `defaultOpen` | `boolean` |
| `onOpenChange` | `(open: boolean) => void` |

### Toast

Wrap the part of your app that calls `useToast` in `ToastProvider`. Fire toasts from event handlers.

```tsx
import { Button, ToastProvider, useToast } from '@caindev/ui'

function SaveButton() {
  const { success, error } = useToast()

  return (
    <Button
      onClick={async () => {
        try {
          await save()
          success('Saved', 'Your changes were stored.')
        } catch {
          error('Save failed', 'Please try again.')
        }
      }}
    >
      Save
    </Button>
  )
}

export function App() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  )
}
```

`useToast()` returns `{ toast, success, info, error, warning, dismiss }`. The tone-specific helpers accept `(title: string, description?: string)`. The `toast` helper accepts `(title: string, options?: ToastOptions)` where `ToastOptions` includes `description`, `tone`, `duration`, `className`, and `style`.

### Form

```tsx
import { Button, Form, FormField, FormInput } from '@caindev/ui'

<Form onSubmit={handleSubmit} gap="md">
  <FormInput
    name="email"
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
  />
  <FormField name="message" label="Message" hint="Up to 500 characters.">
    <textarea name="message" />
  </FormField>
  <Button type="submit">Send</Button>
</Form>
```

- `Form` — wraps `<form>` with an optional `gap` prop (`'sm' | 'md' | 'lg'`). Gap uses Tailwind spacing tokens (`gap-3` / `gap-4` / `gap-6`).
- `FormInput` — combines a labeled `<input>` with `hint` and `error` display. Accepts all standard `<input>` props including `ref`.
- `FormField` — wraps any control child with `label`, `hint`, and `error` wired via ARIA attributes.

### ThinkingBlock

Collapsible panel for AI chain-of-thought text. Supports streaming mode.

```tsx
import { ThinkingBlock } from '@caindev/ui'

// Static (completed)
<ThinkingBlock content={thinkingText} defaultOpen />

// While streaming
<ThinkingBlock content={partialText} streaming={isStreaming} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `content` | `string` | — | Full or partial thinking text |
| `streaming` | `boolean` | `false` | Forces panel open and shows pulsing indicator while `true` |
| `defaultOpen` | `boolean` | `false` | Initial open state; overridden to `true` while `streaming` is active |
| `label` | `string` | `'Thinking'` | Header label |

**`defaultOpen` / `streaming` interaction:** while `streaming` is `true` the panel is always open regardless of `defaultOpen`. When `streaming` transitions from `true` to `false` the panel stays in the user's last-set state — it does not auto-collapse.

### TokenCost

Compact token and cost display for model calls.

```tsx
import { TokenCost } from '@caindev/ui'

<TokenCost
  model="claude-opus-4"
  inputTokens={1240}
  outputTokens={380}
  totalTokens={1620}
  cost={0.0041}
/>
```

| Prop | Type | Notes |
|---|---|---|
| `inputTokens` | `number` | Renders an `in` row when provided |
| `outputTokens` | `number` | Renders an `out` row when provided |
| `totalTokens` | `number` | Renders a `total` row when provided — including when `inputTokens`/`outputTokens` are also present. No derived sum is computed; pass this explicitly if you want a total row. |
| `cost` | `number` | USD cost, formatted adaptively (2–6 decimal places) |
| `model` | `string` | Displayed verbatim |
| `layout` | `'row' \| 'stack'` | `'row'` — horizontal wrap or vertical stack |

Each prop is independent: omit any you don't have. Passing only `totalTokens` is valid. No row is derived from other rows.

### Table

Scrollable data table with automatic cell truncation.

```tsx
import { Table } from '@caindev/ui'

<Table
  columns={[
    { key: 'name', header: 'Name' },
    { key: 'status', header: 'Status' },
    { key: 'body', header: 'Body', render: (row) => <pre>{row.body}</pre> },
  ]}
  rows={data}
  keyField="id"
  onRowClick={(row) => navigate(`/runs/${row.id}`)}
/>
```

| Prop | Type | Default |
|---|---|---|
| `columns` | `Column<T>[]` | — |
| `rows` | `T[]` | — |
| `keyField` | `string` | `'id'` |
| `onRowClick` | `(row: T) => void` | — |
| `emptyMessage` | `string` | `'No data'` |
| `caption` | `ReactNode` | — |

**Cell truncation** (default rendering, no `render` provided):

- ≤ 56 chars — single-line truncation with `title` tooltip
- 57–200 chars — 2-line clamp
- > 200 chars — no clamping, normal word-wrap

**`render` escape hatch:** provide `column.render` to bypass truncation entirely and return any `ReactNode`. The returned node is rendered without a truncation wrapper.

## TypeScript

Common component prop types and hook result types are exported from the main entry:

```ts
import type {
  OperationStatus,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  CardProps,
  DialogProps,
  ToastOptions,
  ToastTone,
  FormProps,
  FormFieldProps,
  FormInputProps,
  Appearance,
  ResolvedAppearance,
  UseAppearanceResult,
  StepStatus,
  ToolStatus,
  SpanStatus,
  RunStatus,
} from '@caindev/ui'
```

### Status types

All operation lifecycle components share a single canonical type:

```ts
type OperationStatus =
  | 'idle'
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'queued'
  | 'cancelled'
  | 'skipped'
```

`StepStatus`, `ToolStatus`, `SpanStatus`, and `RunStatus` are re-exported aliases for `OperationStatus`. Legacy runtime values `'error'` and `'success'` are silently normalized to `'failed'` and `'completed'` respectively.

### Refs

Interactive components accept `ref` as a regular prop (React 19 ref-as-prop):

| Component | ref target |
|-----------|------------|
| `Button` | `HTMLButtonElement` (via Base UI) |
| `Input` | `HTMLInputElement` (via Base UI) |
| `FormInput` | `HTMLInputElement` |
| `Select` | `HTMLButtonElement` (trigger) |
| `Combobox` | `HTMLInputElement` |
| `PromptInput` | `HTMLTextAreaElement` |

## Styling and customization

- **Token overrides:** All design tokens are CSS custom properties on `:root`. Override them with a higher-specificity selector in your app CSS.
- **Attribute theming:** Set `data-appearance`, `data-accent`, and `data-radius` on `document.documentElement` for app-wide theming. Portal-based components (`Dialog`, `Toast`) always read from `document.documentElement`. Nested ancestors work for scoped theming of non-portal content. No JavaScript provider is required beyond `useAppearance` for automatic persistence.
- **No Tailwind scanning required:** The stylesheet is pre-compiled. Consumers do not need Tailwind installed, configured, or pointed at package source.
- **No shadcn/ui or Radix:** Components are built on [`@base-ui/react`](https://base-ui.com), which is a managed dependency of `@caindev/ui`.

## Versioning

`@caindev/ui` 1.0 follows semantic versioning. The public API — exported component names, prop types, hook signatures, and `data-*` attribute hooks — is stable and will not receive breaking changes without a major version bump.

- Node.js `>=20.19.0` required.
- React 19 peer dependency (`>=19.0.0 <20.0.0`).
- ESM-only package. CommonJS is not supported.
