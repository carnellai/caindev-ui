# @caindev/ui

React UI primitives for Caindev.

This package is currently scaffolded for the first component batch. It ships an ESM-only library entry and a package stylesheet containing the shared dark-default token contract.

## Local Development

```sh
pnpm install
pnpm typecheck
pnpm build
```

## Usage

Import the package CSS once in your app entry:

```ts
import '@caindev/ui/styles.css';
```

Components will be exported from `@caindev/ui` after the first component batch is copied into this package.
