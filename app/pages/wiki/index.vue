<script setup lang="ts">
definePageMeta({ layout: 'default' })

const localePath = useLocalePath()

useSeoMeta({
  title: 'Wiki | Gilded Reliquary',
  description: 'Browse the complete archives of Elden Ring items, weapons, armor, and more.',
})

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
const sortOption = ref<'az' | 'za'>('az')

const { items, loading, error, fetch: fetchCategory } = useWikiCategory(activeCategory)

onMounted(() => {
  fetchCategory()
})

watch(activeCategory, () => {
  searchQuery.value = ''
})

const filteredItems = computed(() => {
  let result = [...items.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(query)
    )
  }
  
  if (sortOption.value === 'az') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    result.sort((a, b) => b.name.localeCompare(a.name))
  }
  
  return result
})
</script>

<template>
  <div class="wiki-index-page">
    <header class="wiki-index-page__header">
      <div class="wiki-index-page__title-group">
        <span class="wiki-index-page__subtitle label-mono">The Archives</span>
        <h1 class="wiki-index-page__title">
          <Icon name="material-symbols:menu-book-outline" size="32" class="grace-glow" />
          Wiki
        </h1>
      </div>
    </header>

    <div class="wiki-index-page__layout">
      <aside class="wiki-index-page__sidebar">
        <nav class="wiki-index-page__nav">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="wiki-index-page__nav-item"
            :class="{ 'wiki-index-page__nav-item--active': activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            <Icon :name="`material-symbols:${cat.icon}`" size="20" />
            <span>{{ $t(cat.label) }}</span>
          </button>
        </nav>
      </aside>

      <main class="wiki-index-page__content">
        <p class="wiki-index-page__intro">
          {{ $t('wiki.intro') }}
        </p>

        <div class="wiki-index-page__controls">
          <div class="wiki-index-page__search">
            <Icon name="material-symbols:search" size="20" class="wiki-index-page__search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('wiki.searchPlaceholder')"
              class="wiki-index-page__search-input"
            />
          </div>
          <select v-model="sortOption" class="wiki-index-page__sort">
            <option value="az">{{ $t('wiki.sortAz') }}</option>
            <option value="za">{{ $t('wiki.sortZa') }}</option>
          </select>
        </div>

        <div v-if="loading" class="wiki-index-page__loading">
          <div class="wiki-index-page__spinner" />
          <span>{{ $t('wiki.loading') }}</span>
        </div>

        <div v-else-if="error" class="wiki-index-page__error">
          <Icon name="material-symbols:error-outline" size="24" />
          <span>{{ error }}</span>
        </div>

        <div v-else-if="filteredItems.length === 0" class="wiki-index-page__empty">
          <Icon name="material-symbols:inventory-2-outline" size="48" />
          <span>{{ $t('wiki.noItems') }}</span>
        </div>

        <div v-else class="wiki-index-page__grid">
          <WikiItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :category="activeCategory"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.wiki-index-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1400px;
  margin: 0 auto;
}

.wiki-index-page__header {
  margin-bottom: var(--spacing-xl);
}

.wiki-index-page__subtitle {
  display: block;
  font-size: var(--font-size-sm);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.6;
  margin-bottom: var(--spacing-xs);
}

.wiki-index-page__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-3xl);
  font-weight: 600;
}

.wiki-index-page__layout {
  display: flex;
  gap: var(--spacing-xl);
}

.wiki-index-page__sidebar {
  flex-shrink: 0;
  width: 240px;
}

.wiki-index-page__nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  position: sticky;
  top: var(--spacing-xl);
}

.wiki-index-page__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.wiki-index-page__nav-item:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-hover);
}

.wiki-index-page__nav-item--active {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-bg);
}

.wiki-index-page__content {
  flex: 1;
  min-width: 0;
}

.wiki-index-page__intro {
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-lg);
}

.wiki-index-page__controls {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.wiki-index-page__search {
  flex: 1;
  position: relative;
}

.wiki-index-page__search-icon {
  position: absolute;
  left: var(--spacing-sm);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.wiki-index-page__search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 36px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.wiki-index-page__search-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.wiki-index-page__sort {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.wiki-index-page__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}

.wiki-index-page__spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.wiki-index-page__error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  color: var(--color-error);
}

.wiki-index-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}

.wiki-index-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .wiki-index-page__layout {
    flex-direction: column;
  }

  .wiki-index-page__sidebar {
    width: 100%;
  }

  .wiki-index-page__nav {
    flex-direction: row;
    position: static;
    overflow-x: auto;
    padding-bottom: var(--spacing-sm);
  }

  .wiki-index-page__nav-item {
    flex-shrink: 0;
    white-space: nowrap;
  }
}
</style>