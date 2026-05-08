# Changelog

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
