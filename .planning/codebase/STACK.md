# Technology Stack

**Analysis Date:** 2026-05-06

## Languages

**Primary:**
- TypeScript - All application code (.ts, .vue files)

**Secondary:**
- SCSS - Styling via Sass preprocessor

## Runtime

**Environment:**
- Node.js (via pnpm)

**Package Manager:**
- pnpm 10.33.2
- Lockfile: `pnpm-lock.yaml` (not committed, inferred from packageManager field)

## Frameworks

**Core:**
- Nuxt 4.4.4 - Vue 3 meta-framework with SSR/SSG
- Vue 3.5.33 - UI framework
- Vue Router 5.0.6 - Routing

**State Management:**
- Pinia 3.0.4 - Vue store
- @pinia/nuxt 0.11.3 - Nuxt integration

**Testing:**
- Not detected

**Build/Dev:**
- Vite (bundled with Nuxt)
- Sass 1.99.0 - SCSS preprocessing

## Key Dependencies

**Nuxt Modules:**
- @nuxt/eslint 1.15.2 - Linting
- @nuxt/fonts 0.14.0 - Google Fonts integration
- @nuxt/icon 2.2.1 - Icon component (Iconify)
- @nuxt/image 2.0.0 - Image optimization
- @nuxtjs/i18n 10.3.0 - Internationalization

**Utilities:**
- vue (^3.5.33) - Framework
- vue-router (^5.0.6) - Routing

## Configuration

**Environment:**
- No .env files committed (not required for this app)
- No external secrets

**Build:**
- `nuxt.config.ts` - Main Nuxt configuration
- `tsconfig.json` - TypeScript project references (Nuxt-managed)

## Platform Requirements

**Development:**
- Node.js compatible with Nuxt 4
- pnpm package manager

**Production:**
- Nuxt SSR/SSG deployment
- No database required

---

*Stack analysis: 2026-05-06*