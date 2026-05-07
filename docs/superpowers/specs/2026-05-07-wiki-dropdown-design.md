# Wiki Dropdown in Navbar + UI Fix Design

**Date:** 2026-05-07
**Project:** Elden Ring Tracker (Gilded Reliquary)

---

## Overview

Add wiki dropdown to navbar, remove wiki from sidebar, and fix wiki pages to follow project rules (SCSS in separate files, proper design system).

---

## Changes

### 1. Navbar - Wiki Dropdown

**Location:** `app/components/layout/AppHeader.vue`

- Add dropdown under "Wiki" nav link
- 6 categories: Weapons, Armor, Talismans, Magic, Ashes of War, Spirit Ashes
- Click category → navigate to `/wiki/[category]`

**Style:**
- Use glass-panel effect from `_mixins.scss`
- Max border-radius: 4px
- Gold glow for active state

### 2. Remove Wiki from Sidebar

**Location:** `app/components/layout/AppSidebar.vue`

- Remove wiki item from sidebar navigation
- Wiki only in navbar

### 3. Wiki Category Pages

**Files:**
- Create: `app/pages/wiki/[category]/index.vue`
- Create: `app/assets/scss/pages/_wiki-category.scss`

**Layout:**
- Two columns: sidebar + main content
- Sidebar: 6 clickable categories
- Main: item list with search/sort

**UI Rules (MANDATORY):**
- NO `<style scoped>` in Vue files
- All styles in separate `.scss` files under `app/assets/scss/`
- Use BEM naming: `.wiki-category__element--modifier`
- Section separation via background color shifts (NO `border: 1px solid`)
- Max border-radius: 4px
- Use variables from `_variables.scss`
- Use `glass-panel` mixin for cards

---

## Categories

1. armament → Weapons
2. armor → Armor
3. talisman → Talismans
4. magic → Magic
5. ashesOfWar → Ashes of War
6. spiritAshes → Spirit Ashes

---

## Acceptance Criteria

1. Navbar shows Wiki with dropdown
2. Dropdown has 6 categories, clickable
3. Wiki removed from sidebar
4. Wiki category pages use separate SCSS files
5. UI follows design system rules
6. Responsive on mobile

---

## Out of Scope

- Wiki item detail page (`/wiki/[category]/[id]`)
- Modal functionality (already exists)