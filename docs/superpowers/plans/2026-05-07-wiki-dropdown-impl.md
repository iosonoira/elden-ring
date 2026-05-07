# Wiki Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add wiki dropdown to navbar, remove wiki from sidebar, fix wiki pages to follow project SCSS rules (separate files, proper design system).

**Architecture:** Replace current wiki setup with dropdown-based navigation, create proper SCSS files, remove wiki from sidebar.

**Tech Stack:** Nuxt 4, Vue 3, SCSS, Pinia

---

## Task 1: Add Wiki Dropdown to Navbar

**Files:**
- Modify: `app/components/layout/AppHeader.vue`
- Create: `app/components/layout/AppHeaderDropdown.vue`

- [ ] **Step 1: Create dropdown component**

Create `app/components/layout/AppHeaderDropdown.vue`:

```vue
<script setup lang="ts">
const localePath = useLocalePath()

interface DropdownItem {
  label: string
  href: string
}

defineProps<{
  items: DropdownItem[]
}>()

defineEmits<{
  close: []
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

defineExpose({ close })
</script>

<template>
  <div class="app-header-dropdown">
    <button class="app-header-dropdown__trigger" @click="toggle" aria-haspopup="true" :aria-expanded="isOpen">
      <slot name="trigger" />
      <Icon :name="isOpen ? 'material-symbols:expand-less' : 'material-symbols:expand-more'" size="16" />
    </button>
    <Transition name="dropdown">
      <ul v-if="isOpen" class="app-header-dropdown__menu" role="menu">
        <li v-for="item in items" :key="item.href" role="menuitem">
          <NuxtLink :to="item.href" class="app-header-dropdown__item" @click="close">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/abstracts/variables' as *;
@use '~/assets/scss/abstracts/mixins' as *;

.app-header-dropdown {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-family: $font-headline;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: $color-surface-container-highest;
    background: none;
    border: none;
    cursor: pointer;
    transition: color $transition-base;

    &:hover {
      color: $color-primary;
    }
  }

  &__menu {
    position: absolute;
    top: calc(100% + $space-2);
    left: 50%;
    transform: translateX(-50%);
    min-width: 180px;
    padding: $space-2;
    background: $color-surface-container-high;
    @include glass-panel;
    border-radius: 4px;
    list-style: none;
    z-index: 100;
  }

  &__item {
    display: block;
    padding: $space-2 $space-4;
    font-family: $font-body;
    font-size: 0.875rem;
    color: $color-on-surface;
    text-decoration: none;
    border-radius: 2px;
    transition: background $transition-fast;

    &:hover {
      background: rgba($color-primary, 0.1);
      color: $color-primary;
    }
  }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
```

- [ ] **Step 2: Modify AppHeader to use dropdown**

In `app/components/layout/AppHeader.vue`, replace the Wiki nav item with:

```typescript
const wikiCategories = computed(() => [
  { label: 'Weapons', href: localePath('/wiki/armament') },
  { label: 'Armor', href: localePath('/wiki/armor') },
  { label: 'Talismans', href: localePath('/wiki/talisman') },
  { label: 'Magic', href: localePath('/wiki/magic') },
  { label: 'Ashes of War', href: localePath('/wiki/ashesOfWar') },
  { label: 'Spirit Ashes', href: localePath('/wiki/spiritAshes') },
])

// Replace navItems to use dropdown for Wiki
const navItems = computed(() => [
  { label: 'Checklist', href: localePath('/'), active: route.path === '/' },
  { label: 'Archives', href: localePath('/archives/armament'), active: route.path.startsWith('/archives') },
  { type: 'dropdown', label: 'Wiki', items: wikiCategories.value, active: route.path.startsWith('/wiki') },
  { label: 'Inventory', href: localePath('/inventory/armament'), active: route.path.startsWith('/inventory') },
])
```

Update template:
```vue
<template>
  <nav class="app-header__nav">
    <template v-for="item in navItems" :key="item.label">
      <LayoutAppHeaderDropdown v-if="item.type === 'dropdown'" :items="item.items">
        <template #trigger>
          <span :class="{ 'app-header__nav-link--active': item.active }">Wiki</span>
        </template>
      </LayoutAppHeaderDropdown>
      <NuxtLink v-else :to="item.href" class="app-header__nav-link"
        :class="{ 'app-header__nav-link--active': item.active }">
        {{ item.label }}
      </NuxtLink>
    </template>
  </nav>
</template>
```

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/AppHeader.vue app/components/layout/AppHeaderDropdown.vue
git commit -m "feat: add wiki dropdown to navbar"
```

---

## Task 2: Create Wiki Category Page

**Files:**
- Create: `app/pages/wiki/[category]/index.vue`
- Create: `app/assets/scss/pages/_wiki-category.scss`
- Modify: `app/assets/scss/main.scss`

- [ ] **Step 1: Create SCSS file**

Create `app/assets/scss/pages/_wiki-category.scss`:

```scss
@use '../abstracts/variables' as *;
@use '../abstracts/mixins' as *;

