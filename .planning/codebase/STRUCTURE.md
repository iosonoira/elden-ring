# Codebase Structure

**Analysis Date:** 2026-05-06

## Directory Layout

```
elden-ring/
├── app/
│   ├── assets/
│   │   ├── data/             # Static JSON item databases
│   │   │   ├── all_items.json
│   │   │   ├── altered_armor.json
│   │   │   ├── dlc_items.json
│   │   │   ├── item_counter.json
│   │   │   ├── unobtainable.json
│   │   │   └── item_dict_template.json
│   │   └── scss/             # Global SCSS
│   │       ├── abstracts/    # _variables.scss, _mixins.scss, _animations.scss
│   │       ├── base/         # _reset.scss, _typography.scss, _transitions.scss
│   │       ├── components/   # Component-specific styles
│   │       ├── layout/       # Layout styles
│   │       ├── pages/        # Page-specific styles
│   │       └── main.scss    # Imports all partials
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── MobileMenu.vue
│   │   └── wiki/            # Wiki feature components
│   │       ├── ItemCard.vue
│   │       ├── ItemDetailCard.vue
│   │       ├── ItemGrid.vue
│   │       ├── ItemInspector.vue
│   │       ├── InventorySkeleton.vue
│   │       ├── ReliquarySlot.vue
│   │       └── CharacterSelector.vue
│   ├── composables/         # Composition functions
│   │   ├── useCategoryPage.ts
│   │   ├── useEldenRingApi.ts
│   │   └── useWikiItem.ts
│   ├── layouts/
│   │   └── default.vue
│   ├── pages/              # Nuxt file-based routing
│   │   ├── index.vue        # Homepage (checklist upload)
│   │   ├── wiki/
│   │   │   └── [category]/
│   │   │       └── [id].vue  # Wiki detail page
│   │   ├── inventory/
│   │   │   └── [category].vue
│   │   └── archives/
│   │       └── [category].vue
│   ├── plugins/            # Nuxt plugins
│   │   └── save-store-persist.client.ts
│   ├── shared/
│   │   └── types/          # Shared TypeScript types
│   │       └── EldenRingApi.ts
│   ├── stores/             # Pinia stores
│   │   ├── useSaveStore.ts
│   │   └── useWikiStore.ts
│   ├── utils/
│   │   └── save-parser.ts  # Binary .sl2 parser
│   └── app.vue            # Root component
├── locales/               # i18n translation files
│   ├── en.json
│   └── it.json
├── public/                # Static public assets
├── nuxt.config.ts        # Nuxt configuration
├── package.json
├── tsconfig.json
└── eslint.config.mjs
```

## Directory Purposes

**app/assets/data:**
- Purpose: Static JSON item databases used for cross-referencing save file inventory
- Contains: `all_items.json` (main), plus override patches (`altered_armor.json`, `unobtainable.json`, `dlc_items.json`)
- Key files: All items grouped by category (armament, armor, talisman, magic, ashesOfWar, spiritAshes)

**app/components:**
- Purpose: Reusable Vue SFC components
- Contains: `layout/` (global navigation), `wiki/` (item display/selection)

**app/composables:**
- Purpose: Reusable composition API functions
- Contains: API clients and fetch utilities

**app/pages:**
- Purpose: Nuxt file-based routing
- Contains: `index.vue` (checklist), `wiki/[category]/[id].vue` (detail), inventory/archives pages

**app/stores:**
- Purpose: Pinia state management
- Contains: `useSaveStore` (save file + inventory), `useWikiStore` (API cache)

**app/utils:**
- Purpose: Binary file parsing utilities
- Contains: `save-parser.ts` (Elden Ring .sl2 save file parser)

**app/shared/types:**
- Purpose: Shared TypeScript interfaces
- Contains: `WikiEntity`, `ApiResponse`, category types

## Key File Locations

**Entry Points:**
- `app/app.vue`: Root app component
- `app/layouts/default.vue`: Default layout wrapper
- `app/pages/index.vue`: Homepage/checklist route

**Configuration:**
- `nuxt.config.ts`: Nuxt configuration (modules, fonts, i18n, CSS)

**Core Logic:**
- `app/stores/useSaveStore.ts`: Save file handling and inventory cross-reference
- `app/utils/save-parser.ts`: Binary .sl2 parsing logic

**Testing:**
- No test directory detected - no test files in repository

## Naming Conventions

**Files:**
- PascalCase: Components, composables, stores, pages (e.g., `ItemCard.vue`, `useSaveStore.ts`, `index.vue`)
- kebab-case: SCSS partials (e.g., `_item-card.scss`, `_variables.scss`)

**Directories:**
- Lowercase: Feature directories (`assets`, `components`, `composables`, `pages`)
- kebab-case for SCSS subdirectories (`scss/base`, `scss/pages`)

**TypeScript:**
- PascalCase: Interfaces, types, classes (e.g., `WikiEntity`, `SaveParser`)
- camelCase: Functions, variables (e.g., `fetchEntity`, `isLoaded`)

## Where to Add New Code

**New Feature:**
- Primary code: `app/components/` (if UI) or `app/composables/` (if logic)
- Tests: No test directory - follow existing pattern if tests added

**New Component/Module:**
- Implementation: Create in appropriate subdirectory under `app/components/`

**Utilities:**
- Shared helpers: `app/utils/` for binary/data processing, `app/composables/` for Vue composition

**State:**
- New Pinia store: Add to `app/stores/`

**Types:**
- New types: Add to `app/shared/types/` (shared interfaces) or inline in feature files (local types)

## Special Directories

**app/assets/data:**
- Purpose: Static JSON files merged at runtime to form complete item database
- Generated: No - manually maintained JSON
- Committed: Yes

**app/plugins:**
- Purpose: Client-side Nuxt plugins for persistence and hydration
- Generated: No
- Committed: Yes

**locales:**
- Purpose: i18n translation strings
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-06*