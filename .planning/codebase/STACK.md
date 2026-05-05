# Technology Stack

**Analysis Date:** 2026-05-05

## Languages

**Primary:**
- TypeScript 5.x - Full type safety throughout the application
- Vue 3.5.33 - Component framework

**Secondary:**
- SCSS - Styling with variables and mixins

## Runtime

**Environment:**
- Node.js 20.x+ (via pnpm)

**Package Manager:**
- pnpm 10.33.2 - Lockfile present (`pnpm-lock.yaml`)
- Command: `pnpm install`

## Frameworks

**Core:**
- Nuxt 4.4.4 - Full-stack Vue framework with SSR/SSG support
- Vue Router 5.0.6 - Client-side routing
- Pinia 3.0.4 - State management (via @pinia/nuxt 0.11.3)

**Testing:**
- Not configured

**Build/Dev:**
- Vite 5.x - Build tool (included via Nuxt)
- Sass 1.99.0 - SCSS preprocessing

## Key Dependencies

**Critical:**
- `@nuxtjs/i18n` 10.3.0 - Internationalization (English, Italian)
- `@nuxt/icon` 2.2.1 - Icon system
- `@nuxt/image` 2.0.0 - Image optimization
- `@nuxt/fonts` 0.14.0 - Font optimization (Google Fonts)
- `@nuxt/eslint` 1.15.2 - Linting integration
- `eslint` 10.3.0 - Code quality

**Infrastructure:**
- None (client-side only, no server-side database or external services)

## Configuration

**Environment:**
- No `.env` file present - No environment variables required
- Application uses hardcoded configurations (API base URL: `https://eldenring.fanapis.com/api`)

**Build:**
- `nuxt.config.ts` - Main Nuxt configuration
- `tsconfig.json` - TypeScript configuration (references Nuxt-generated configs)
- `eslint.config.mjs` - ESLint configuration

## Platform Requirements

**Development:**
- Node.js 20.x or higher
- pnpm 10.x
- Run `pnpm install` then `pnpm dev` for development server at `http://localhost:3000`

**Production:**
- Can be deployed to any Node.js hosting (Vercel, Netlify, Cloudflare Pages, etc.)
- Run `pnpm build` to create production build
- Run `pnpm generate` for static site generation (SSG)

---

*Stack analysis: 2026-05-05*