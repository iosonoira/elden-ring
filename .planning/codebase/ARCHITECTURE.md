<!-- refreshed: 2026-05-06 -->
# Architecture

**Analysis Date:** 2026-05-06

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Nuxt 4 Router / Pages                     │
├──────────────────┬──────────────────┬───────────────────────┤
│   index.vue      │  wiki/[category] │  inventory/[cat]   │
│   (Checklist)    │   /[id].vue      │   archives/[cat]    │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Pinia Stores                          │
│    useSaveStore.ts    │    useWikiStore.ts              │
└─────────────────────────────────────────────────────────────┘
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────────────────────────────────────┐
│  SaveParser     │  │  useEldenRingApi + External Fan API            │
│  (.sl2 binary) │  │  (eldenring.fanapis.com)                     │
└─────────────────┘  └─────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `useSaveStore` | Save file upload, parsing, inventory cross-reference | `app/stores/useSaveStore.ts` |
| `useWikiStore` | Wiki API response caching | `app/stores/useWikiStore.ts` |
| `useEldenRingApi` | Fan API client | `app/composables/useEldenRingApi.ts` |
| `useWikiItem` | Single wiki item fetcher | `app/composables/useWikiItem.ts` |
| `SaveParser` | Binary .sl2 parsing | `app/utils/save-parser.ts` |

## Pattern Overview

**Overall:** Nuxt 4 SPA with Pinia state management

**Key Characteristics:**
- Static JSON item database merged at runtime from multiple sources
- External Fan API for wiki detail data
- Client-only operations for file upload and local storage persistence
- Scoped SCSS with globally injected variables and mixins

## Layers

**Pages (Route Layer):**
- Purpose: Route handlers rendering Vue components
- Location: `app/pages/`
- Contains: `index.vue`, `wiki/[category]/[id].vue`, `inventory/[category].vue`, `archives/[category].vue`
- Depends on: Stores, Composables
- Used by: Nuxt router

**Stores (State Layer):**
- Purpose: Centralized state management
- Location: `app/stores/`
- Contains: `useSaveStore.ts`, `useWikiStore.ts`
- Depends on: Utils, External APIs
- Used by: Pages, Components

**Composables (Logic Layer):**
- Purpose: Reusable composition logic and API clients
- Location: `app/composables/`
- Contains: `useEldenRingApi.ts`, `useWikiItem.ts`, `useCategoryPage.ts`
- Depends on: Types
- Used by: Pages, Components

**Components (UI Layer):**
- Purpose: Reusable Vue components
- Location: `app/components/`
- Contains: Layout components (`AppHeader`, `AppSidebar`, `MobileMenu`), Wiki components (`ItemGrid`, `ItemCard`, `ReliquarySlot`, etc.)
- Depends on: Stores, Types
- Used by: Pages

**Utilities (Infrastructure Layer):**
- Purpose: Binary parsing and data transformation
- Location: `app/utils/`
- Contains: `save-parser.ts`
- Depends on: None
- Used by: Stores

## Data Flow

### Primary Request Path (Checklist)

1. **Upload** — User drops `.sl2` file on `index.vue` (line 89)
2. **Parse** — `useSaveStore.handleFileUpload()` creates `SaveParser` (`app/stores/useSaveStore.ts:73`)
3. **Extract** — `SaveParser.getCharacterNames()` extracts character slots (`app/utils/save-parser.ts:32`)
4. **Select** — `useSaveStore.selectCharacter()` extracts inventory IDs via pattern matching (`app/utils/save-parser.ts:81`)
5. **Cross-ref** — `ownedItems`/`missingItems` computed properties compare IDs against JSON database
6. **Display** — `WikiReliquarySlot` renders owned/missing items from computed store values

### Secondary Flow (Wiki Detail)

1. **Navigate** — User clicks item card, routes to `wiki/[category]/[id].vue` (line 10)
2. **Fetch** — `useWikiItem()` calls `useEldenRingApi.fetchEntity()` (`app/composables/useWikiItem.ts:6`)
3. **Cache** — Response cached in Pinia store to avoid redundant API calls
4. **Render** — Wiki page displays item details, image, metadata

**State Management:**
- Pinia stores manage all shared state
- JSON item database merged at runtime from `all_items.json`, `altered_armor.json`, `unobtainable.json`, `dlc_items.json`
- LocalStorage persistence via `@pinia-plugin-persistedstate` (detected in plugins)

## Key Abstractions

**WikiEntity:**
- Purpose: Interface for wiki/API data
- Examples: `app/shared/types/EldenRingApi.ts`
- Pattern: Plain TypeScript interface

**SaveParser:**
- Purpose: Binary .sl2 file parser
- Examples: `app/utils/save-parser.ts`
- Pattern: Class with private methods, public API

**CharacterSlot:**
- Purpose: Character slot representation
- Examples: `app/utils/save-parser.ts:6`
- Pattern: Exported TypeScript interface

## Entry Points

**App Entry:**
- Location: `app/app.vue`
- Triggers: Nuxt app mount
- Responsibilities: Renders `NuxtLayout` > `NuxtPage`

**Default Layout:**
- Location: `app/layouts/default.vue`
- Triggers: Any page
- Responsibilities: Renders header, sidebar, page slot

**Client Plugin:**
- Location: `app/plugins/save-store-persist.client.ts`
- Triggers: Client-side hydration
- Responsibilities: Pinia persistence for save store

## Architectural Constraints

- **Browser-only:** File API (`FileReader`) and `localStorage` - wrapped in `<ClientOnly>` components
- **Server-side guards:** `import.meta.server` checks in `useSaveStore.loadDatabase()` prevent server execution
- **No API proxy:** Direct calls to external `eldenring.fanapis.com` from client (no server API routes)
- **Static JSON DB:** Item database loaded from multiple JSON files merged at runtime

## Anti-Patterns

### Hardcoded API URL

**What happens:** `BASE_URL` defined in both `useWikiStore` and `useEldenRingApi` composables
**Why it's wrong:** Duplication, no single source of truth for API configuration
**Do this instead:** Define in `nuxt.config.ts` runtime config, reference via `useRuntimeConfig()`

### Inline Category Mapping

**What happens:** Category mapping objects defined inline in multiple files (`useWikiStore.ts:23`, `useEldenRingApi.ts:28`)
**Why it's wrong:** Changes to category mappings require edits in multiple places
**Do this instead:** Extract to shared constants in `app/shared/types/EldenRingApi.ts`

## Error Handling

**Strategy:** Graceful degradation with error states

**Patterns:**
- Store exposes `*Error` ref (e.g., `dbLoadError`, `uploadError`)
- Page components display error messages via `v-if="error"`
- API errors logged in dev mode only (`import.meta.dev`)

## Cross-Cutting Concerns

**Styling:** Scoped SCSS with global abstracts (variables, mixins injected via Vite config)
**i18n:** `@nuxtjs/i18n` with locale files in `locales/`
**Images:** `@nuxt/image` with external provider for wiki images
**Icons:** `@nuxt/icon` using Material Symbols

---

*Architecture analysis: 2026-05-06*