.wiki-category-page {
  padding: $space-8 $space-4;
  max-width: 1400px;
  margin: 0 auto;

  &__header {
    margin-bottom: $space-8;
  }

  &__subtitle {
    display: block;
    font-family: $font-label;
    font-size: 0.625rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: rgba($color-on-surface, 0.5);
    margin-bottom: $space-2;
  }

  &__title {
    display: flex;
    align-items: center;
    gap: $space-3;
    font-family: $font-headline;
    font-size: 2.25rem;
    font-weight: 600;
    color: $color-on-surface;

    .grace-glow {
      @include gold-glow(0.15);
    }
  }

  &__layout {
    display: flex;
    gap: $space-8;
  }

  &__sidebar {
    flex-shrink: 0;
    width: 240px;
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $space-1;
    position: sticky;
    top: $space-8;
  }

  &__nav-item {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-3 $space-4;
    font-family: $font-body;
    font-size: 0.875rem;
    color: rgba($color-on-surface, 0.7);
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all $transition-fast;
    text-align: left;

    &:hover {
      background: $color-surface-container;
      color: $color-on-surface;
    }

    &--active {
      background: $color-surface-container-high;
      color: $color-primary;
      @include gold-glow(0.1);
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__intro {
    color: rgba($color-on-surface, 0.5);
    margin-bottom: $space-6;
    font-family: $font-body;
    font-size: 0.875rem;
  }

  &__controls {
    display: flex;
    gap: $space-4;
    margin-bottom: $space-6;
  }

  &__search {
    flex: 1;
    position: relative;
  }

  &__search-icon {
    position: absolute;
    left: $space-3;
    top: 50%;
    transform: translateY(-50%);
    color: rgba($color-on-surface, 0.4);
  }

  &__search-input {
    width: 100%;
    padding: $space-3 $space-3 $space-3 36px;
    background: $color-surface-container;
    border: none;
    border-radius: 4px;
    color: $color-on-surface;
    font-family: $font-body;
    font-size: 0.875rem;

    &::placeholder {
      color: rgba($color-on-surface, 0.4);
    }

    &:focus {
      outline: none;
      @include gold-glow(0.1);
    }
  }

  &__sort {
    padding: $space-3 $space-4;
    background: $color-surface-container;
    border: none;
    border-radius: 4px;
    color: $color-on-surface;
    font-family: $font-body;
    font-size: 0.875rem;
    cursor: pointer;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $space-3;
    padding: $space-8;
    color: rgba($color-on-surface, 0.5);
  }

  &__spinner {
    width: 24px;
    height: 24px;
    border: 2px solid $color-surface-container-high;
    border-top-color: $color-primary;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: $space-3;
    padding: $space-6;
    color: $color-error;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
    padding: $space-8;
    color: rgba($color-on-surface, 0.5);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: $space-4;
  }

  &__item {
    display: flex;
    gap: $space-4;
    padding: $space-4;
    @include glass-panel;
    border-radius: 4px;
    transition: transform $transition-fast;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &__item-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    border-radius: 2px;
  }

  &__item-info {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-family: $font-headline;
    font-size: 1rem;
    color: $color-on-surface;
    margin-bottom: $space-1;
  }

  &__item-location {
    font-family: $font-body;
    font-size: 0.75rem;
    color: rgba($color-on-surface, 0.5);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .wiki-category-page__layout {
    flex-direction: column;
  }

  .wiki-category-page__sidebar {
    width: 100%;
  }

  .wiki-category-page__nav {
    flex-direction: row;
    position: static;
    overflow-x: auto;
    padding-bottom: $space-2;
  }

  .wiki-category-page__nav-item {
    flex-shrink: 0;
    white-space: nowrap;
  }
}
```

- [ ] **Step 2: Add import to main.scss**

Add to `app/assets/scss/main.scss` after wiki-detail:
```scss
@use 'pages/wiki-category';
```

- [ ] **Step 3: Create Vue page**

Create `app/pages/wiki/[category]/index.vue`:

```vue
<script setup lang="ts">
import { useWikiCategory } from '~/composables/useWikiCategory'

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const category = computed(() => route.params.category as string)

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield_person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness_7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto_awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person_outline' },
]

const activeCategory = ref(category.value)
const searchQuery = ref('')
const sortOption = ref<'az' | 'za'>('az')

const { items, loading, error } = useWikiCategory(activeCategory)

watch(() => route.params.category, (newCategory) => {
  if (newCategory && newCategory !== activeCategory.value) {
    activeCategory.value = newCategory as string
    searchQuery.value = ''
  }
}, { immediate: true })

const filteredItems = computed(() => {
  let result = [...items.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.name.toLowerCase().includes(query))
  }
  
  if (sortOption.value === 'az') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    result.sort((a, b) => b.name.localeCompare(a.name))
  }
  
  return result
})

