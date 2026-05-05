<!-- refreshed: 2026-05-05 -->
# Architecture

**Analysis Date:** 2026-05-05

## System Overview

This is a **Nuxt 3** application that serves as an Elden Ring wiki and inventory checklist. Users can upload their game save files (.sl2) to track which items they have collected.

```text
┌─────────────────────────────────────────────────────────────┐
│                    Pages & Components                        │
│  `app/pages/` `app/components/`                             │
├──────────────────┬──────────────────┬───────────────────────┤
│   Wiki Pages     │  Inventory Pages │   Layout Components   │
│  wiki/[category] │ inventory/[cat]  │   AppHeader/Sidebar   │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Composables & Stores                     │
│  `app/composables/` `app/stores/`                           │
│         useEldenRingApi   │   useWikiStore                  │
│         useWikiItem       │   useSaveStore                  │
└───────────────────────────┴──────────────────────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Utils & Data Layer                       │
│  `app/utils/save-parser.ts`  │  `app/assets/data/*.json`   │
│  Binary save parsing         │  Item databases              │
└─────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                 External Services                           │
│  https://eldenring.fanapis.com/api  (External Wiki API)    │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `useSaveStore` | Manages save file upload, item parsing, inventory state, and completion statistics | `app/stores/useSaveStore.ts` |
| `useWikiStore` | Caches and fetches item details from external API | `app/stores/useWikiStore.ts` |
| `useEldenRingApi` | Provides typed API client for Elden Ring Fan API | `app/composables/useEldenRingApi.ts` |
| `useWikiItem` | Composable for fetching single wiki items | `app/composables/useWikiItem.ts` |
| `SaveParser` | Parses binary .sl2 save files to extract inventory IDs | `app/utils/save-parser.ts` |

## Pattern Overview

**Overall:** Nuxt 3 with Pinia State Management + Composition API

**Key Characteristics:**
- **Composition API** - All Vue components use `<script setup>` with `ref`, `computed`, and composables
- **Pinia Stores** - State management via `defineStore` with setup syntax
- **Nuxt Auto-imports** - Components, composables, and utilities auto-imported via Nuxt conventions
- **External API Integration** - Fan API for wiki data, no backend server required

## Layers

**Pages & UI Layer:**
- Purpose: Route handlers and view components
- Location: `app/pages/`, `app/components/`
- Contains: Vue pages with route params, UI components
- Depends on: Composables and stores
- Used by: Vue Router (Nuxt file-based routing)

**Composables Layer:**
- Purpose: Reusable stateful logic and API clients
- Location: `app/composables/`
- Contains: `useEldenRingApi`, `useWikiItem`
- Depends on: Shared types, $fetch (Nuxt)
- Used by: Pages, components, stores

**Stores Layer (Pinia):**
- Purpose: Application state management
- Location: `app/stores/`
- Contains: `useWikiStore` (API caching), `useSaveStore` (save parsing & inventory)
- Depends on: Composables, utilities, JSON data files
- Used by: Pages, components

**Utils Layer:**
- Purpose: Pure logic and binary parsing
- Location: `app/utils/`
- Contains: `SaveParser` class for binary .sl2 parsing
- Depends on: None (standalone)
- Used by: Stores

**Data Layer:**
- Purpose: Static item databases
- Location: `app/assets/data/`
- Contains: `all_items.json`, `dlc_items.json`, etc.
- Depends on: None
- Used by: Stores (imported at runtime)

## Data Flow

### Primary Request Path - Save File Upload

1. **User Action** - User uploads .sl2 file on index page
2. **Store Handler** - `useSaveStore.handleFileUpload(file)` reads file as ArrayBuffer (`app/stores/useSaveStore.ts:67`)
3. **Parser Instantiation** - `new SaveParser(buffer)` validates BND4 header (`app/utils/save-parser.ts:26`)
4. **Character Extraction** - `parser.getCharacterNames()` extracts 10 character slots at hardcoded offsets
5. **Inventory Parsing** - `parser.getInventoryIds(index)` finds item ID patterns in binary data
6. **State Update** - Store updates `foundItemIds` with parsed hex IDs
7. **Computed Views** - `ownedItems`, `missingItems`, `stats` computed props derive completion data

### Wiki Item Lookup Flow

1. **User Action** - User clicks item in inventory list
2. **Page Navigation** - Navigate to `wiki/[category]/[id]`
3. **Composable Fetch** - `useWikiItem(category, id)` calls `useEldenRingApi().fetchEntity()`
4. **API Response** - External Fan API returns item data with image, description, stats
5. **Cache Store** - `useWikiStore` caches fetched items to avoid re-fetching

**State Management:**
- Pinia stores (`useSaveStore`, `useWikiStore`) hold reactive state
- Components use `useSaveStore()` to access state via composables
- Nuxt auto-imports eliminate manual store imports

## Key Abstractions

**SaveParser Class:**
- Purpose: Binary parsing of Elden Ring .sl2 save files
- Examples: `app/utils/save-parser.ts`
- Pattern: Pure class with instance methods, no Vue reactivity

**WikiEntity Interface:**
- Purpose: Type definitions for wiki API responses
- Examples: `app/shared/types/EldenRingApi.ts`
- Pattern: TypeScript interfaces exported from shared types

**Pinia Setup Stores:**
- Purpose: Reactive state management with Composition API
- Examples: `app/stores/useSaveStore.ts`, `app/stores/useWikiStore.ts`
- Pattern: `defineStore('name', () => { ... })` returning refs and functions

## Entry Points

**App Entry:**
- Location: `app/app.vue`
- Triggers: Application bootstrap
- Responsibilities: Renders NuxtLayout + NuxtPage

**Default Layout:**
- Location: `app/layouts/default.vue`
- Triggers: All page routes
- Responsibilities: Wraps all pages with AppHeader, AppSidebar, main slot

**Home Page:**
- Location: `app/pages/index.vue`
- Triggers: `/` route
- Responsibilities: Save file upload UI

**Inventory Pages:**
- Location: `app/pages/inventory/[category].vue`
- Triggers: `/inventory/:category` route
- Responsibilities: Display owned/missing items by category

**Wiki Detail Pages:**
- Location: `app/pages/wiki/[category]/[id].vue`
- Triggers: `/wiki/:category/:id` route
- Responsibilities: Display item details from API

## Architectural Constraints

- **Client-Side Only:** No server-side rendering for save parsing (binary requires browser)
- **Hardcoded Offsets:** Save parser uses fixed memory offsets (from original script.js) - fragile to game updates
- **External API Dependency:** Wiki data depends on fanapis.com - no local fallback if API unavailable
- **Single Page State:** Save data not persisted - cleared on refresh

## Anti-Patterns

### Hardcoded Magic Numbers in Save Parser

**What happens:** Binary offsets and patterns defined as raw numbers in code
**Why it's wrong:** No clarity on what these values represent; risk of silent breakage if game updates
**Do this instead:** Use named constants or dedicated configuration object (`app/utils/save-parser.ts:37-40`)

### Category Mapping Duplication

**What happens:** Same API category mapping exists in both `useWikiStore` and `useEldenRingApi`
**Why it's wrong:** DRY violation; changes must be made in two places
**Do this instead:** Extract mapping to shared utility or constant file

### No Error Boundaries

**What happens:** API failures silently logged to console; no user-facing error states
**Why it's wrong:** Users see no feedback when wiki data fails to load
**Do this instead:** Add error state in store and display in components

## Error Handling

**Strategy:** Try-catch with console.error logging

**Patterns:**
- API calls wrapped in try-catch, errors logged but not surfaced to UI (`app/stores/useWikiStore.ts:45-47`)
- Save parser validation throws early with alert (`app/stores/useSaveStore.ts:74-76`)
- No global error boundary or error page

## Cross-Cutting Concerns

**Logging:** `console.error()` for failures; no structured logging framework
**Validation:** Save file BND4 header check; no form validation
**Authentication:** None required - public wiki API, local save file only

---

*Architecture analysis: 2026-05-05*