# Coding Conventions

**Analysis Date:** 2026-05-06

## Naming Patterns

**Files:**
- TypeScript files: `camelCase.ts` (e.g., `useSaveStore.ts`, `save-parser.ts`)
- Vue components: `PascalCase.vue` (e.g., `ItemCard.vue`, `ItemGrid.vue`)
- Directories: `kebab-case` (e.g., `app/stores`, `app/composables`)

**Functions:**
- Composables: `useCamelCase` prefix (e.g., `useCategoryPage`, `useEldenRingApi`)
- Regular functions: `camelCase` (e.g., `loadMore`, `selectItem`, `getWikiUrl`)
- Store actions: `camelCase` (e.g., `loadDatabase`, `handleFileUpload`, `selectCharacter`)

**Variables:**
- Local variables: `camelCase` (e.g., `category`, `page`, `isLoaded`)
- Constants: `UPPER_SNAKE_CASE` for configuration objects (e.g., `CATEGORY_TITLES`)
- Refs/computed: `camelCase` with descriptive names (e.g., `selectedItem`, `activeFilter`)

**Types:**
- Interfaces: `PascalCase` with descriptive names (e.g., `CategoryPageItem`, `ItemData`, `CharacterSlot`)
- Type aliases: `PascalCase` (e.g., `FilterValue`, `CategoryKey`, `WikiCategory`)
- Generic type parameters: `PascalCase` (e.g., `T extends WikiEntity`)

## Code Style

**Formatting:**
- Tool: Nuxt ESLint module with flat config
- Config: `.nuxt/eslint.config.mjs` extends Nuxt defaults
- Semi-colons: Used in some files (see `useSaveStore.ts`), optional in others
- Quotes: Single quotes preferred in new files, consistent within files

**Linting:**
- Framework: `@nuxt/eslint` v1.15.2 with ESLint v10.3.0
- Type checking: `// @ts-check` in config files
- Vue SFC: Uses `<script setup lang="ts">` syntax

**Indentation:**
- 2 spaces for TypeScript
- 2 spaces for Vue templates
- SCSS: Follows SCSS nesting conventions

## Import Organization

**Order (observed pattern):**
1. Vue/Nuxt built-ins (automatically available)
2. Pinia stores (`~/stores/*`)
3. Composables (`~/composables/*`)
4. Shared types (`~/shared/types/*`)
5. Utils (`~/utils/*`)
6. Vue components (`~/components/*`)

**Path Aliases:**
- `~/*` - Maps to `app/` directory
- `@/*` - Nuxt alias (same as `~`)
- Auto-imports enabled for composables and components

**Example:**
```typescript
import { useSaveStore } from '~/stores/useSaveStore'  // Pinia store
import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'  // Types
```

## Error Handling

**Patterns:**

1. **Try/catch with dev-only logging:**
   ```typescript
   try {
     // async operation
   } catch (error) {
     const message = error instanceof Error ? error.message : 'Unknown error'
     dbLoadError.value = `Failed to load item database: ${message}`
     if (import.meta.dev) console.error(dbLoadError.value, error)
   }
   ```

2. **Guard clauses for null/undefined:**
   ```typescript
   if (!category || !name) return
   if (cacheKey in cache.value || inFlight.has(cacheKey)) return
   ```

3. **Early returns for validation:**
   ```typescript
   if (import.meta.server) return
   if (db.value) return
   ```

4. **Error state in stores:**
   - Dedicated error ref per operation (e.g., `dbLoadError`, `uploadError`)
   - Error messages as string values

## Logging

**Framework:** `console` (native browser)

**Patterns:**
- Development-only errors: `if (import.meta.dev) console.error(...)`
- Errors include context: `Failed to fetch ${name} from ${finalCategory}`
- No info-level logging in production

## Comments

**When to Comment:**
- Complex business logic (see `save-parser.ts` line 1-4 JSDoc)
- Magic numbers or offsets (see `save-parser.ts` lines 36-40, 60-70)
- Workarounds or non-obvious decisions (see `useSaveStore.ts` lines 47 "Merge extra data")
- Guard reasoning (see `useWikiStore.ts` line 5 "null = 'cercato ma non trovato'")

**JSDoc/TSDoc:**
- Used for classes: `@see` references to external documentation
- Not used for every function; focus on public APIs and complex logic

**Language:** English (code), Italian (inline comments in some places)

## Function Design

**Size:** Keep small; composables typically <100 lines

**Parameters:**
- Use TypeScript interfaces for complex objects
- Avoid too many parameters; group related params in objects
- Use generic type parameters when applicable (e.g., `<T extends WikiEntity>`)

**Return Values:**
- Composables return object with reactive refs/computeds
- Store actions return void or update internal state
- API composables use `useAsyncData` for SSR support

## Module Design

**Exports:**
- Named exports for composables: `export function useX(...)`
- Named exports for stores: `export const useXStore = defineStore(...)`
- Named exports for types: `export interface X`, `export type X = ...`

**Barrel Files:** Not used; direct imports from individual files

**Auto-imports:**
- Nuxt auto-imports composables from `app/composables/`
- Nuxt auto-imports components from `app/components/`
- Pinia stores require explicit imports

## Vue Component Conventions

**Script Setup:**
```vue
<script setup lang="ts">
// imports
// props with defineProps
// composables
// refs/computed
// methods
// lifecycle hooks
</script>

<template>
<!-- template content -->
</template>

<style scoped lang="scss">
/* component styles */
</style>
```

**Component Patterns:**
- Props use `defineProps<{ ... }>()` generic syntax
- Use `ref<T | null>(null)` pattern for nullable refs
- Components lazy-loaded in grids: `<LazyWikiItemCard ...>`
- Use `v-for` with `:key` (usually item.id)

---

*Convention analysis: 2026-05-06*