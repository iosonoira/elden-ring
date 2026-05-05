# External Integrations

**Analysis Date:** 2026-05-05

## APIs & External Services

**Game Data API:**
- **Elden Ring Fan API** (`eldenring.fanapis.com`) - External API for game item data
  - SDK/Client: Native `$fetch` (Nuxt built-in) or `ofetch`
  - Base URL: `https://eldenring.fanapis.com/api`
  - Endpoints: `/weapons`, `/armors`, `/talismans`, `/sorceries`, `/ashes`, `/spirits`
  - Purpose: Provides wiki-style item details (images, descriptions, stats)
  - Used in: `app/composables/useEldenRingApi.ts`, `app/stores/useWikiStore.ts`

**Google Fonts:**
- Font Provider: Google Fonts (via @nuxt/fonts)
  - Cinzel (weights: 400, 700, 900)
  - Noto Serif (weights: 400, 700, styles: normal/italic)
  - Lora (weights: 400, 500, styles: normal/italic)
  - Manrope (weights: 300, 400, 600)
  - Space Grotesk (weights: 300, 400, 700)
  - Configuration: `nuxt.config.ts` lines 18-29

## Data Storage

**Databases:**
- None - No database integration

**File Storage:**
- Local filesystem only - No cloud storage

**Caching:**
- In-memory cache via Pinia store (`useWikiStore`) - Items cached in `cache` ref
- No persistent cache (browser storage not used)

## Authentication & Identity

**Auth Provider:**
- None - Application does not require authentication
- All functionality operates anonymously

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service configured

**Logs:**
- Console logging via `console.error` - Used in API error handlers in `app/stores/useWikiStore.ts` and `app/composables/useEldenRingApi.ts`

## CI/CD & Deployment

**Hosting:**
- Not specified - Project can be deployed to any Node.js-compatible hosting
- Vercel, Netlify, Cloudflare Pages, or any Node.js server

**CI Pipeline:**
- None detected - No GitHub Actions, GitLab CI, or other CI configuration found

## Environment Configuration

**Required env vars:**
- None - Application works without environment variables
- All configuration is hardcoded in source files

**Secrets location:**
- N/A - No secrets used

## Webhooks & Callbacks

**Incoming:**
- None - No webhook endpoints

**Outgoing:**
- None - No outgoing webhooks

---

*Integration audit: 2026-05-05*