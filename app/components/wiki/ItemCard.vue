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

// Use global cache instead of local fetch
const apiInfo = wikiStore.getCachedItem(props.category, props.item.name);
const isPending = wikiStore.isItemLoading(props.category, props.item.name);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries && entries[0] && entries[0].isIntersecting) {
      isVisible.value = true;
      // Trigger global fetch (it will skip if already in cache)
      wikiStore.fetchItemDetails(props.category, props.item.name);
      
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  }, {
    rootMargin: '200px',
    threshold: 0.01
  });

  if (cardRef.value) {
    observer.observe(cardRef.value);
  }
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
</script>

<template>
  <div ref="cardRef" class="item-card glass-panel" :class="{ 'item-card--loading': isPending }">
    <div class="item-card__image-container">
      <NuxtImg 
        v-if="apiInfo"
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


