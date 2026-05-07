# AGENTS.md

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm generate     # Static site generation
```

## Stack

- **Nuxt 4** with Vue 3.5, TypeScript
- **Pinia** for state management
- **@nuxtjs/i18n** for localization (en, it)
- **SCSS** via Vite (globals auto-injected)
- **@nuxt/icon** for Iconify icons

## Architecture

```
app/
├── components/    # Vue components (auto-imported)
├── composables/   # useX composables (auto-imported)
├── pages/         # Nuxt file-based routing
├── stores/        # Pinia stores (explicit import)
├── shared/types/  # TypeScript interfaces
└── assets/scss/   # Global styles, variables, mixins
```

## Key Conventions

- Components: `PascalCase.vue` (e.g., `ItemCard.vue`)
- Composables: `useCamelCase.ts` (e.g., `useSaveStore.ts`)
- Stores: `useXStore.ts` (Pinia, explicit import)
- `~/*` alias → `app/` directory
- Locale path: `useLocalePath()`, t: `useI18n()`
- SCSS: No need to `@use` variables/mixins, globally available in scoped styles

## Gotchas

- Wiki category pages read from cache populated by inventory page — no direct API fetch (known bug)
- Pre-existing TypeCheck errors in project (not from recent changes)
- .planning/ files excluded from commits (per user constraint)

## Existing Instructions

- `.agents/rules/gilded-reliquary.md` — project rules
- `.agents/workflows/` — component/page creation workflows
- `.agents/skills/` — custom skills (caveman, cavecrew, etc.)