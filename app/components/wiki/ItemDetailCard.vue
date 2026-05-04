<script setup lang="ts">
interface Item {
  id: string
  name: string
  class?: string
  image?: string
}

const props = defineProps<{
  item: Item
  category: string
  isOwned: boolean
  isSelected?: boolean
}>()

defineEmits(['select'])

const wikiStore = useWikiStore()

// Use global cache for images
const apiInfo = wikiStore.getCachedItem(props.category, props.item.name)
const isLoading = wikiStore.isItemLoading(props.category, props.item.name)

onMounted(() => {
  // If not in cache, start fetching
  if (!apiInfo.value) {
    wikiStore.fetchItemDetails(props.category, props.item.name)
  }
})
</script>

<template>
  <div 
    class="item-detail-card glass-panel" 
    :class="{ 
      'item-detail-card--missing': !isOwned,
      'item-detail-card--selected': isSelected 
    }"
    @click="$emit('select', item)"
  >
    <div class="item-detail-card__inner">
      <!-- Status Badge -->
      <div class="item-detail-card__badge">
        <span v-if="isOwned" class="badge badge--owned">Owned</span>
        <span v-else class="badge badge--missing">Missing</span>
      </div>

      <!-- Image Area -->
      <div class="item-detail-card__image-wrap">
        <NuxtImg 
          v-if="apiInfo?.image"
          :src="apiInfo.image"
          :alt="item.name"
          class="item-detail-card__image"
          loading="lazy"
        />
        <div v-else-if="isLoading" class="item-detail-card__loader" />
        <div v-else class="item-detail-card__image-placeholder">
          <Icon name="material-symbols:image-outline" size="32" />
        </div>
      </div>

      <!-- Info -->
      <div class="item-detail-card__info">
        <h4 class="item-detail-card__name">{{ item.name }}</h4>
        <p class="item-detail-card__meta">
          {{ item.class || 'Artefact' }} • {{ isOwned ? 'Sovereign' : 'Relic' }}
        </p>
        
        <!-- Logic Progress Bar (visual only as per design) -->
        <div class="item-detail-card__progress">
          <div class="item-detail-card__progress-fill" :style="{ width: isOwned ? '100%' : '0%' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
// Styles are in components/_item-detail-card.scss
</style>
