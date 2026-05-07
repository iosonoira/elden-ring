# External Integrations

**Analysis Date:** 2026-05-06

## APIs & External Services

**Wiki Data API:**
- Elden Ring Fan API - External wiki data source
  - Base URL: `https://eldenring.fanapis.com/api`
  - SDK/Client: Native `$fetch` (Nuxt/ofetch)
  - Categories: weapons, armors, talismans, sorceries, ashes, spirits
  - No authentication required

## Data Storage

**Client-Side Persistence:**
- LocalStorage via Pinia persistence plugin (save data)
- No server-side database

**File Storage:**
- Static JSON assets in `app/assets/data/`
- Local build assets, no external CDN

**Caching:**
- Nuxt `useAsyncData` with built-in cache

## Authentication & Identity

**Not Applicable:**
- No authentication system
- No user accounts or login

## Monitoring & Observability

**Error Tracking:**
- None integrated

**Logs:**
- Console.log in development mode only (`import.meta.dev`)

## CI/CD & Deployment

**Hosting:**
- Not detected (no deployment config)

**CI Pipeline:**
- Not detected

## Environment Configuration

**Required env vars:**
- None (public API only)

**Secrets location:**
- None required

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- Fan API calls only

---

*Integration audit: 2026-05-06*