# Wiki Navbar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move Wiki from sidebar to navbar, make it always accessible, redesign `/wiki` page with sidebar + content layout matching other pages.

**Architecture:** Add Wiki to navbar, create new `/wiki` page with two-column layout (sidebar with categories, main content with items), add composable to fetch all items for a category from API.

**Tech Stack:** Nuxt 4, Vue 3, Pinia, TypeScript

---

## Task 1: Add Wiki to Navbar

**Files:**
- Modify: `app/components/layout/AppHeader.vue:6-10`

- [ ] **Step 1: Add Wiki to navItems array**

```typescript
const navItems = computed(() => [
  { label: 'Checklist', href: localePath('/'), active: route.path === '/' },
  { label: 'Archives', href: localePath('/archives/armament'), active: route.path.startsWith('/archives') },
  { label: 'Wiki', href: localePath('/wiki'), active: route.path.startsWith('/wiki') },
  { label: 'Inventory', href: localePath('/inventory/armament'), active: route.path.startsWith('/inventory') },
])
```

- [ ] **Step 2: Commit**

```bash
git add app/components/layout/AppHeader.vue
git commit -m "feat: add Wiki to navbar"
```

---

## Task 2: Create composable to fetch all category items

**Files:**
- Create: `app/composables/useWikiCategory.ts`

- [ ] **Step 1: Create composable**

```typescript
import type { WikiEntity, ApiResponse } from '~/shared/types/EldenRingApi'

const API_BASE = 'https://eldenring.fanapis.com/api'

const CATEGORY_MAP: Record<string, string> = {
  armament: 'weapons',
  armor: 'armors',
  talisman: 'talismans',
  magic: 'sorceries',
  ashesOfWar: 'ashes',
  spiritAshes: 'spirits'
}

export function useWikiCategory(category: string) {
  const items = ref<WikiEntity[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    const apiCategory = CATEGORY_MAP[category] || category
    loading.value = true
    error.value = null
    
    try {
      // Fetch first page with high limit to get all items
      const response = await $fetch<ApiResponse<WikiEntity[]>>(`${API_BASE}/${apiCategory}`, {
        query: { limit: 200 }
      })
      
      if (response.success && response.data) {
        items.value = response.data
      }
    } catch (e) {
      error.value = 'Failed to fetch items'
      if (import.meta.dev) console.error('useWikiCategory: fetch error', e)
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on mount
  onMounted(fetchAll)

  return {
    items,
    loading,
    error
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/composables/useWikiCategory.ts
git commit -m "feat: add useWikiCategory composable"
```

---

## Task 3: Redesign /wiki page with sidebar + content

**Files:**
- Modify: `app/pages/wiki/index.vue` (entire file replacement)

- [ ] **Step 1: Rewrite wiki index page**

