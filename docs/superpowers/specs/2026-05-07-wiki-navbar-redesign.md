# Wiki Navbar Redesign

**Date:** 2026-05-07
**Project:** Elden Ring Tracker (Gilded Reliquary)

---

## Overview

Move Wiki from sidebar to navbar, make it always accessible, and redesign the page layout to match other pages (sidebar + content).

---

## Changes

### 1. Navbar

Add "Wiki" link between Archives and Inventory:
- Label: Wiki
- Icon: `menu_book` (outline)
- Target: `/wiki`

### 2. Page `/wiki`

**Layout:** Two columns (sidebar + main content)

**Header:**
- Title: "The Archives"
- Subtitle: "Wiki"
- Description: What the wiki contains

**Sidebar:**
- 6 categories (same as current)
- Click to select category
- Active state highlighted

**Main Content:**
- Default: show items of first category (armament)
- When category selected: show item list of that category
- Item list: thumbnail, name, location, click → modal

### 3. Item Click

- Opens WikiItemModal (existing behavior)
- "View Full Page" navigates to `/wiki/[category]/[id]`

---

## Categories

1. Weapons (armament)
2. Armor (armor)
3. Talismans (talisman)
4. Magic (magic)
5. Ashes of War (ashesOfWar)
6. Spirit Ashes (spiritAshes)

---

## Data Source

Items fetched from API via `useWikiStore` (existing).

---

## Acceptance Criteria

1. Navbar shows "Wiki" link, clickable
2. `/wiki` page has sidebar with 6 categories
3. Clicking category in sidebar shows its items
4. Clicking item opens modal with details
5. Modal "View Full Page" works
6. Responsive on mobile

---

## Out of Scope

- Removing wiki from sidebar (future task)
- Changing `/wiki/[category]` and `/wiki/[category]/[id]` pages