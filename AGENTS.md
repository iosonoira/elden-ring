# AGENTS.md

## Project Overview

Nuxt 4 project with a dark fantasy design system ("Gilded Reliquary"). Minimal starter — only `app/app.vue` exists so far.

## Developer Commands

```bash
pnpm dev      # Start dev server on http://localhost:3000
pnpm build    # Production build
pnpm preview  # Preview production build
```

pnpm is the package manager (pnpm-lock.yaml present, not npm/yarn).

## Architecture

- **Entry point**: `app/app.vue`
- **Config**: `nuxt.config.ts` (Nuxt 4 compatibility date: 2025-07-15)
- **TypeScript**: References `.nuxt/tsconfig.*.json` files (don't edit directly)

## Modules

- `@pinia/nuxt` — State management
- `@nuxt/eslint` — Linting
- `@nuxt/image` — Image optimization
- `@nuxt/icon` — Icon component
- `@nuxt/fonts` — Font optimization
- `@nuxtjs/i18n` — Internationalization

## Design System

See `DESIGN.md` for the "Gilded Reliquary" dark fantasy design spec (colors, typography, elevation rules).

## Linting

Run via `@nuxt/eslint` module — config at root `eslint.config.mjs` extends `.nuxt/eslint.config.mjs`. No separate lint script; integrate via IDE or `npx eslint .`.

## Post-install

`postinstall` runs `nuxt prepare` to generate `.nuxt` types and config.