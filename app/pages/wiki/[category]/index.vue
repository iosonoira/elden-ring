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