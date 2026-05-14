# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # start dev server
pnpm build        # production build
pnpm generate     # static site generation
pnpm preview      # preview production build
pnpm postinstall  # run after install (nuxt prepare)
```

No test suite is configured.

## Architecture

**Nuxt 4** app using the `app/` directory layout (`future.compatibilityVersion: 4`). Package manager is **pnpm**.

### Three sections, two data sources

| Section | Route | Data source |
|---|---|---|
| Checklist | `/` | Local JSON DB + parsed `.sl2` binary |
| Archives | `/archives/[category]` | Local JSON DB |
| Inventory | `/inventory/[category]` | Local JSON DB |
| Wiki | `/wiki/[category]/[id]` | External Fan API |

**Local DB** lives in `app/assets/data/`. `useSaveStore` merges four JSON files at runtime (`all_items`, `altered_armor`, `unobtainable`, `dlc_items`) into one in-memory `ItemDatabase`.

**External Fan API** is `https://eldenring.fanapis.com/api`. Used exclusively by `useWikiCategory`, `useWikiItem`, `useEldenRingApi`, and `useWikiStore`.

### Category naming mismatch

Internal category keys (`armament`, `armor`, `talisman`, `magic`, `ashesOfWar`, `spiritAshes`) differ from Fan API paths (`weapons`, `armors`, `talismans`, `sorceries`, `ashes`, `spirits`). The mapping is duplicated in several places — the canonical reference is `app/composables/useEldenRingApi.ts` and `app/stores/useWikiStore.ts`. `app/utils/categories.ts` defines `CATEGORY_CONFIG` and `CATEGORY_KEYS` for UI metadata (icons, titles, lore text).

### Save file flow

1. User drops a `.sl2` file → `useSaveStore.handleFileUpload` reads it as `ArrayBuffer`
2. `SaveParser` (`app/utils/save-parser.ts`) validates the BND4 header, reads character names from hardcoded offsets, and extracts inventory item IDs from per-slot byte buffers
3. `selectCharacter` triggers `loadDatabase()` then maps raw hex IDs against the merged JSON DB to produce `ownedItems` and `missingItems` computed refs
4. `save-store-persist.client.ts` persists the parsed state (not the binary) to `sessionStorage` under key `gilded-reliquary-save`

### Shared composable pattern

`useCategoryPage` (`app/composables/useCategoryPage.ts`) drives both `/archives` and `/inventory`. The only difference is the `defaultFilter` argument: `'all'` for archives, `'owned'` for inventory. It owns pagination (60 items per page), filter state, and `selectedItem` side-panel state. Infinite scroll is wired separately via `useInfiniteScroll`.

### SCSS

`app/assets/scss/abstracts/_variables.scss` and `_mixins.scss` are auto-injected into every scoped component style block via `vite.css.preprocessorOptions.scss.additionalData` in `nuxt.config.ts`. Do not add `@use` for these in component `<style>` blocks. Global styles are in `app/assets/scss/main.scss`.

### i18n

`@nuxtjs/i18n` with `en` (default) and `it` locales. Translation files are in `locales/en.json` and `locales/it.json`. Use `useLocalePath()` for all internal links and `useI18n().t()` for translated strings.

## Conventions

- Components: `PascalCase.vue`, auto-imported
- Composables: `useCamelCase.ts`, auto-imported
- Stores: `useXStore.ts` (Pinia), explicit import required
- `~/*` alias → `app/` directory
- Icons: `@nuxt/icon` with Iconify (`material-symbols:*` is the primary set)

## Gotchas

- Wiki category pages read from the cache populated by the inventory page — there is no direct API fetch on the wiki category pages (known bug)
- There are pre-existing TypeScript errors in the project; don't assume new errors are from your changes
- `.planning/` files are excluded from commits

## Agent configuration

- `.agents/rules/gilded-reliquary.md` — project-specific rules
- `.agents/workflows/` — component and page creation workflows
- `.agents/skills/` — custom skills
