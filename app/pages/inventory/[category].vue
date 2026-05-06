<script setup lang="ts">
import { useCategoryPage } from '~/composables/useCategoryPage'
import { useSaveStore } from '~/stores/useSaveStore'

definePageMeta({ layout: 'default' })

const store = useSaveStore()

const {
  category,
  categoryTitle,
  activeFilter,
  items,
  paginatedItems,
  hasMore,
  loadMore,
  stats,
  selectedItem,
  selectItem
} = useCategoryPage('owned') // inventory: default 'owned'

const sentinel = useTemplateRef('sentinel')

let _sentinelObserver: IntersectionObserver | null = null

onMounted(() => {
  if (!sentinel.value) return
  _sentinelObserver = new IntersectionObserver(
    (entries) => { if (entries[0]?.isIntersecting) loadMore() },
    { rootMargin: '300px' }
  )
  _sentinelObserver.observe(sentinel.value)
})

onUnmounted(() => _sentinelObserver?.disconnect())

useSeoMeta({ title: computed(() => `${categoryTitle.value} | Gilded Reliquary`) })
</script>

<template>
  <div class="inventory-detail-page">
    <ClientOnly>
      <!-- Skeleton: DB non ancora pronto o nessun personaggio selezionato -->
      <WikiInventorySkeleton v-if="store.missingItems === null" />

      <!-- Contenuto reale: ha dati -->
      <template v-else-if="items.length > 0">
        <header class="inventory-detail-page__header">
          <div class="inventory-detail-page__title-group">
            <span class="inventory-detail-page__subtitle label-mono">Sovereign Collection</span>
            <h1 class="inventory-detail-page__title">{{ categoryTitle }}</h1>
          </div>
        </header>

        <div class="inventory-detail-page__layout">
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
                v-for="item in paginatedItems"
                :key="item.id"
                :item="item"
                :category="category"
                :is-owned="item.owned"
                :is-selected="selectedItem?.id === item.id"
                @select="selectItem"
              />
              <div v-if="hasMore" ref="sentinel" class="inventory-detail-page__sentinel" />
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
      </template>

      <!-- Empty state: DB pronto, file caricato, ma zero items nel filtro corrente -->
      <template v-else>
        <header class="inventory-detail-page__header">
          <div class="inventory-detail-page__title-group">
            <span class="inventory-detail-page__subtitle label-mono">Sovereign Collection</span>
            <h1 class="inventory-detail-page__title">{{ categoryTitle }}</h1>
          </div>
        </header>
        <div class="inventory-detail-page__empty glass-panel">
          <Icon name="material-symbols:inventory-2-outline" size="48" class="opacity-20" />
          <p class="label-mono uppercase mt-4">The archives are empty for this category</p>
          <p class="text-body opacity-60">Upload a save file or change the filter to reveal hidden artefacts.</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>