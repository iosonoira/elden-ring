# Phase 1: Navigation & State Persistence — Research

**Researched:** 2026-05-06  
**Domain:** Vue Router navigation guards + Pinia state persistence in Nuxt 4  
**Confidence:** HIGH

## Summary

Phase 1 requires smart sidebar navigation based on save file state + state persistence across route navigation. Research confirms:

1. **State persistence**: Pinia in Nuxt 4 persists automatically across client-side navigation — no plugin needed for in-memory persistence. `useSaveStore` already structured correctly with `isLoaded` and `selectedCharacterIndex` refs.

2. **Navigation guards**: Use Nuxt middleware with `defineNuxtRouteMiddleware` + `router.beforeEach`. Guard checks `useSaveStore().isLoaded` before allowing navigation to `/inventory/*` routes.

3. **Lazy-loaded routes**: Nuxt auto-lazy-loads pages under `pages/`. Guards run before async component resolves — need to check store state, not route metadata availability.

4. **Edge cases**: SSR hydration, cache-clearing on hard refresh, route pre-fetch timing.

**Primary recommendation:** Implement hybrid approach from D-01 (sidebar click handlers check isLoaded) + optional global middleware for direct URL access.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Save file state | Pinia store | Client | `useSaveStore` manages isLoaded, selectedCharacterIndex |
| Navigation guard | Nuxt middleware | Vue Router | `defineNuxtRouteMiddleware` runs before each route |
| Sidebar redirects | Component logic | — | Click handlers check store state before `navigateTo()` |
| Route meta | Nuxt config | — | `definePageMeta` sets per-route options |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| pinia | 3.0.4 | State management | Vue official — already installed |
| @pinia/nuxt | 0.11.3 | Nuxt integration | Auto-imports stores, handles SSR |
| vue-router | 5.0.6 | Routing | Vue 3 official — already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| pinia-plugin-persistedstate | — | localStorage/cookie persistence | Only if D-03 changes to require persistence beyond navigation |

**Installation:**  
Already installed — no changes needed to package.json.

**Verification:**
```bash
npm view pinia version    # 3.0.4
npm view vue-router version # 5.0.6
```

---

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Client                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ AppSidebar   │───▶│ useSaveStore  │◀───│ Navigation       │  │
│  │ (NuxtLink)  │    │ (Pinia)      │    │ Guard/Middleware  │  │
│  └──────────────┘    └──────────────┘    └──────────────────┘  │
│         │                     │                     │              │
│         ▼                     ▼                     ▼              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ /archives  │    │ /inventory   │    │ Route: /inventory│  │
│  │ (no guard) │    │ (guard on)   │    │ (redirect if     │  │
│  └──────────────┘    └──────────────┘    │ !isLoaded)      │  │
│                                        └──────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### Pattern 1: Nuxt Route Middleware Guard

```typescript
// app/middleware/save-guard.ts
export default defineNuxtRouteMiddleware((to) => {
  const store = useSaveStore()
  
  // Check if navigating to inventory routes without save loaded
  if (to.path.startsWith('/inventory') && !store.isLoaded) {
    return navigateTo('/archives')
  }
})
```

