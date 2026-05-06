# Elden Ring Tracker

## What This Is

A modern web application that serves as both an **Elden Ring Save File Analyzer** and **Interactive Wiki**. Users can load their game save files to track progress, view defeated bosses, discover missing items, and explore a comprehensive encyclopedia of game items, weapons, and lore.

## Core Value

Players can instantly see what items they have, what's missing, and explore the game's vast encyclopedia — all in a polished, immersive dark interface.

## Requirements

### Validated

- ✓ Nuxt 3 application with Vue 3 Composition API
- ✓ Pinia state management for wiki and save data
- ✓ Save file upload and binary parsing (.sl2 files)
- ✓ Inventory tracking with owned/missing item categorization
- ✓ External API integration (eldenring.fanapis.com)
- ✓ Wiki pages for items by category (weapons, armors, items, etc.)
- ✓ i18n support (English, Italian)
- ✓ Basic UI layout (header, sidebar)
- ✓ SCSS styling infrastructure

### Active

- [ ] Visual & UX Upgrade — Transform UI to modern FromSoftware dark aesthetic
- [ ] Save file integration improvements — Better parsing, more character data
- [ ] Navigation & State Persistence — Fix data display logic and state management

### Out of Scope

- [Backend server] — Client-side only application
- [User accounts] — No authentication required
- [Real-time updates] — Static data, no WebSocket connections

## Context

**Existing codebase analysis:**
- Full Nuxt 3 application already built with components, stores, composables
- Save parser extracts inventory IDs from binary .sl2 files
- Wiki fetches data from external Fan API
- Basic layout with header/sidebar exists
- SCSS infrastructure in place (variables, mixins)
- i18n configured with English and Italian locales

**User's vision for upgrade:**
- Dark, elegant, immersive aesthetic (modern FromSoftware style)
- Smooth animations throughout the UI
- Improved save file integration
- Enhanced wiki experience

## Constraints

- **[Tech Stack]**: Nuxt 3, Vue 3, Pinia, SCSS — Must use existing stack
- **[API]**: Elden Ring Fan API — External dependency, no local fallback
- **[Browser]**: Client-side only — No SSR for save file parsing
- **[No Backend]**: All processing happens in the browser

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Nuxt 3 + Pinia | Already implemented, proven working | ✓ Good |
| Client-side save parsing | Binary files require browser File API | ✓ Good |
| Fan API for wiki | Only available free Elden Ring API | ⚠️ Revisit if API goes down |
| Sequential phases | User preference for focused execution | — Pending |

---

## Current Milestone: v1.0 Navigation & State Persistence

**Goal:** Fix data display logic between Archives/Inventory sections and ensure save file state persists during navigation

**Target features:**
- Archives shows full encyclopedia items
- Inventory shows only user-owned items from save file
- Save file state persists globally across navigation
- Smart redirect: no save → Archives, save loaded → Inventory

---

*Last updated: 2026-05-06*
*Milestone v1.0 started: 2026-05-06*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state