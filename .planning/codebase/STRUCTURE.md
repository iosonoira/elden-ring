<!-- refreshed: 2026-05-05 -->
# Codebase Structure

**Analysis Date:** 2026-05-05

## Directory Layout

```
elden-ring/
├── .agents/               # Agent skills and configuration
├── .nuxt/                 # Nuxt build output (generated)
├── .output/               # Nitro output (generated)
├── .opencode/             # IDE configuration
├── app/                   # Application source
│   ├── app.vue            # Root component
│   ├── assets/            # Static assets and data
│   ├── components/       # Vue components
│   ├── composables/       # Vue composables
│   ├── layouts/           # Nuxt layouts
│   ├── pages/             # Nuxt pages (routing)
│   ├── shared/            # Shared types
│   ├── stores/            # Pinia stores
│   └── utils/             # Utility functions
├── docs/                  # Documentation
├── locales/               # i18n translation files
├── public/                # Public static files
├── .gitignore
├── DESIGN.md              # Design documentation
├── eslint.config.mjs      # ESLint configuration
├── llms-full.txt          # LLM context file
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Dependencies
├── pnpm-lock.yaml         # Lockfile
├── README.md              # Project readme
└── tsconfig.json          # TypeScript configuration
```

## Directory Purposes

**app/assets/:**
- Purpose: Static assets including SCSS styles and JSON data
- Contains: SCSS partials, item databases (JSON)
- Key files: `app/assets/scss/main.scss`, `app/assets/data/all_items.json`

**app/components/:**
- Purpose: Reusable Vue components
- Contains: Layout components, wiki item components
- Key files: `app/components/layout/AppHeader.vue`, `app/components/wiki/ItemCard.vue`

**app/composables/:**
- Purpose: Vue composables for reusable stateful logic
- Contains: API clients, data fetching hooks
- Key files: `app/composables/useEldenRingApi.ts`, `app/composables/useWikiItem.ts`

**app/layouts/:**
- Purpose: Nuxt layout wrappers for pages
- Contains: Default layout with header/sidebar
- Key files: `app/layouts/default.vue`

**app/pages/:**
- Purpose: Nuxt file-based routing
- Contains: Route handlers and page components
- Key files: `app/pages/index.vue`, `app/pages/inventory/[category].vue`

**app/shared/:**
- Purpose: Shared TypeScript type definitions
- Contains: API response types, entity interfaces
- Key files: `app/shared/types/EldenRingApi.ts`

**app/stores/:**
- Purpose: Pinia state management stores
- Contains: Application state for wiki and save data
- Key files: `app/stores/useWikiStore.ts`, `app/stores/useSaveStore.ts`

**app/utils/:**
- Purpose: Pure utility functions and classes
- Contains: Save file parser
- Key files: `app/utils/save-parser.ts`

**locales/:**
- Purpose: i18n translation files
- Contains: English and Italian translations
- Files: `en.json`, `it.json`

## Key File Locations

**Entry Points:**
- `app/app.vue`: Root component rendering NuxtLayout + NuxtPage
- `app/layouts/default.vue`: Default layout wrapping all pages

**Configuration:**
- `nuxt.config.ts`: Nuxt configuration with modules, fonts, CSS, i18n
- `tsconfig.json`: TypeScript paths and options
- `eslint.config.mjs`: ESLint rules via @nuxt/eslint

**Core Logic:**
- `app/stores/useSaveStore.ts`: Save file handling, inventory parsing, stats computation
- `app/utils/save-parser.ts`: Binary .sl2 file parser extracting character names and inventory IDs

**Testing:**
- No test files detected (no .test.* or .spec.* files)

## Naming Conventions

**Files:**
- Components: `PascalCase.vue` (e.g., `AppHeader.vue`, `ItemCard.vue`)
- TypeScript: `camelCase.ts` (e.g., `save-parser.ts`, `useEldenRingApi.ts`)
- Stores: `use*Store.ts` (e.g., `useWikiStore.ts`, `useSaveStore.ts`)
- Composables: `use*.ts` (e.g., `useEldenRingApi.ts`, `useWikiItem.ts`)

**Directories:**
- Feature directories: `lowercase/` (e.g., `components/wiki/`, `pages/inventory/`)
- SCSS partials: `kebab-case/` with underscore prefix (e.g., `_variables.scss`, `_mixins.scss`)

## Where to Add New Code

**New Feature (e.g., new page):**
- Primary code: `app/pages/` - create `[new-feature].vue`
- Data handling: Consider adding to `app/stores/` if state needed

**New Component:**
- Implementation: `app/components/` - subdirectory by feature area
- Styling: `app/assets/scss/components/_component-name.scss`

**New Utility:**
- Implementation: `app/utils/`

**New Store:**
- Implementation: `app/stores/useNewStore.ts`

**New Type Definition:**
- Implementation: `app/shared/types/`

## Special Directories

**.nuxt/:**
- Purpose: Nuxt build cache and generated files
- Generated: Yes (by Nuxt during build)
- Committed: No (in .gitignore)

**.output/:**
- Purpose: Production output bundle
- Generated: Yes (by Nitro during build)
- Committed: No (in .gitignore)

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (by pnpm install)
- Committed: No (in .gitignore)

**app/assets/data/:**
- Purpose: Static JSON databases of game items
- Generated: No (manually maintained)
- Committed: Yes

---

*Structure analysis: 2026-05-05*