**Source:** [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)  
**Source:** [Nuxt Middleware](https://nuxt.com/docs/4.x/getting-started/routing#middleware)

### Pattern 2: Sidebar Click Handler with Check

```vue
<!-- AppSidebar.vue -->
<script setup lang="ts">
const store = useSaveStore()

function handleInventoryClick() {
  if (store.isLoaded) {
    navigateTo(`/inventory/${store.characters[store.selectedCharacterIndex]?.name || 'all'}`)
  } else {
    navigateTo('/archives')
  }
}
</script>

<template>
  <button @click="handleInventoryClick">
    Inventory
  </button>
</template>
```

**Source:** [Nuxt navigateTo](https://nuxt.com/docs/4.x/getting-started/routing#navigation)

### Pattern 3: Route Meta with definePageMeta

```vue
<!-- app/pages/inventory/[category].vue -->
<script setup lang="ts">
definePageMeta({
  requiresSave: true
})
</script>
```

### Pattern 4: First-Visit Redirect on Index

```vue
<!-- app/pages/index.vue -->
<script setup lang="ts">
const store = useSaveStore()

onMounted(() => {
  if (store.isLoaded && store.selectedCharacterIndex !== null) {
    // User returning with active session — go to their last category
    const char = store.characters[store.selectedCharacterIndex]
    navigateTo(`/inventory/${char?.name || 'all'}`)
  }
  // Otherwise stay on index for file upload
})
</script>
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Manual state serialization | Write custom localStorage code | `pinia-plugin-persistedstate` if needed | SSR handling, hydration safety |
| Route guard registration | Create router.ts manually | Nuxt middleware auto-discovery | Nuxt handles file scanning |
| State access in guards | Pass pinia manually | `useSaveStore()` in middleware | `@pinia/nuxt` auto-injects |

**Key insight:** Nuxt 4 with @pinia/nuxt module handles injection automatically. No manual pinia instance passing needed in middleware, plugins, or component setup.

---

## Runtime State Inventory

> Not applicable — Phase 1 is navigation/state changes, no rename/refactor.

---

## Common Pitfalls

### Pitfall 1: Navigation Guard Fires Before Store Hydrates
**What goes wrong:** Guard runs on initial navigation, but Pinia store hasn't hydrated from server state yet. `store.isLoaded` returns `false` even though user just uploaded a save.
**Why it happens:** SSR sends initial HTML with no client state. Client hydrates after guard already fired.
**How to avoid:** Use `onBeforeMount` or check `process.client` in middleware. Alternative: check `from === '#'` (initial navigation) and allow first access.
**Warning signs:** Users stuck on Archives after uploading file, even though save loaded.

### Pitfall 2: Lazy-Loaded Route Not Resolved in Guard
**What goes wrong:** Guard tries to access component state that lazy-loads with the route. Component hasn't loaded yet.
**Why it happens:** Nuxt lazy-loads pages under `pages/` automatically. Guard runs before chunk loads.
**How to avoid:** Don't depend on page component state in guards. Check only Pinia store state.
**Warning signs:** Errors about undefined components in navigation flow.

### Pitfall 3: Hard Refresh Clears Pinia State
**What goes wrong:** User does Ctrl+Shift+R or clears site data. Pinia in-memory state resets. `isLoaded` becomes `false`.
**Why it happens:** Pinia default behavior is in-memory only across navigation, not across browser refresh.
**How to avoid:** Accept as v1 behavior (per D-03). Or add `pinia-plugin-persistedstate` for cookie storage.
**Warning signs:** Users complain progress lost after refresh.

### Pitfall 4: NuxtLink Not Compatible with Programmatic Navigation
**What goes wrong:** Using `<NuxtLink to="...">` bypasses click handler logic. Can't add conditional check.
**Why it happens:** NuxtLink handles navigation internally, doesn't fire click events.
**How to avoid:** Use `<button @click="handler">` instead of `<NuxtLink>`, OR use `:to` with computed that checks state.
**Warning links:** Sidebar uses `<NuxtLink>` — need to change to buttons or add wrapper logic.

---

## Code Examples

### Store Access in Nuxt Middleware
```typescript
// app/middleware/auth.ts — Full example
export default defineNuxtRouteMiddleware((to, from) => {
  const saveStore = useSaveStore()
  
  // Skip on server
  if (import.meta.server) return
  
  // Redirect inventory → archives if no save
  if (to.path.startsWith('/inventory') && !saveStore.isLoaded) {
    return navigateTo('/archives')
  }
})
```

**Source:** [Pinia SSR Nuxt](https://github.com/vuejs/pinia/blob/v4/packages/docs/ssr/nuxt.md)

### Using inject() in Router Guards (Vue 3.3+)
```typescript
// Since Vue 3.3 — inject Pinia directly in guards
router.beforeEach((to, from) => {
  const saveStore = useSaveStore() // works in Nuxt context
})
```

**Source:** [Vue Router Global Injections](https://router.vuejs.org/guide/advanced/navigation-guards.html)

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Vuex in Nuxt 3 | Pinia in Nuxt 4 | Vue 3 + Nuxt 3 (2022) | Simpler API, better TS support |
| Manual router creation | Nuxt auto-routing | Nuxt 3 (2021) | No router.ts needed |
| Router hooks style | defineNuxtRouteMiddleware | Nuxt 3 (2021) | Cleaner Nuxt integration |

**Deprecated/outdated:**
- `router.beforeEach` manually registered — use Nuxt middleware files instead
- `app.router.beforeEach` outside Nuxt context — not needed with @pinia/nuxt module

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Pinia state persists across client-side navigation without plugin | State Persistence | LOW — confirmed by Pinia Nuxt docs |
| A2 | @pinia/nuxt auto-injects stores in middleware | Navigation Guards | LOW — confirmed by Pinia GitHub discussion |
| A3 | Nuxt 4 uses file-based routing under app/pages | Architecture | LOW — confirmed by existing pages structure |

**If this table is empty:** All claims verified or cited — no user confirmation needed.

---

## Open Questions

1. **Should direct URL access to /inventory/* redirect?**
   - What we know: User might type URL directly or use bookmark
   - What's unclear: Whether D-02 "no forced redirect" applies to direct URL access
   - Recommendation: Add global middleware to handle direct URL access (consistent with D-01 hybrid approach)

2. **What category to redirect to on first visit?**
   - What we know: ROADMAP says "Archives (encyclopedia view)" when no save loaded
   - What's unclear: Which exact archive category (/archives/weapons, /archives/armor, etc.)
   - Recommendation: Redirect to `/archives/armament` as first category

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pinia | State management | ✓ | 3.0.4 | — |
| @pinia/nuxt | Nuxt integration | ✓ | 0.11.3 | — |
| vue-router | Routing | ✓ | 5.0.6 | — |

**Missing dependencies with no fallback:** None — all required packages already installed.

**Missing dependencies with fallback:**
- `pinia-plugin-persistedstate` — not installed, but D-03 says not needed for v1

---

## Phase Requirements → Research Map

| Req ID | Description | Research Support |
|--------|-------------|------------------|
| NAV-01 | Sidebar checks if save file is loaded before navigation | Pattern 2: Sidebar click handlers check isLoaded |
| NAV-02 | No save loaded → redirect to Archives | Middleware guard + Pattern 2: navigateTo('/archives') |
| NAV-03 | Save loaded → redirect to Inventory | Pattern 2: navigateTo(`/inventory/...`) |
| STATE-01 | Save file data persists across page navigation | Pinia default behavior (confirmed) |
| STATE-02 | Verify Pinia store retains data on route change | Confirmed by Pinia Nuxt SSR docs |
| STATE-03 | Fix any state reset issues if found | Patterns for debugging: Pitfall 3, Pitfall 1 |

---

## Security Domain

> Not applicable — Phase 1 is navigation and state, no user input, auth, or data validation.

---

## Sources

### Primary (HIGH confidence)
- [Pinia v4 SSR Nuxt docs](https://github.com/vuejs/pinia/blob/v4/packages/docs/ssr/nuxt.md) — confirmed store auto-import in Nuxt, middleware state access
- [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html) — confirmed global guard API, inject() support
- [Nuxt Middleware](https://nuxt.com/docs/4.x/getting-started/routing#middleware) — confirmed defineNuxtRouteMiddleware

### Secondary (MEDIUM confidence)
- [Stack Overflow: Vue Router + Pinia](https://stackoverflow.com/questions/71697444/vue-3-vue-router-4-navigation-guards-and-pinia-store) — confirmed pattern for async store access in guards
- [Pinia plugin persistedstate Nuxt](https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt) — documented for reference only (not needed per D-03)

### Tertiary (LOW confidence)
- [Stack Overflow: Pinia in Router Guards](https://stackoverflow.com/questions/79841183/vue-3-pinia-storage-in-router-guards) — additional pattern verification

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — packages verified from npm, already installed
- Architecture: HIGH — patterns confirmed from Nuxt/Vue Router docs
- Pitfalls: MEDIUM — documented common issues, some verified via community sources

**Research date:** 2026-05-06  
**Valid until:** 2026-06-06 — Nuxt 4 / Pinia 3 stable, unlikely to change