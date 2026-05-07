# Wiki Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add internal wiki functionality with sidebar nav, index page, category pages, and modal for item details.

**Architecture:** Reuse existing useWikiStore API integration. Create new wiki pages (index, category list) and modal component. Update ItemCard to open modal instead of external links.

**Tech Stack:** Nuxt 3, Pinia (useWikiStore), Vue components, i18n

---

## File Structure

```
app/
├── components/
│   └── wiki/
│       └── WikiItemModal.vue        (NEW - modal component)
├── pages/
│   └── wiki/
│       ├── index.vue                 (NEW - wiki index)
│       ├── [category]/
│       │   ├── index.vue             (NEW - category list)
│       │   └── [id].vue              (EXISTING - detail page)
├── components/
│   ├── wiki/
│   │   └── ItemCard.vue              (MODIFY - use modal)
│   └── layout/
│       └── AppSidebar.vue            (MODIFY - add Wiki nav)
locales/
├── en.json                           (MODIFY - add wiki keys)
└── it.json                           (MODIFY - add wiki keys)
```

---

## Task 1: Add Wiki Nav Item to Sidebar

**Files:**
- Modify: `app/components/layout/AppSidebar.vue:90-134`

- [ ] **Step 1: Read current AppSidebar.vue to understand the nav structure**

- [ ] **Step 2: Add Wiki nav item after existing items**

```vue
{ 
  key: 'wiki', 
  label: 'Wiki', 
  icon: 'menu_book', 
  owned: 0, 
  total: 0 
},
```

- [ ] **Step 3: Update getInventoryTarget to handle wiki route**

Add a check at the start of the function:

```typescript
if (item.key === 'wiki') {
  return localePath('/wiki')
}
```

- [ ] **Step 4: Commit**

```bash
git add app/components/layout/AppSidebar.vue
git commit -m "feat: add Wiki nav item to sidebar"
```

---

## Task 2: Create Wiki Index Page

**Files:**
- Create: `app/pages/wiki/index.vue`

- [ ] **Step 1: Create the wiki index page with category grid**

```vue
<script setup lang="ts">
const localePath = useLocalePath()

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield_person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness_7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto_awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person_outline' },
]

const getCategoryIcon = (icon: string) => `material-symbols:${icon}${icon.includes('outline') ? '' : '-outline'}`
</script>

<template>
  <div class="wiki-index">
    <header class="wiki-index__header">
      <Icon name="material-symbols:menu-book" size="32" />
      <h1>{{ $t('wiki.index.title') }}</h1>
    </header>

    <div class="wiki-index__categories">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.key"
        :to="localePath(`/wiki/${cat.key}`)"
        class="wiki-index__card glass-panel"
      >
        <Icon :name="getCategoryIcon(cat.icon)" size="48" />
        <span class="wiki-index__card-label">{{ $t(cat.label) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.wiki-index {
  padding: 2rem;
}
.wiki-index__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.wiki-index__header h1 {
  font-size: 1.75rem;
  margin: 0;
}
.wiki-index__categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.wiki-index__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.wiki-index__card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.15);
}
.wiki-index__card-label {
  font-weight: 500;
}
</style>
```

- [ ] **Step 2: Verify page works at /wiki**

- [ ] **Step 3: Commit**

```bash
git add app/pages/wiki/index.vue
git commit -m "feat: create wiki index page with category grid"
```

---

## Task 3: Create Wiki Category List Page

**Files:**
- Create: `app/pages/wiki/[category]/index.vue`

- [ ] **Step 1: Create the category list page**

