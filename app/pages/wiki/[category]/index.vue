<script setup lang="ts">
import type { WikiCategory, WikiEntity } from '~/shared/types/EldenRingApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()

const category = computed(() => route.params.category as WikiCategory)

const searchQuery = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

const apiCategoryMap: Record<WikiCategory, string> = {
  armament: 'weapons',
  armor: 'armors',
  talisman: 'talismans',
  magic: 'sorceries',
  ashesOfWar: 'ashes',
  spiritAshes: 'spirits'
}

const finalCategory = computed(() => apiCategoryMap[category.value] || category.value)

const { data: response, pending, error } = await useFetch<{ success: boolean; data: WikiEntity[] }>(
  `https://eldenring.fanapis.com/api/${finalCategory.value}`,
  {
    query: { limit: 200 }
  }
)

const items = computed(() => {
  if (!response.value?.data) return []
  return response.value.data
})

const filteredItems = computed(() => {
  let result = items.value
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.name?.toLowerCase().includes(query)
    )
  }
  
  result = [...result].sort((a, b) => {
    const nameA = a.name || ''
    const nameB = b.name || ''
    return sortOrder.value === 'asc' 
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA)
  })
  
  return result
})

const categoryLabel = computed(() => {
  const key = `wiki.category.${category.value}`
  return t(key)
})

useSeoMeta({
  title: computed(() => `${categoryLabel.value} | Gilded Reliquary`),
  description: computed(() => `Browse all ${categoryLabel.value.toLowerCase()} in Elden Ring.`)
})
</script>

<template>
  <div class="wiki-category-page">
    <header class="wiki-category-page__header">
      <nav class="wiki-category-page__breadcrumb">
        <NuxtLink :to="localePath('/wiki')" class="breadcrumb-link">{{ $t('wiki.breadcrumb.home') }}</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ categoryLabel }}</span>
      </nav>
      
      <h1 class="wiki-category-page__title">
        <Icon name="material-symbols:menu-book-outline" size="32" class="grace-glow" />
        {{ categoryLabel }}
      </h1>
    </header>

    <div class="wiki-category-page__filters">
      <div class="wiki-category-page__search">
        <Icon name="material-symbols:search" size="20" class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          :placeholder="$t('wiki.filters.search')"
          class="search-input"
        />
      </div>
      
      <div class="wiki-category-page__sort">
        <select v-model="sortOrder" class="sort-select">
          <option value="asc">{{ $t('wiki.filters.sortAZ') }}</option>
          <option value="desc">{{ $t('wiki.filters.sortZA') }}</option>
        </select>
      </div>
    </div>

    <div v-if="pending" class="wiki-category-page__loading">
      <div class="wiki-category-page__skeleton-grid">
        <div v-for="i in 12" :key="i" class="wiki-category-page__skeleton-card">
          <div class="skeleton-img"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text skeleton-text--short"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="wiki-category-page__error">
      <h2>{{ $t('wiki.error.title') }}</h2>
      <p>{{ $t('wiki.error.message') }}</p>
    </div>

    <div v-else class="wiki-category-page__grid">
      <NuxtLink
        v-for="item in filteredItems"
        :key="item.id"
        :to="localePath(`/wiki/${category}/${item.name}`)"
        class="wiki-item-card"
      >
        <div class="wiki-item-card__image-wrap">
          <NuxtImg
            v-if="item.image"
            :src="item.image"
            format="webp"
            width="120"
            height="120"
            class="wiki-item-card__image"
            :alt="item.name"
          />
          <Icon v-else name="material-symbols:image-outline" size="48" class="wiki-item-card__placeholder" />
        </div>
        <div class="wiki-item-card__info">
          <h3 class="wiki-item-card__name">{{ item.name }}</h3>
          <p v-if="item.location" class="wiki-item-card__location">{{ item.location }}</p>
        </div>
      </NuxtLink>
    </div>

    <div v-if="!pending && filteredItems.length === 0" class="wiki-category-page__empty">
      <p>{{ $t('wiki.filters.noResults') }}</p>
    </div>
  </div>
</template>

<style scoped>
.wiki-category-page {
  padding: var(--spacing-xl) var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
}

.wiki-category-page__header {
  margin-bottom: var(--spacing-lg);
}

.wiki-category-page__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-sm);
}

.breadcrumb-link {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--color-accent);
}

.breadcrumb-separator {
  opacity: 0.5;
}

.breadcrumb-current {
  color: var(--color-text);
}

.wiki-category-page__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-headline);
  font-size: var(--font-size-2xl);
  font-weight: 600;
}

.wiki-category-page__filters {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.wiki-category-page__search {
  flex: 1;
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md) var(--spacing-sm) calc(var(--spacing-xl) + var(--spacing-sm));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.wiki-category-page__sort {
  min-width: 150px;
}

.sort-select {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-accent);
}

.wiki-category-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.wiki-item-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-fast);
}

.wiki-item-card:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-hover);
  transform: translateY(-2px);
}

.wiki-item-card__image-wrap {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.wiki-item-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wiki-item-card__placeholder {
  color: var(--color-text-muted);
  opacity: 0.5;
}

.wiki-item-card__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--spacing-xs);
  min-width: 0;
}

.wiki-item-card__name {
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wiki-item-card__location {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wiki-category-page__loading,
.wiki-category-page__error {
  padding: var(--spacing-xl) 0;
}

.wiki-category-page__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.wiki-category-page__skeleton-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.skeleton-img {
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg, var(--color-surface-elevated) 25%, var(--color-border) 50%, var(--color-surface-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

.skeleton-text {
  height: 16px;
  background: linear-gradient(90deg, var(--color-surface-elevated) 25%, var(--color-border) 50%, var(--color-surface-elevated) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.skeleton-text--short {
  width: 60%;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wiki-category-page__error {
  text-align: center;
  color: var(--color-text-muted);
}

.wiki-category-page__empty {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-text-muted);
}
</style>