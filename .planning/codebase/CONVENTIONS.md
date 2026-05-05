# Coding Conventions

**Analysis Date:** 2026-05-05

## Naming Patterns

**Files:**
- TypeScript utilities/composables: camelCase - `save-parser.ts`, `useEldenRingApi.ts`
- Vue components: PascalCase - `AppSidebar.vue`, `ItemCard.vue`
- Store files: camelCase with `useXxxStore` prefix - `useWikiStore.ts`, `useSaveStore.ts`
- Type definition files: PascalCase - `EldenRingApi.ts`

**Functions:**
- Composable functions: camelCase with `use` prefix - `useEldenRingApi()`, `useWikiItem()`
- Store functions: camelCase - `fetchItemDetails()`, `handleFileUpload()`
- Class methods: camelCase - `isValid()`, `getCharacterNames()`

**Variables:**
- camelCase - `isLoaded`, `characters`, `foundItemIds`
- Constants: UPPER_SNAKE_CASE for magic numbers within modules
- Boolean variables: prefix with `is`, `has`, `should` - `isDlc`, `isValid`

**Types:**
- Interfaces: PascalCase - `CharacterSlot`, `InventoryItem`, `WikiEntity`
- Type aliases: PascalCase - `WikiCategory`
- Generic type parameters: PascalCase - `T extends WikiEntity`

## Code Style

**Formatting:**
- Tool: Nuxt ESLint module (uses ESLint with Prettier integration via Nuxt)
- Config: `.nuxt/eslint.config.mjs` (generated, extends user config in `eslint.config.mjs`)
- Single quotes for strings (observed in source)
- Semicolons: used in store files, optional in other files

**Linting:**
- Framework: ESLint via `@nuxt/eslint` module (v1.15.2)
- Package version: ESLint v10.3.0
- Type checking: `// @ts-check` used in config files

## Import Organization

**Order:**
1. External framework imports - `import { defineStore } from 'pinia'`
2. Type imports - `import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'`
3. Relative imports - `import { SaveParser, type CharacterSlot } from '../utils/save-parser'`

**Path Aliases:**
- `~` or `~/` - maps to app directory (Nuxt default)
- Example: `import type { ... } from "~/shared/types/EldenRingApi"`

## Error Handling

**Patterns:**
- Try-catch blocks with console.error for logging
- Return null/default values on failure instead of throwing
- Use alerts for user-facing errors: `alert('Invalid Elden Ring save file (.sl2)')`
- Error messages include context: `console.error(\`Failed to fetch ${name}\`, e)`

**Validation:**
- Check for undefined/null before accessing properties
- Use optional chaining: `response.data?.[0]`
- Early returns for invalid states: `if (!buffer) return;`

## Logging

**Framework:** Console API

**Patterns:**
- Use `console.error` for failures: `console.error(\`WikiStore: Failed to fetch ${name}\`, e)`
- Log to help debug API calls: `console.error(\`Failed to fetch ${name} from ${finalCategory}\`, e)`

## Comments

**When to Comment:**
- Document file purpose and logic source: `// Based on Elden-Ring-Automatic-Checklist logic`
- Explain hardcoded values with source references: `// BND4 check`, `// Slot offsets from script.js`
- Mark TODO-like notes: `// In a real Nuxt apps...`, `// For now, let's assume...`

**JSDoc/TSDoc:**
- Not heavily used; minimal documentation in current codebase
- One file uses block comment for file-level docs: `/** Caveman Parser... */`

## Function Design

**Size:** Functions are kept reasonably small with single responsibilities

**Parameters:**
- Use explicit typing for all parameters
- Optional parameters with defaults: `params?: { limit?: number; page?: number }`
- Generic type constraints: `<T extends WikiEntity>`

**Return Values:**
- Explicit return types in composables via `useAsyncData<T>` wrapper
- Store functions return reactive state and methods
- Class methods return typed interfaces

## Module Design

**Exports:**
- Named exports for utilities: `export class SaveParser`, `export interface CharacterSlot`
- Composables return object with methods: `return { fetchEntity, fetchList, getByName }`
- Store returns all state and methods: `return { isLoaded, characters, ... }`

**Barrel Files:**
- Not used - direct imports from files
- Types defined in dedicated type files: `app/shared/types/EldenRingApi.ts`

## Vue/Nuxt Conventions

**Component Structure:**
- Auto-imports enabled (Nuxt default)
- Components in `app/components/` organized by feature: `layout/`, `wiki/`
- Pages in `app/pages/` with dynamic routes: `[category].vue`, `[id].vue`

**Composables:**
- Named with `use` prefix
- Return reactive data and functions
- Located in `app/composables/`

**State Management:**
- Pinia stores with Composition API syntax
- Stores use `defineStore` with arrow function returning state/computed/methods

---

*Convention analysis: 2026-05-05*