```vue
<script setup lang="ts">
definePageMeta({ layout: 'default' })

const localePath = useLocalePath()
const { t } = useI18n()

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield_person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness_7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto_awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person_outline' },
]

const activeCategory = ref('armament')
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const { items, loading, error } = useWikiCategory(activeCategory.value)

watch(activeCategory, () => {
  // Re-fetch when category changes - create new composable instance
})

const filteredItems = computed(() => {
  let result = items.value
  
  if (searchQuery.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return sortOrder.value === 'asc'
    ? result.sort((a, b) => a.name.localeCompare(b.name))
    : result.sort((a, b) => b.name.localeCompare(a.name))
})

useSeoMeta({
  title: 'Wiki | Gilded Reliquary',
  description: 'Browse the complete archives of Elden Ring items, weapons, armor, and more.',
})
</script>

<template>
  <div class="wiki-page">
    <header class="wiki-page__header">
      <div class="wiki-page__title-group">
        <span class="wiki-page__subtitle label-mono">The Archives</span>
        <h1 class="wiki-page__title">
          <Icon name="material-symbols:menu-book-outline" size="32" class="grace-glow" />
          Wiki
        </h1>
      </div>
    </header>

    <div class="wiki-page__layout">
      <!-- Sidebar -->
      <aside class="wiki-page__sidebar">
        <nav class="wiki-page__nav">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="wiki-page__nav-item"
            :class="{ 'wiki-page__nav-item--active': activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            <Icon :name="`material-symbols:${cat.icon}`" size="20" />
            <span>{{ $t(cat.label) }}</span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="wiki-page__content">
        <div class="wiki-page__intro">
          <p>Explore the complete collection of items, weapons, armor, and more from the Lands Between.</p>
        </div>

        <div class="wiki-page__filters">
          <input 
            v-model="searchQuery"
            type="text"
            :placeholder="$t('wiki.filters.search')"
            class="wiki-page__search"
          />
          <select v-model="sortOrder" class="wiki-page__sort">
            <option value="asc">{{ $t('wiki.filters.sortAZ') }}</option>
            <option value="desc">{{ $t('wiki.filters.sortZA') }}</option>
          </select>
        </div>

        <div v-if="loading" class="wiki-page__loading">
          <Icon name="material-symbols:sync" size="32" class="spin" />
          <p>Loading items...</p>
        </div>

        <div v-else-if="error" class="wiki-page__error">
          <p>{{ error }}</p>
        </div>

        <div v-else class="wiki-page__grid">
          <div
            v-for="item in filteredItems"
            :key="item.id || item.name"
            class="wiki-page__item glass-panel"
          >
            <NuxtImg v-if="item.image" :src="item.image" :alt="item.name" class="wiki-page__item-img" />
            <div class="wiki-page__item-info">
              <h3>{{ item.name }}</h3>
              <p v-if="item.location" class="wiki-page__item-location">{{ item.location }}</p>
            </div>
          </div>
        </div>

        <p v-if="!loading && filteredItems.length === 0" class="wiki-page__empty">
          {{ $t('wiki.category.empty') }}
        </p>
      </main>
    </div>
  </div>
</template>

<style scoped>
.wiki-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
}

.wiki-page__header {
  margin-bottom: var(--spacing-xl);
}

.wiki-page__subtitle {
  display: block;
  font-size: var(--font-size-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: var(--spacing-xs);
}

.wiki-page__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 600;
}

.wiki-page__layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--spacing-xl);
}

.wiki-page__sidebar {
  position: sticky;
  top: var(--spacing-xl);
  height: fit-content;
}

.wiki-page__nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.wiki-page__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.wiki-page__nav-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text);
}

.wiki-page__nav-item--active {
  background: var(--color-surface);
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.wiki-page__content {
  min-width: 0;
}

.wiki-page__intro {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-muted);
}

.wiki-page__filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.wiki-page__search {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
}

.wiki-page__sort {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text);
}

.wiki-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.wiki-page__item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  transition: transform var(--transition-fast);
}

.wiki-page__item:hover {
  transform: translateY(-2px);
}

.wiki-page__item-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.wiki-page__item-info h3 {
  margin: 0 0 var(--spacing-xs);
  font-size: var(--font-size-base);
}

.wiki-page__item-location {
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  margin: 0;
}

.wiki-page__loading,
.wiki-page__error,
.wiki-page__empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--spacing-xl);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .wiki-page__layout {
    grid-template-columns: 1fr;
  }
  
  .wiki-page__sidebar {
    position: static;
  }
  
  .wiki-page__nav {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }
  
  .wiki-page__nav-item {
    white-space: nowrap;
  }
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add app/pages/wiki/index.vue
git commit -m "feat: redesign wiki index with sidebar and content"
```

---

## Task 4: Add WikiItemModal component (if not exists)

**Files:**
- Check: `app/components/wiki/WikiItemModal.vue` (create if missing)

- [ ] **Step 1: Check if WikiItemModal exists, create if missing**

If not exists, create with:
- Full-screen overlay, centered modal (max 600px)
- Close button (X) top-right
- Click outside to close
- Item image (large), name (h2), description (lore), location
- "View Full Page" button

- [ ] **Step 2: Commit**

---

## Task 5: Test and verify

- [ ] **Step 1: Start dev server and test**

```bash
pnpm dev
```

- [ ] **Step 2: Verify**
- Navbar shows Wiki link
- Clicking Wiki goes to /wiki
- /wiki has sidebar with 6 categories
- Clicking category shows items
- Search and sort work
- Click item shows modal

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: wiki navbar and page working"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add Wiki to navbar |
| 2 | Create useWikiCategory composable |
| 3 | Redesign /wiki page with sidebar + content |
| 4 | Ensure WikiItemModal exists |
| 5 | Test and verify