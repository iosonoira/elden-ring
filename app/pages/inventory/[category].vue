<script setup lang="ts">
import { useCategoryPage } from '~/composables/useCategoryPage'
import { useSaveStore } from '~/stores/useSaveStore'

definePageMeta({ layout: 'default' })

const store = useSaveStore()
await callOnce(() => store.loadDatabase())

const {
  category,
  categoryTitle,
  activeFilter,
  items,
  stats,
  selectedItem,
  selectItem
} = useCategoryPage('owned') // inventory: default 'owned'

useSeoMeta({ title: `${categoryTitle.value} | Gilded Reliquary` })
</script>

<template>
  <div class="inventory-detail-page">
    <!-- Header -->
    <header class="inventory-detail-page__header">
      <div class="inventory-detail-page__title-group">
        <span class="inventory-detail-page__subtitle label-mono">Sovereign Collection</span>
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
        <!-- Grid -->
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

        <!-- Side Detail Panel -->
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
      
      <!-- Empty State -->
      <div v-else class="inventory-detail-page__empty glass-panel">
        <Icon name="material-symbols:inventory-2-outline" size="48" class="opacity-20" />
        <p class="label-mono uppercase mt-4">The archives are empty for this category</p>
        <p class="text-body opacity-60">Upload a save file or change the filter to reveal hidden artefacts.</p>
      </div>
    </ClientOnly>
  </div>
</template>