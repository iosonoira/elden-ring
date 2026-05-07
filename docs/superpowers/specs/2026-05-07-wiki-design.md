# Wiki Feature Design

**Date:** 2026-05-07
**Project:** Elden Ring Tracker (Gilded Reliquary)

---

## Overview

Add internal wiki functionality to replace external wiki links with a seamless in-app experience.

**User Request:**
- Add "Wiki" nav item in sidebar
- Wiki contains item data with descriptions and locations
- Replace external site links with internal wiki (modal + full page)

---

## Architecture

### Pages

| Route | Purpose |
|-------|---------|
| `/wiki` | Index - browse categories |
| `/wiki/[category]` | Category list - filter items |
| `/wiki/[category]/[id]` | Item detail page (existing) |

### Components

| Component | Purpose |
|-----------|---------|
| `AppSidebar` | Add Wiki nav item |
| `WikiIndex` | Category grid + search |
| `WikiCategoryList` | Filterable item list |
| `WikiItemModal` | Modal with item details |

---

## UI/UX Specification

### Sidebar

Add nav item:
- **Label:** Wiki
- **Icon:** `menu_book` (outline inactive, filled active)
- **Target:** `/wiki`
- **Position:** After navigation items, before settings

### Wiki Index Page (`/wiki`)

**Layout:**
- Page title: "Wiki" with book icon
- Search bar (full width, prominent)
- Category grid (2 columns desktop, 1 mobile)

**Category Card:**
- Thumbnail/icon
- Category name (localized)
- Item count
- Hover: subtle glow effect

**Categories:**
- Weapons (armament)
- Armor (armor)
- Talismans (talisman)
- Magic (magic)
- Ashes of War (ashesOfWar)
- Spirit Ashes (spiritAshes)

### Wiki Category Page (`/wiki/[category]`)

**Layout:**
- Breadcrumb: Wiki > Category
- Search/filter bar
- Item grid (responsive)

**Filters:**
- Search by name
- Sort: Name A-Z, Name Z-A

**Item Card (list view):**
- Thumbnail
- Name
- Location (if available)
- Click → open modal

### Wiki Item Modal

**Trigger:** Click "Wiki" link on ItemCard

**Layout:**
- Full-screen overlay with centered modal (max 600px width)
- Close button (X) top-right
- Click outside to close

**Content:**
- Item image (large)
- Item name (h2)
- Category badge
- Description (lore text, italic)
- Location (if available)
- "View Full Page" button → navigate to `/wiki/[category]/[id]`

**Behavior:**
- URL does not change (modal state only)
- Keyboard: Escape to close
- Focus trapped in modal

### Existing Wiki Page (`/wiki/[category]/[id]`)

**Changes:**
- Add breadcrumb: Wiki > Category > Item Name
- Add "Back to Category" link
- Existing functionality unchanged

---

## Technical Implementation

### Reuse Existing

- `useWikiStore` - already fetches and caches item data
- `/wiki/[category]/[id].vue` - existing detail page
- API integration - already working via fanapis.com
- Localization - use existing i18n keys

### New Components

1. **WikiIndex.vue** - category grid at `/wiki`
2. **WikiCategoryList.vue** - item list at `/wiki/[category]`
3. **WikiItemModal.vue** - modal component

### ItemCard Changes

Update `ItemCard.vue`:
- Replace external link with internal wiki handler
- Open modal instead of `window.open`

```typescript
// ItemCard.vue - new function
function openWikiModal() {
  wikiStore.fetchItemDetails(props.category, props.item.name)
  isModalOpen.value = true
}
```

### Routing

Add these routes in `nuxt.config.ts` or pages directory:

```
app/pages/wiki/
├── index.vue          → WikiIndex
└── [category]/
    ├── index.vue      → WikiCategoryList
    └── [id].vue       → existing
```

---

## Localization

Add keys:

```json
{
  "wiki": {
    "nav": "Wiki",
    "index": {
      "title": "Wiki",
      "search": "Search items...",
      "categories": "Categories"
    },
    "category": {
      "weapons": "Weapons",
      "armor": "Armor",
      "talismans": "Talismans",
      "magic": "Magic",
      "ashesOfWar": "Ashes of War",
      "spiritAshes": "Spirit Ashes"
    },
    "modal": {
      "viewFull": "View Full Page",
      "close": "Close"
    },
    "filters": {
      "search": "Search",
      "sortAZ": "Name A-Z",
      "sortZA": "Name Z-A"
    }
  }
}
```

---

## Acceptance Criteria

1. Sidebar shows "Wiki" nav item, navigates to `/wiki`
2. Wiki index shows 6 category cards with counts
3. Clicking category navigates to `/wiki/[category]`
4. Category page shows filterable item list
5. Clicking "Wiki" on ItemCard opens modal with item details
6. Modal "View Full Page" navigates to full wiki page
7. Full wiki page has breadcrumb navigation
8. All text localized
9. Responsive on mobile

---

## Scope

**Phase 1 (this spec):**
- Item data from existing API (descriptions, locations)
- Categories: weapons, armor, talismans, magic, ashes, spirits
- Modal + full page views

**Future phases (out of scope):**
- Boss information
- NPC/lore details
- Build guides
- Community contributions