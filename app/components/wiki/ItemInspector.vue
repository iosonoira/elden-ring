<script setup lang="ts">
import { useWikiStore } from '~/stores/useWikiStore'

interface Item {
  id: string
  name: string
  class?: string
}

const props = defineProps<{
  item: Item
  category: string
  isOwned: boolean
}>()

const wikiStore = useWikiStore()

// computed reattivi al cambio di props — getCachedItem ritorna un computed
// ma il computed esterno garantisce che la chiave si aggiorni se props cambiano
const apiInfo = computed(() => wikiStore.cache[`${props.category}-${props.item.name}`] || null)
const isLoading = computed(() => wikiStore.loading[`${props.category}-${props.item.name}`] || false)

// Trigger fetch when item changes if not in cache
watch(
  () => [props.category, props.item.name] as const,
  ([cat, name]) => {
    if (name && !wikiStore.cache[`${cat}-${name}`]) {
      wikiStore.fetchItemDetails(cat, name)
    }
  },
  { immediate: true }
)

// Mapping static metadata if some things are missing from API but present in DB or elsewhere
</script>

<template>
  <div class="item-inspector glass-panel">
    <div v-if="isLoading" class="item-inspector__loader-overlay">
       <div class="item-detail-card__loader" />
       <p class="label-mono mt-4">Consulting the Archives...</p>
    </div>
    <div class="item-inspector__content" :class="{ 'opacity-20': isLoading }">
      <!-- Header -->
      <header class="item-inspector__header">
        <div class="item-inspector__title-group">
          <h3 class="item-inspector__name italic">{{ item.name }}</h3>
          <p class="item-inspector__class">{{ item.class || 'Sovereign Artefact' }}</p>
        </div>
        <Icon v-if="isOwned" name="material-symbols:star" class="item-inspector__star" size="24" />
      </header>

      <!-- Media Area -->
      <div class="item-inspector__media">
        <NuxtImg 
          v-if="apiInfo?.image"
          :src="apiInfo.image"
          :alt="item.name"
          class="item-inspector__img"
        />
        <div class="item-inspector__media-overlay" />
        <div v-if="isOwned" class="item-inspector__media-badge label-mono">
          AUTHENTIC ARCHIVE STATE
        </div>
      </div>

      <!-- Details Section -->
      <div v-if="apiInfo" class="item-inspector__details">
        <!-- Attack Power -->
        <div v-if="apiInfo.attack" class="item-inspector__stat-group">
          <div class="item-inspector__stat-header">
            <span class="label-mono">Attack Power</span>
            <span class="label-mono color-primary">Standard</span>
          </div>
          <div class="item-inspector__stat-grid">
            <div v-for="stat in apiInfo.attack.slice(0, 4)" :key="stat.name" class="stat-row">
              <span class="stat-label">{{ stat.name }}</span>
              <span class="stat-value">{{ stat.amount }}</span>
            </div>
          </div>
        </div>

        <!-- Scaling -->
        <div v-if="apiInfo.scalesWith && apiInfo.scalesWith.length > 0" class="item-inspector__stat-group">
          <div class="item-inspector__stat-header">
            <span class="label-mono">Attribute Scaling</span>
          </div>
          <div class="item-inspector__scaling-flex">
            <div 
              v-for="scale in apiInfo.scalesWith" 
              :key="scale.name"
              class="scaling-box"
              :class="{
                'scaling-box--active': scale.scaling && scale.scaling !== '-',
                'scaling-box--inactive': !scale.scaling || scale.scaling === '-'
              }"
            >
              <span class="scaling-label">{{ scale.name.substring(0, 3) }}</span>
              <span class="scaling-value">{{ scale.scaling || '–' }}</span>
            </div>
          </div>
        </div>

        <!-- Lore -->
        <div class="item-inspector__lore">
           <div class="item-inspector__stat-header">
            <span class="label-mono">Lore Fragment</span>
          </div>
          <p class="lore-text">{{ apiInfo.description || 'No description available for this heirloom.' }}</p>
        </div>
      </div>
      
      <div v-else class="item-inspector__placeholder">
        <p class="label-mono opacity-40">Consulting the Archives...</p>
      </div>

      <!-- Action -->
      <button class="item-inspector__action label-mono" :class="{ 'item-inspector__action--missing': !isOwned }">
        {{ isOwned ? 'MARK AS UNOWNED' : 'MARK AS ACQUIRED' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss">
// Styles in components/_item-inspector.scss
</style>
