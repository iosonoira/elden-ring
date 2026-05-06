<script setup lang="ts">
import { useEldenRingApi } from '~/composables/useEldenRingApi';

interface Item {
  id: string
  name: string
}

import { useWikiStore } from '~/stores/useWikiStore';

const props = defineProps<{
  item: Item
  category: string
}>()

const wikiStore = useWikiStore();
const cardRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

// Use global cache instead of local fetch (defensive check)
const apiInfo = computed(() => {
  if (!props.category || !props.item?.name) return null
  return wikiStore.getCachedItem(props.category, props.item.name)
})
const isPending = computed(() => {
  if (!props.category || !props.item?.name) return false
  return wikiStore.isItemLoading(props.category, props.item.name)
})

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!cardRef.value) return;

  observer = new IntersectionObserver((entries) => {
    if (entries && entries[0] && entries[0].isIntersecting) {
      isVisible.value = true;
      // Defensive: skip fetch if category or name is missing
      if (props.category && props.item?.name) {
        wikiStore.fetchItemDetails(props.category, props.item.name);
      }
      
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }, {
    rootMargin: '200px',
    threshold: 0.01
  });

  observer.observe(cardRef.value);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

function getWikiUrl(name: string) {
  const cleanName = name.replace(/ \+\d+$/, '').replaceAll(' ', '+');
  return `https://eldenring.wiki.fextralife.com/${cleanName}`
}

function openWiki() {
  window.open(getWikiUrl(props.item.name), '_blank')
}
</script>

<template>
  <div 
    ref="cardRef" 
    class="item-card glass-panel" 
    :class="{ 'item-card--loading': isPending }"
    tabindex="0"
    role="button"
    @keydown.enter="openWiki"
    @keydown.space.prevent="openWiki"
  >
    <div class="item-card__image-container">
      <NuxtImg 
        v-if="apiInfo && apiInfo.image"
        :src="apiInfo.image"
        :alt="item.name"
        class="item-card__image"
        loading="lazy"
      />
      <div v-if="isPending" class="item-card__loader" />
    </div>
    <div class="item-card__info">
      <h4 class="item-card__name">{{ item.name }}</h4>
      
      <div v-if="apiInfo" class="item-card__details">
        <p v-if="apiInfo.description" class="item-card__desc lore-text italic">{{ apiInfo.description }}</p>
      </div>

      <div class="item-card__actions">
        <a :href="getWikiUrl(item.name)" target="_blank" class="item-card__link label-mono">
          Wiki <Icon name="material-symbols:open-in-new" size="10" />
        </a>
      </div>
    </div>
  </div>
</template>


