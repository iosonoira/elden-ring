<script setup lang="ts">
import type { WikiCategory } from '~/shared/types/EldenRingApi'

definePageMeta({ layout: 'default' })

const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()

const category = computed(() => route.params.category as WikiCategory)

const categories = [
  { key: 'armament', label: 'wiki.category.weapons', icon: 'swords' },
  { key: 'armor', label: 'wiki.category.armor', icon: 'shield_person' },
  { key: 'talisman', label: 'wiki.category.talismans', icon: 'brightness_7' },
  { key: 'magic', label: 'wiki.category.magic', icon: 'auto_awesome' },
  { key: 'ashesOfWar', label: 'wiki.category.ashesOfWar', icon: 'settings' },
  { key: 'spiritAshes', label: 'wiki.category.spiritAshes', icon: 'person_outline' },
]

const searchQuery = ref('')
const sortOption = ref<'az' | 'za'>('az')

const { items, loading, error, fetch } = useWikiCategory(category)

onMounted(() => {
  fetch()
})

watch(category, () => {
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

const categoryLabel = computed(() => {
  return `wiki.category.${category.value}`
})

useSeoMeta({
  title: computed(() => `${t(categoryLabel.value)} | Gilded Reliquary`),
  description: computed(() => t('wiki.category.desc', { category: t(categoryLabel.value) }))
})
</script>

<template>
  <div class="wiki-category-page">
    <header class="wiki-category-page__header">
      <nav class="wiki-category-page__breadcrumb">
        <NuxtLink :to="localePath('/wiki')">{{ $t('wiki.index.title') }}</NuxtLink>
        <Icon name="material-symbols:chevron-right" size="16" class="separator" />
        <span>{{ $t(categoryLabel) }}</span>
      </nav>
      
      <div class="wiki-category-page__title-group">
        <span class="wiki-category-page__subtitle">{{ $t('wiki.category.subtitle') }}</span>
        <h1 class="wiki-category-page__title">
          <Icon :name="`material-symbols:${categories.find(c => c.key === category)?.icon || 'inventory-2'}`" size="28" />
          {{ $t(categoryLabel) }}
        </h1>
      </div>
    </header>

    <div class="wiki-category-page__layout">
      <aside class="wiki-category-page__sidebar">
        <div class="sticky-top">
          <nav class="wiki-category-page__nav">
            <NuxtLink
              v-for="cat in categories"
              :key="cat.key"
              class="wiki-category-page__nav-item"
              :class="{ 'wiki-category-page__nav-item--active': category === cat.key }"
              :to="localePath(`/wiki/${cat.key}`)"
            >
              <Icon :name="`material-symbols:${cat.icon}`" size="20" />
              <span>{{ $t(cat.label) }}</span>
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <main class="wiki-category-page__content">
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
          <p>{{ $t('wiki.noItems') }}</p>
        </div>

        <div v-else class="wiki-category-page__grid">
          <WikiItemCard
            v-for="item in filteredItems"
            :key="item.id"
            :item="item"
            :category="category"
          />
        </div>
      </main>
    </div>
  </div>
</template>