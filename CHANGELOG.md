# Changelog

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
