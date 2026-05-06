<script setup lang="ts">
import { useSaveStore } from '~/stores/useSaveStore'

definePageMeta({ layout: 'default' })

const route = useRoute()
const store = useSaveStore()
await callOnce(() => store.loadDatabase())

const category = computed(() => route.params.category as string)

const categoryTitle = computed(() => {
  const titles: Record<string, string> = {
    armament: 'Armaments & Weapons',
    armor: 'Ancient Protections',
    talisman: 'Sacred Talismans',
    magic: 'Sorceries & Incantations',
    ashesOfWar: 'Ashes of War',
    spiritAshes: 'Spectral Spirits'
  }
  return titles[category.value] || 'The Archive'
})

// Filter state - default 'all' per Archives
const activeFilter = ref<'all' | 'owned' | 'missing'>('all')

// Data
const items = computed(() => {
  const allInCat: any[] = []
  const catKey = category.value as keyof typeof store.ownedItems
  
  if (activeFilter.value !== 'missing' && store.ownedItems?.[catKey]) {
    (store.ownedItems[catKey] as any[]).forEach((i: any) => allInCat.push({ ...i, owned: true }))
  }
  
  if (activeFilter.value !== 'owned' && store.missingItems?.[catKey]) {
    (store.missingItems[catKey] as any[]).forEach((i: any) => allInCat.push({ ...i, owned: false }))
  }
  
  return allInCat.sort((a, b) => a.name.localeCompare(b.name))
})

const stats = computed(() => {
  const catKey = category.value as keyof typeof store.stats
  return store.stats?.[catKey] || { owned: 0, total: 0 }
})

const selectedItem = ref<any>(null)
const selectItem = (item: any) => {
  selectedItem.value = item
}

watch([items, category], () => {
  if (items.value.length > 0) {
    const stillExists = items.value.find(i => i.id === selectedItem.value?.id)
    if (!stillExists) {
      selectedItem.value = items.value[0]
    }
  } else {
    selectedItem.value = null
  }
}, { immediate: true })

useSeoMeta({
  title: `${categoryTitle.value} | Archives`,
})
</script>

<template>
  <div class="inventory-detail-page">
    <header class="inventory-detail-page__header">
      <div class="inventory-detail-page__title-group">
        <span class="inventory-detail-page__subtitle label-mono">The Archives</span>
        <h1 class="inventory-detail-page__title">{{ categoryTitle }}</h1>
      </div>

      <div class="inventory-detail-page__controls">
          <div class="glass-panel inventory-detail-page__filter">
            <span class="label-mono">Filter by:</span>
            <select v-model="activeFilter" class="label-mono uppercase">
              <option value="all">All Items</option>
              <option value="owned">Owned</option>
              <option value="missing">Missing</option>
            </select>
          </div>
      </div>
    </header>

    <ClientOnly>
      <div v-if="items.length > 0" class="inventory-detail-page__layout">
        <section class="inventory-detail-page__grid-section">
          <div class="inventory-detail-page__section-header">
            <div class="inventory-detail-page__section-info">
              <Icon name="material-symbols:book-outline" size="28" class="grace-glow" />
              <h2 class="font-headline uppercase">{{ category }}</h2>
              <span class="badge badge--owned">{{ stats.owned }} / {{ stats.total }}</span>
            </div>
          </div>

          <div class="inventory-detail-page__grid">
            <WikiItemDetailCard 
              v-for="item in items" 
              :key="item.id" 
              :item="item" 
              :category="category" 
              :is-owned="item.owned"
              :is-selected="selectedItem?.id === item.id"
              @select="selectItem"
            />
          </div>
        </section>

        <aside v-if="selectedItem" class="inventory-detail-page__side-panel">
          <div class="item-inspector-wrap sticky-top">
            <WikiItemInspector 
              :item="selectedItem" 
              :category="category" 
              :is-owned="selectedItem.owned" 
            />
          </div>
        </aside>
      </div>
      
      <div v-else class="inventory-detail-page__empty glass-panel">
        <Icon name="material-symbols:inventory-2-outline" size="48" class="opacity-20" />
        <p class="label-mono uppercase mt-4">No items found in archives</p>
        <p class="text-body opacity-60">The database may be empty for this category.</p>
      </div>
    </ClientOnly>
  </div>
</template>