const currentCategoryLabel = computed(() => {
  const cat = categories.find(c => c.key === category.value)
  return cat ? t(cat.label) : category.value
})

useSeoMeta({
  title: computed(() => `${currentCategoryLabel.value} | Gilded Reliquary`),
  description: computed(() => t('wiki.page.descFallback')),
})
</script>

<template>
  <div class="wiki-category-page">
    <header class="wiki-category-page__header">
      <div class="wiki-category-page__title-group">
        <span class="wiki-category-page__subtitle label-mono">The Archives</span>
        <h1 class="wiki-category-page__title">
          <Icon name="material-symbols:menu-book-outline" size="32" class="grace-glow" />
          {{ currentCategoryLabel }}
        </h1>
      </div>
    </header>

    <div class="wiki-category-page__layout">
      <aside class="wiki-category-page__sidebar">
        <nav class="wiki-category-page__nav">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.key"
            :to="localePath(`/wiki/${cat.key}`)"
            class="wiki-category-page__nav-item"
            :class="{ 'wiki-category-page__nav-item--active': category === cat.key }"
          >
            <Icon :name="`material-symbols:${cat.icon}`" size="18" />
            <span>{{ $t(cat.label) }}</span>
          </NuxtLink>
        </nav>
      </aside>

      <main class="wiki-category-page__content">
        <p class="wiki-category-page__intro">
          {{ $t('wiki.intro') }}
        </p>

        <div class="wiki-category-page__controls">
          <div class="wiki-category-page__search">
            <Icon name="material-symbols:search" size="20" class="wiki-category-page__search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('wiki.searchPlaceholder')"
              class="wiki-category-page__search-input"
            />
          </div>
          <select v-model="sortOption" class="wiki-category-page__sort">
            <option value="az">{{ $t('wiki.sortAz') }}</option>
            <option value="za">{{ $t('wiki.sortZa') }}</option>
          </select>
        </div>

        <div v-if="loading" class="wiki-category-page__loading">
          <div class="wiki-category-page__spinner" />
          <span>{{ $t('wiki.loading') }}</span>
        </div>

        <div v-else-if="error" class="wiki-category-page__error">
          <Icon name="material-symbols:error-outline" size="24" />
          <span>{{ error }}</span>
        </div>

        <div v-else-if="filteredItems.length === 0" class="wiki-category-page__empty">
          <Icon name="material-symbols:inventory-2-outline" size="48" />
          <span>{{ $t('wiki.noItems') }}</span>
        </div>

        <div v-else class="wiki-category-page__grid">
          <NuxtLink
            v-for="item in filteredItems"
            :key="item.id"
            :to="localePath(`/wiki/${category}/${item.id}`)"
            class="wiki-category-page__item"
          >
            <NuxtImg
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="wiki-category-page__item-img"
              format="webp"
              width="64"
              height="64"
            />
            <div class="wiki-category-page__item-info">
              <h3 class="wiki-category-page__item-name">{{ item.name }}</h3>
              <p v-if="item.location" class="wiki-category-page__item-location">{{ item.location }}</p>
            </div>
          </NuxtLink>
        </div>
      </main>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Commit**

```bash
git add app/assets/scss/pages/_wiki-category.scss app/assets/scss/main.scss app/pages/wiki/\[category\]/index.vue
git commit -m "feat: create wiki category page with proper SCSS"
```

---

## Task 3: Remove Wiki from Sidebar

**Files:**
- Modify: `app/components/layout/AppSidebar.vue`

- [ ] **Step 1: Remove wiki item from sidebar**

In `app/components/layout/AppSidebar.vue`, find the items array and remove any wiki entry. The sidebar should only have: Equipment, Magic, Materials, Key Items, Info.

- [ ] **Step 2: Commit**

```bash
git add app/components/layout/AppSidebar.vue
git commit -m "feat: remove wiki from sidebar"
```

---

## Task 4: Remove old wiki index page

**Files:**
- Remove: `app/pages/wiki/index.vue`
- Remove: `app/pages/wiki/[category]/[id].vue` (keep - it's for item detail)

- [ ] **Step 1: Delete old wiki index**

Remove `app/pages/wiki/index.vue` since we now use `/wiki/[category]` pages.

- [ ] **Step 2: Commit**

```bash
git rm app/pages/wiki/index.vue
git commit -m "refactor: remove old wiki index page"
```

---

## Task 5: Test and Verify

- [ ] **Step 1: Start dev server and test**

```bash
pnpm dev
```

- [ ] **Step 2: Verify**
- Navbar shows Wiki with dropdown
- Dropdown has 6 categories
- Clicking category navigates to `/wiki/[category]`
- Wiki removed from sidebar
- Page uses separate SCSS file (not scoped)
- UI follows design system rules

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: wiki dropdown working correctly"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add Wiki dropdown to navbar |
| 2 | Create wiki category page with proper SCSS |
| 3 | Remove Wiki from sidebar |
| 4 | Remove old wiki index page |
| 5 | Test and verify