```vue
<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const category = computed(() => route.params.category as string)
const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const wikiStore = useWikiStore()

const categoryLabel = computed(() => {
  const labels: Record<string, string> = {
    armament: 'wiki.category.weapons',
    armor: 'wiki.category.armor',
    talisman: 'wiki.category.talismans',
    magic: 'wiki.category.magic',
    ashesOfWar: 'wiki.category.ashesOfWar',
    spiritAshes: 'wiki.category.spiritAshes'
  }
  return labels[category.value] || category.value
})

const items = computed(() => {
  const categoryItems = wikiStore.cache
  const filtered = Object.entries(categoryItems)
    .filter(([key]) => key.startsWith(category.value))
    .map(([, item]) => item)
    .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
  
  if (searchQuery.value) {
    return filtered.filter(item => 
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  return sortOrder.value === 'asc' 
    ? filtered.sort((a, b) => a.name.localeCompare(b.name))
    : filtered.sort((a, b) => b.name.localeCompare(a.name))
})

const openModal = (item: any) => {
  wikiStore.fetchItemDetails(category.value, item.name)
}
</script>

<template>
  <div class="wiki-category">
    <header class="wiki-category__header">
      <NuxtLink :to="localePath('/wiki')" class="wiki-category__back">
        <Icon name="material-symbols:arrow-back" size="20" />
        {{ $t('wiki.breadcrumb.back') }}
      </NuxtLink>
      <h1>{{ $t(categoryLabel) }}</h1>
    </header>

    <div class="wiki-category__filters">
      <input 
        v-model="searchQuery"
        type="text"
        :placeholder="$t('wiki.filters.search')"
        class="wiki-category__search"
      />
      <select v-model="sortOrder" class="wiki-category__sort">
        <option value="asc">{{ $t('wiki.filters.sortAZ') }}</option>
        <option value="desc">{{ $t('wiki.filters.sortZA') }}</option>
      </select>
    </div>

    <div class="wiki-category__grid">
      <div
        v-for="item in items"
        :key="item.name"
        class="wiki-category__item glass-panel"
        @click="openModal(item)"
      >
        <NuxtImg v-if="item.image" :src="item.image" :alt="item.name" class="wiki-category__item-img" />
        <div class="wiki-category__item-info">
          <h3>{{ item.name }}</h3>
          <p v-if="item.location" class="wiki-category__item-location">{{ item.location }}</p>
        </div>
      </div>
    </div>

    <p v-if="items.length === 0" class="wiki-category__empty">
      {{ $t('wiki.category.empty') }}
    </p>
  </div>
</template>

<style scoped>
.wiki-category {
  padding: 2rem;
}
.wiki-category__header {
  margin-bottom: 1.5rem;
}
.wiki-category__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 0.5rem;
}
.wiki-category__filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.wiki-category__search {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text);
}
.wiki-category__sort {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text);
}
.wiki-category__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
.wiki-category__item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.wiki-category__item:hover {
  transform: translateY(-2px);
}
.wiki-category__item-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
.wiki-category__item-info h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}
.wiki-category__item-location {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin: 0;
}
.wiki-category__empty {
  text-align: center;
  color: var(--text-muted);
  padding: 3rem;
}
</style>
```

- [ ] **Step 2: Verify page works at /wiki/[category]**

- [ ] **Step 3: Commit**

```bash
git add app/pages/wiki/[category]/index.vue
git commit -m "feat: create wiki category list page"
```

---

## Task 4: Create Wiki Item Modal Component

**Files:**
- Create: `app/components/wiki/WikiItemModal.vue`

- [ ] **Step 1: Create the modal component**

```vue
<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

interface Props {
  category: string
  itemName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  navigate: [category: string, id: string]
}>()

const localePath = useLocalePath()
const wikiStore = useWikiStore()

const item = computed(() => wikiStore.getCachedItem(props.category, props.itemName))
const isLoading = computed(() => wikiStore.isItemLoading(props.category, props.itemName))

const close = () => emit('close')

const viewFullPage = () => {
  if (item.value) {
    emit('navigate', props.category, item.value.id || props.itemName)
  }
}

onMounted(() => {
  wikiStore.fetchItemDetails(props.category, props.itemName)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.body.style.overflow = ''
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
</script>

<template>
  <Teleport to="body">
    <div class="wiki-modal-overlay" @click.self="close" @keydown="handleKeydown">
      <div class="wiki-modal glass-panel" role="dialog" aria-modal="true">
        <button class="wiki-modal__close" @click="close" :aria-label="$t('wiki.modal.close')">
          <Icon name="material-symbols:close" size="24" />
        </button>

        <div v-if="isLoading" class="wiki-modal__loading">
          <div class="wiki-modal__loader"></div>
        </div>

        <div v-else-if="item" class="wiki-modal__content">
          <div class="wiki-modal__image-container">
            <NuxtImg v-if="item.image" :src="item.image" :alt="item.name" class="wiki-modal__image" />
          </div>
          
          <h2 class="wiki-modal__title">{{ item.name }}</h2>
          
          <p v-if="item.description" class="wiki-modal__description lore-text italic">
            {{ item.description }}
          </p>
          
          <div v-if="item.location" class="wiki-modal__meta">
            <span class="wiki-modal__meta-label">{{ $t('wiki.label.location') }}</span>
            <span class="wiki-modal__meta-value">{{ item.location }}</span>
          </div>

          <button class="wiki-modal__button" @click="viewFullPage">
            {{ $t('wiki.modal.viewFull') }}
            <Icon name="material-symbols:arrow-forward" size="18" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.wiki-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}
.wiki-modal {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}
.wiki-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
}
.wiki-modal__close:hover {
  color: var(--text);
}
.wiki-modal__loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}
.wiki-modal__loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.wiki-modal__image-container {
  text-align: center;
  margin-bottom: 1.5rem;
}
.wiki-modal__image {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
}
.wiki-modal__title {
  font-size: 1.5rem;
  margin: 0 0 1rem;
}
.wiki-modal__description {
  margin-bottom: 1.5rem;
}
.wiki-modal__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
}
.wiki-modal__meta-label {
  color: var(--text-muted);
  font-size: 0.875rem;
}
.wiki-modal__meta-value {
  font-weight: 500;
}
.wiki-modal__button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}
.wiki-modal__button:hover {
  transform: translateY(-2px);
}
</style>
```

- [ ] **Step 2: Verify modal component is created**

