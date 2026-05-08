# Changelog

## 0.3.0

### API consistency

- Normalized runtime status vocabulary across process-oriented components.
  - Prefer `completed` over `complete`.
  - Prefer `completed` over `success` for runtime status.
  - Prefer `failed` over `error` for runtime status.
- Added compatibility aliases for older runtime status values where applicable:
  - `complete` maps to `completed`.
  - `success` maps to `completed`.
  - `error` maps to `failed`.
- Cleaned up `CommandPalette` controlled/uncontrolled open-state behavior.
  - `open`, `defaultOpen`, and `onOpenChange` now follow a single controllable-state pattern.
  - Public API remains unchanged.

### Semantic color props

- Added additive `tone` support for semantic color/severity where applicable.
- Existing semantic `variant` values remain supported for compatibility.
- `tone` is now the preferred prop for semantic severity/color, while `variant` remains reserved for visual structure/style.

### Component polish

- Refined `Tabs` active indicator so it is thinner, shorter, and less visually heavy.
- Improved `Accordion` content alignment and vertical rhythm.
- Improved `TokenCost` layout so model, input tokens, output tokens, and cost render as distinct metric groups.
- Improved `StatDelta` duration formatting to avoid duplicate unit output such as `ms ms`.

### Docs

- Updated docs examples to prefer canonical runtime statuses such as `completed` and `failed`.
- Updated docs to prefer `tone` for semantic color examples where supported.
- Fixed the main Documentation nav target so it opens Getting Started instead of the Button component page.
- Refreshed API notes for the 0.3.0 cleanup.

### Validation

- Validated the package through the external `caindev-ui-smoke` consumer fixture using a packed tarball.
- Confirmed package usage through the public imports:
  - `@caindev/ui`
  - `@caindev/ui/styles.css`

## 0.2.0

- Added external consumer smoke fixture as release gate: packed tarball is validated in a clean Vite + React 19 app before each release.
- Improved package export and type readiness: `DialogClose` now carries an explicit `typeof BaseDialog.Close` type annotation so consumers get full prop inference without importing Base UI directly.
- Hardened `Skeleton` shimmer for external consumers: replaced Tailwind `inset-0` utility with inline `style={{ inset: 0 }}` so the shimmer is always positioned correctly regardless of whether consumer builds emit that utility class.
- Audited `package.json`: removed duplicate `@base-ui/react` entry from `devDependencies` (it is already a runtime `dependency`), keeping the dependency graph clean for consumers.
- `ThemeProvider` and global portal guidance: consumers should render `<ThemeProvider>` at the React tree root and mount overlays (Dialog, Drawer, CommandPalette, Toast, Tooltip) outside content-stacking contexts to avoid filter/transform compositing issues.
- Drawer/Dialog/overlay hardening carried forward from the 0.1.x line: stable viewport geometry, Base UI `modal="trap-focus"` for Drawer, scrim anchoring, and layering resets.
- Scroll-jump fixes carried forward from 0.1.x: `preventScroll` on PromptInput pointer-focus, `type="button"` enforcement on internal controls.
- Docs refreshed to demonstrate real npm installation and external-consumer usage patterns.

## 0.1.3

- Fixed Drawer viewport positioning/visibility in consumer apps.
- Fixed Drawer layering: use Base UI `modal="trap-focus"` (avoids the extra fullscreen `InternalBackdrop` only mounted when `modal={true}`) plus `.cd-drawer-*` / inline filter resets so the sheet does not composite inside a blurred modal stack; left/right scrims are width-clipped so dimming applies only beside the sheet (bottom drawer still uses a fullscreen dim-only scrim).

## 0.1.2

- Fixed Drawer and CommandPalette portal overlays to use explicit viewport geometry so they remain anchored and visible even if utility classes are not emitted by consumer builds.
- Removed PromptInput click-focus scroll jumps by applying focus with `preventScroll` when pointer-focusing the textarea.
- Fixed internal action controls that could trigger form scroll/submit behavior by enforcing `type="button"` on Pagination, NumberField, and CommandPalette internal buttons.
- Improved Tooltip placement consistency by explicitly centering alignment to the active trigger anchor.
- Increased dark-mode Skeleton base and shimmer contrast for better visibility on dark surfaces.
- Updated default Table cell behavior to keep rows compact (truncate short content, 2-line clamp for medium content) while preserving wrap for longer descriptive values.
- Hardened Dialog scrim anchoring with explicit fixed viewport geometry so backdrop visibility is stable in consumer builds.
- Reinforced Select and Combobox option state contrast by styling selected rows with active surface/text tokens in both themes.
- Increased Slider contrast in dark mode by thickening the track, strengthening inactive track border/surface contrast, and ensuring the filled indicator remains clearly visible.

## 0.1.1

- Added a minimal global baseline to `@caindev/ui/styles.css` for clean consumer apps.
- Moved `@base-ui/react` to package-managed runtime dependencies.
- Hardened default styles for core controls, overlays, tables, tabs, and feedback components.
- Fixed Toast and anchored overlay portal positioning in clean consumer apps.
- Normalized Card-owned slot spacing so native headings and paragraphs render cleanly without a global reset.
- Stabilized `useToast()` return values to avoid effect dependency loops in StrictMode-prone usage.
- Updated README consumer setup, portal, toast, theme, and stylesheet guidance.

## 0.1.0

- Initial `@caindev/ui` React component package.
- Added compiled stylesheet export at `@caindev/ui/styles.css`.
- Added `ThemeProvider` with light and dark token support.
- Added Base UI-based interaction components.
- Added AI chat and generation interface components.
- Added AI observability components for runs, traces, tool calls, metrics, and evaluation UI.