- [ ] **Step 3: Commit**

```bash
git add app/components/wiki/WikiItemModal.vue
git commit -m "feat: create wiki item modal component"
```

---

## Task 5: Update ItemCard to Use Modal

**Files:**
- Modify: `app/components/wiki/ItemCard.vue`

- [ ] **Step 1: Read current ItemCard.vue**

- [ ] **Step 2: Add modal functionality and replace external link**

Add import and state:

```typescript
import WikiItemModal from './WikiItemModal.vue'

const isModalOpen = ref(false)

const openWikiModal = () => {
  if (props.category && props.item?.name) {
    wikiStore.fetchItemDetails(props.category, props.item.name)
    isModalOpen.value = true
  }
}
```

Replace the link in template:

```vue
<button class="item-card__link label-mono" @click="openWikiModal">
  Wiki <Icon name="material-symbols:open-in-new" size="10" />
</button>
```

Add modal component at bottom of template:

```vue
<WikiItemModal
  v-if="isModalOpen"
  :category="category"
  :item-name="item.name"
  @close="isModalOpen = false"
  @navigate="(cat, id) => navigateTo(localePath(`/wiki/${cat}/${id}`))"
/>
```

- [ ] **Step 3: Verify ItemCard still renders correctly**

- [ ] **Step 4: Commit**

```bash
git add app/components/wiki/ItemCard.vue
git commit -m "feat: update ItemCard to use internal wiki modal"
```

---

## Task 6: Add Localization Keys

**Files:**
- Modify: `locales/en.json`
- Modify: `locales/it.json`

- [ ] **Step 1: Add wiki keys to en.json**

Add to existing wiki section:

```json
"wiki": {
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
    "spiritAshes": "Spirit Ashes",
    "empty": "No items found"
  },
  "modal": {
    "viewFull": "View Full Page",
    "close": "Close"
  },
  "filters": {
    "search": "Search",
    "sortAZ": "Name A-Z",
    "sortZA": "Name Z-A"
  },
  "breadcrumb": {
    "back": "Back to Wiki"
  }
}
```

- [ ] **Step 2: Add same keys to it.json (Italian translations)**

```json
"wiki": {
  "index": {
    "title": "Wiki",
    "search": "Cerca oggetti...",
    "categories": "Categorie"
  },
  "category": {
    "weapons": "Armi",
    "armor": "Armature",
    "talismans": "Talismani",
    "magic": "Magie",
    "ashesOfWar": "Ceneri di Guerra",
    "spiritAshes": "Ceneri Spirituali",
    "empty": "Nessun oggetto trovato"
  },
  "modal": {
    "viewFull": "Visualizza Pagina Intera",
    "close": "Chiudi"
  },
  "filters": {
    "search": "Cerca",
    "sortAZ": "Nome A-Z",
    "sortZA": "Nome Z-A"
  },
  "breadcrumb": {
    "back": "Torna alla Wiki"
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add locales/en.json locales/it.json
git commit -m "feat: add wiki localization keys"
```

---

## Task 7: Add Breadcrumb to Existing Wiki Page

**Files:**
- Modify: `app/pages/wiki/[category]/[id].vue`

- [ ] **Step 1: Read current wiki detail page**

- [ ] **Step 2: Add breadcrumb navigation**

Add to template after opening div:

```vue
<nav class="wiki-page__breadcrumb">
  <NuxtLink :to="localePath('/wiki')">{{ $t('wiki.index.title') }}</NuxtLink>
  <Icon name="material-symbols:chevron-right" size="16" />
  <NuxtLink :to="localePath(`/wiki/${category}`)">{{ $t('wiki.category.' + category) }}</NuxtLink>
  <Icon name="material-symbols:chevron-right" size="16" />
  <span>{{ item?.name }}</span>
</nav>
```

Add styles:

```css
.wiki-page__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}
.wiki-page__breadcrumb a {
  color: var(--text-muted);
  text-decoration: none;
}
.wiki-page__breadcrumb a:hover {
  color: var(--accent);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/pages/wiki/[category]/[id].vue
git commit -m "feat: add breadcrumb to wiki detail page"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Add Wiki nav item to sidebar |
| 2 | Create wiki index page (/wiki) |
| 3 | Create wiki category page (/wiki/[category]) |
| 4 | Create wiki item modal component |
| 5 | Update ItemCard to use modal |
| 6 | Add localization keys |
| 7 | Add breadcrumb to existing wiki page |

**Total: 7 tasks**

---

## Acceptance Criteria Verification

After implementation, verify:

- [ ] Sidebar shows "Wiki" nav item, navigates to `/wiki`
- [ ] Wiki index shows 6 category cards
- [ ] Clicking category navigates to `/wiki/[category]`
- [ ] Category page shows filterable item list
- [ ] Clicking "Wiki" on ItemCard opens modal with item details
- [ ] Modal "View Full Page" navigates to full wiki page
- [ ] Full wiki page has breadcrumb navigation
- [ ] All text localized (en + it)
- [ ] Responsive on mobile